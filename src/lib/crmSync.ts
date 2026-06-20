import db from "./db";
import { parseCurrencyToFloat } from "./crmDbHelper";
import { google } from "googleapis";

const GAS_URL =
  process.env.NEXT_PUBLIC_GAS_URL ||
  process.env.NEXT_PUBLIC_GAS_WEB_APP_URL ||
  process.env.GAS_WEB_APP_URL ||
  "https://script.google.com/macros/s/AKfycbyYKZf1JbQBUk5y8GcW86BgsIqyoRZypl849czqJWuhSfGLdzGdMOURO6sw9RlUE7fZ/exec";

// Simple in-memory cache to prevent syncing more than once every 10 seconds
let lastSyncTime = 0;
const SYNC_COOLDOWN_MS = 10000;

export async function syncGoogleSheetsToCrm(): Promise<void> {
  const now = Date.now();
  if (now - lastSyncTime < SYNC_COOLDOWN_MS) {
    console.log("[CRM Sync] Sincronização em cooldown, pulando...");
    return;
  }
  lastSyncTime = now;

  console.log("[CRM Sync] Iniciando sincronização ativa com Google Sheets...");

  try {
    // Tenta ler diretamente do Google Sheets via API (Nova Arquitetura)
    let empresas_pj_api: any[] = [];
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const sheetId = process.env.GOOGLE_SHEET_ID || "1JppJHhTWw8d4AV_4FAvGk-bEliLr-co-saAAhDSasKeXW-o4sl0DRPr1";

    if (clientEmail && privateKey) {
      try {
        console.log("[CRM Sync] Lendo diretamente via Google Sheets API...");
        const auth = new google.auth.GoogleAuth({
          credentials: { client_email: clientEmail, private_key: privateKey },
          scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        });
        const sheets = google.sheets({ version: "v4", auth });
        const res = await sheets.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range: "Respostas",
        });
        const rows = res.data.values;
        if (rows && rows.length > 1) {
          const headers = rows[0];
          empresas_pj_api = rows.slice(1).map(row => {
            const obj: any = {};
            headers.forEach((header: string, index: number) => {
              obj[header] = row[index] || "";
            });
            return obj;
          });
        }
      } catch (err: any) {
        console.error("[CRM Sync] Erro ao ler Google Sheets API:", err.message);
      }
    }

    // Leitura das planilhas antigas (v3.2) via Web App
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${GAS_URL}?api_secret=rmj-api-123`, {
      method: "GET",
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Apps Script retornou status HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data || data.error) {
      throw new Error(data?.error || "Resposta JSON inválida");
    }

    const { empresas, socios, bancos, imobiliario, leads } = data;
    // Se a Sheets API falhou ou não está configurada, usa o fallback do Web App se existir
    const empresas_pj = empresas_pj_api.length > 0 ? empresas_pj_api : (data.empresas_pj || []);

    // Run inside a database transaction
    const transaction = db.transaction(() => {
      const defaultChecklist = JSON.stringify([
        { item: "Imóvel", validado: false },
        { item: "Recebíveis", validado: false },
        { item: "Aval dos sócios", validado: false },
        { item: "Veículos", validado: false },
        { item: "Equipamentos", validado: false }
      ]);

      // 1. Sync Empresas (BDMG)
      if (empresas && Array.isArray(empresas)) {
        for (const emp of empresas) {
          const cnpj = emp.CNPJ;
          if (!cnpj) continue;

          // Check if exists
          const existing = db.prepare("SELECT id FROM empresas WHERE cnpj = ?").get(cnpj) as { id: number } | undefined;
          let empresaId: number | bigint;

          const faturamento = parseCurrencyToFloat(emp.Faturamento);

          if (existing) {
            empresaId = existing.id;
            db.prepare("UPDATE empresas SET faturamento = ?, razao_social = ? WHERE id = ?")
              .run(faturamento, emp["Razão Social"] || emp.RazaoSocial || cnpj, empresaId);
          } else {
            const res = db.prepare("INSERT INTO empresas (cnpj, razao_social, faturamento) VALUES (?, ?, ?)")
              .run(cnpj, emp["Razão Social"] || emp.RazaoSocial || cnpj, faturamento);
            empresaId = res.lastInsertRowid;
          }

          // Check and sync associated opportunity
          const oppExisting = db.prepare("SELECT id FROM oportunidades WHERE empresa_id = ? AND canal = 'Capital de Giro BDMG'")
            .get(empresaId);

          if (!oppExisting) {
            // Find valor solicitado from DadosBancarios associated with this CNPJ
            let valorSolicitado = 0;
            if (bancos && Array.isArray(bancos)) {
              const bancoObj = bancos.find((b: any) => b["CNPJ Empresa"] === cnpj);
              // In BDMG, the bank schema could hold the requested value or we can fallback
              // We'll set a default of 50000 or use faturamento based logic if not found
            }
            if (valorSolicitado === 0) valorSolicitado = 100000; // default template BDMG value

            const comissaoEsperada = valorSolicitado * 0.04;

            db.prepare(`
              INSERT INTO oportunidades (
                empresa_id, valor_solicitado, comissao_esperada, status_repasse, coluna_kanban, checklist_garantias, canal
              )
              VALUES (?, ?, ?, 'pendente', 'prospect', ?, 'Capital de Giro BDMG')
            `).run(empresaId, valorSolicitado, comissaoEsperada, defaultChecklist);
          }
        }
      }

      // Sync Socios into Contacts
      if (socios && Array.isArray(socios)) {
        for (const socio of socios) {
          const cnpjEmp = socio["CNPJ Empresa"];
          const nomeSocio = socio["Nome Sócio"] || socio.NomeSocio;
          if (!cnpjEmp || !nomeSocio) continue;

          const empRow = db.prepare("SELECT id FROM empresas WHERE cnpj = ?").get(cnpjEmp) as { id: number } | undefined;
          if (!empRow) continue;

          const existingContato = db.prepare("SELECT id FROM contatos WHERE empresa_id = ? AND nome = ?")
            .get(empRow.id, nomeSocio) as { id: number } | undefined;

          if (!existingContato) {
            db.prepare("INSERT INTO contatos (empresa_id, nome, whatsapp, cargo) VALUES (?, ?, ?, ?)")
              .run(empRow.id, nomeSocio, socio["Telefone Sócio"] || socio.TelefoneSocio || "", socio.Cargo || "Sócio");
          }
        }
      }

      // 2. Sync Financiamento Imobiliario
      if (imobiliario && Array.isArray(imobiliario)) {
        for (const imob of imobiliario) {
          const cpf = imob["CPF Proponente"] || imob.CPFProponente;
          const nome = imob["Nome Proponente"] || imob.NomeProponente;
          if (!cpf || !nome) continue;

          const existing = db.prepare("SELECT id FROM empresas WHERE cnpj = ?").get(cpf) as { id: number } | undefined;
          let empresaId: number | bigint;

          const renda = parseCurrencyToFloat(imob["Renda Mensal"] || imob.RendaMensal);
          const valorFinanciado = parseCurrencyToFloat(imob["Valor Financiado"] || imob.ValorFinanciado);

          if (existing) {
            empresaId = existing.id;
            db.prepare("UPDATE empresas SET faturamento = ?, razao_social = ? WHERE id = ?")
              .run(renda, `${nome} (Crédito Imobiliário)`, empresaId);
          } else {
            const res = db.prepare("INSERT INTO empresas (cnpj, razao_social, faturamento) VALUES (?, ?, ?)")
              .run(cpf, `${nome} (Crédito Imobiliário)`, renda);
            empresaId = res.lastInsertRowid;
          }

          // Insert contact
          const existingContato = db.prepare("SELECT id FROM contatos WHERE empresa_id = ? AND nome = ?")
            .get(empresaId, nome) as { id: number } | undefined;

          if (!existingContato) {
            db.prepare("INSERT INTO contatos (empresa_id, nome, whatsapp, cargo) VALUES (?, ?, ?, ?)")
              .run(empresaId, nome, imob["Celular Proponente"] || imob.CelularProponente || "", "Proponente Principal");
          }

          // Insert opportunity
          const oppExisting = db.prepare("SELECT id FROM oportunidades WHERE empresa_id = ? AND canal = 'Financiamento Imobiliário'")
            .get(empresaId);

          if (!oppExisting) {
            const comissaoEsperada = valorFinanciado * 0.025;
            db.prepare(`
              INSERT INTO oportunidades (
                empresa_id, valor_solicitado, comissao_esperada, status_repasse, coluna_kanban, checklist_garantias, canal
              )
              VALUES (?, ?, ?, 'pendente', 'prospect', ?, 'Financiamento Imobiliário')
            `).run(empresaId, valorFinanciado, comissaoEsperada, defaultChecklist);
          }
        }
      }

      // 3. Sync LeadsRapidos
      if (leads && Array.isArray(leads)) {
        for (const lead of leads) {
          const nome = lead.Nome;
          const email = lead.Email || lead["E-mail"];
          const telefone = lead.Telefone;
          if (!nome) continue;

          const cnpjKey = lead.CNPJ || `PF-${email || telefone || nome}`;

          const existing = db.prepare("SELECT id FROM empresas WHERE cnpj = ?").get(cnpjKey) as { id: number } | undefined;
          let empresaId: number | bigint;

          const valorSolicitado = parseCurrencyToFloat(lead["Valor Solicitado"] || lead.ValorSolicitado);

          if (existing) {
            empresaId = existing.id;
          } else {
            const res = db.prepare("INSERT INTO empresas (cnpj, razao_social, faturamento) VALUES (?, ?, ?)")
              .run(cnpjKey, lead.Empresa || `${nome} (Pessoa Física)`, 0);
            empresaId = res.lastInsertRowid;
          }

          // Insert contact
          const existingContato = db.prepare("SELECT id FROM contatos WHERE empresa_id = ? AND nome = ?")
            .get(empresaId, nome) as { id: number } | undefined;

          if (!existingContato) {
            db.prepare("INSERT INTO contatos (empresa_id, nome, whatsapp, cargo) VALUES (?, ?, ?, ?)")
              .run(empresaId, nome, telefone || "", "Lead");
          }

          // Insert opportunity
          const canal = lead["Serviço"] || lead.Servico || "Geral";
          const oppExisting = db.prepare("SELECT id FROM oportunidades WHERE empresa_id = ? AND canal = ?")
            .get(empresaId, canal);

          if (!oppExisting) {
            const comissaoEsperada = valorSolicitado * 0.04;
            db.prepare(`
              INSERT INTO oportunidades (
                empresa_id, valor_solicitado, comissao_esperada, status_repasse, coluna_kanban, checklist_garantias, canal
              )
              VALUES (?, ?, ?, 'pendente', 'prospect', ?, ?)
            `).run(empresaId, valorSolicitado, comissaoEsperada, defaultChecklist, canal);
          }
        }
      }

      // 4. Sync Empresas PJ (Formulário 4.4.0 Completo)
      if (empresas_pj && Array.isArray(empresas_pj)) {
        for (const emp of empresas_pj) {
          const cnpj = emp.emp_cnpj;
          const razao = emp.emp_razao || "Empresa PJ sem Razão";
          if (!cnpj) continue;

          const faturamento = parseCurrencyToFloat(emp.emp_faturamento);
          const rawJson = JSON.stringify(emp);

          const existing = db.prepare("SELECT id FROM empresas WHERE cnpj = ?").get(cnpj) as { id: number } | undefined;
          let empresaId: number | bigint;

          if (existing) {
            empresaId = existing.id;
            db.prepare("UPDATE empresas SET faturamento = ?, razao_social = ?, proposta_json = ? WHERE id = ?")
              .run(faturamento, razao, rawJson, empresaId);
          } else {
            const res = db.prepare("INSERT INTO empresas (cnpj, razao_social, faturamento, proposta_json) VALUES (?, ?, ?, ?)")
              .run(cnpj, razao, faturamento, rawJson);
            empresaId = res.lastInsertRowid;
          }

          // Inserir oportunidade padrão BDMG se não houver
          const oppExisting = db.prepare("SELECT id FROM oportunidades WHERE empresa_id = ? AND canal = 'Capital de Giro BDMG'").get(empresaId);
          if (!oppExisting) {
            const defaultChecklist = JSON.stringify([
              { item: "Imóvel", validado: false },
              { item: "Recebíveis", validado: false },
              { item: "Aval dos sócios", validado: false },
              { item: "Veículos", validado: false },
              { item: "Equipamentos", validado: false }
            ]);
            db.prepare(`
              INSERT INTO oportunidades (
                empresa_id, valor_solicitado, comissao_esperada, status_repasse, coluna_kanban, checklist_garantias, canal
              ) VALUES (?, ?, ?, 'pendente', 'prospect', ?, 'Capital de Giro BDMG')
            `).run(empresaId, 0, 0, defaultChecklist);
          }
        }
      }
    });

    transaction();
    console.log("[CRM Sync] Sincronização concluída com sucesso!");
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.warn("[CRM Sync] Sincronização cancelada por atingir limite de tempo (timeout de 4s).");
    } else {
      console.error("[CRM Sync] Erro ao sincronizar Google Sheets para CRM local:", error);
    }
  }
}
