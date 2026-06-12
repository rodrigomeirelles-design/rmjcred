import db from "./db";
import { parseCurrencyToFloat } from "./crmDbHelper";

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
    // AbortController to set a 4-second timeout so the site never hangs if Google is slow
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(GAS_URL, {
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
