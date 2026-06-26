import db from "./db";
import { parseCurrencyToFloat } from "./crmDbHelper";
import { google } from "googleapis";

const GAS_URL =
  process.env.NEXT_PUBLIC_GAS_URL ||
  process.env.NEXT_PUBLIC_GAS_WEB_APP_URL ||
  process.env.GAS_WEB_APP_URL ||
  "https://script.google.com/macros/s/AKfycbyYKZf1JbQBUk5y8GcW86BgsIqyoRZypl849czqJWuhSfGLdzGdMOURO6sw9RlUE7fZ/exec";

// Simple in-memory cache to prevent syncing more than once every 5 minutes
let lastSyncTime = 0;
const SYNC_COOLDOWN_MS = 300000;

export async function syncGoogleSheetsToCrm(): Promise<void> {
  const now = Date.now();
  if (now - lastSyncTime < SYNC_COOLDOWN_MS) {
    console.log("[CRM Sync] Sincronização em cooldown, pulando...");
    return;
  }
  lastSyncTime = now;

  console.log("[CRM Sync] Iniciando sincronização ativa com Google Sheets...");

  try {
    // Leitura via Google Sheets API v4
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const sheetId = process.env.GOOGLE_SHEET_ID || "1D8kQJSUp5UwlUsc-9-P9Nj-rft0BADbGeBg0aHPjT-8";

    if (!clientEmail || !privateKey) {
      console.log("[CRM Sync] Credenciais Google não configuradas. Interrompendo sync.");
      return;
    }

    console.log("[CRM Sync] Executando batchGet na Google Sheets API...");
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: clientEmail, private_key: privateKey },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    
    const sheets = google.sheets({ version: "v4", auth });
    
    const ranges = ["Empresas!A:Z", "LeadsRapidos!A:Z", "DadosBancarios!A:Z", "Socios!A:Z", "FinanciamentoImobiliario!A:Z"];
    const res = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: sheetId,
      ranges: ranges,
    });
    
    const parseSheet = (sheetData: any) => {
      if (!sheetData || !sheetData.values || sheetData.values.length < 2) return [];
      const headers = sheetData.values[0];
      return sheetData.values.slice(1).map((row: any[]) => {
        const obj: any = {};
        headers.forEach((header: string, index: number) => {
          obj[header] = row[index] || "";
        });
        return obj;
      });
    };

    const valueRanges = res.data.valueRanges || [];
    const empresas = parseSheet(valueRanges[0]);
    const leads = parseSheet(valueRanges[1]);
    const bancos = parseSheet(valueRanges[2]);
    const socios = parseSheet(valueRanges[3]);
    const imobiliario = parseSheet(valueRanges[4]);

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
            db.prepare("UPDATE empresas SET faturamento = ?, razao_social = ?, fonte = 'Empresa' WHERE id = ?")
              .run(faturamento, emp["Razão Social"] || emp.RazaoSocial || cnpj, empresaId);
          } else {
            const res = db.prepare("INSERT INTO empresas (cnpj, razao_social, faturamento, fonte) VALUES (?, ?, ?, 'Empresa')")
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
            db.prepare("UPDATE empresas SET fonte = 'Lead Rápido' WHERE id = ?").run(empresaId);
          } else {
            const res = db.prepare("INSERT INTO empresas (cnpj, razao_social, faturamento, fonte) VALUES (?, ?, ?, 'Lead Rápido')")
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
