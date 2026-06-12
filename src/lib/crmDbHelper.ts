import db from "./db";

// Helper to parse currency string (like "R$ 50.000,00" or "50000") to float
export function parseCurrencyToFloat(val: any): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === "number") return val;
  const str = String(val).trim();
  // Remove currency symbols, dots, spaces, and replace comma with dot
  const cleaned = str
    .replace(/[R\$\s\.]/g, "")
    .replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export interface LeadInput {
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  cnpj?: string;
  servico: string;
  valor: any;
}

export function saveLeadToCrm(lead: LeadInput) {
  try {
    const finalCnpj = lead.cnpj?.trim() || `PF-${lead.email?.trim() || lead.telefone?.trim() || Date.now()}`;
    const finalRazao = lead.empresa?.trim() || `${lead.nome?.trim()} (Pessoa Física)`;
    const valorSolicitado = parseCurrencyToFloat(lead.valor);
    const comissaoEsperada = valorSolicitado * 0.04;

    const defaultChecklist = JSON.stringify([
      { item: "Imóvel", validado: false },
      { item: "Recebíveis", validado: false },
      { item: "Aval dos sócios", validado: false },
      { item: "Veículos", validado: false },
      { item: "Equipamentos", validado: false }
    ]);

    const transaction = db.transaction(() => {
      // 1. Insert or get company
      let empresaId: number | bigint;
      const existing = db.prepare("SELECT id FROM empresas WHERE cnpj = ?").get(finalCnpj) as { id: number } | undefined;
      
      if (existing) {
        empresaId = existing.id;
      } else {
        // Note: the schema defines 'razao_social' with 'o' and not 'o' with til
        const res = db.prepare("INSERT INTO empresas (cnpj, razao_social, faturamento) VALUES (?, ?, ?)")
          .run(finalCnpj, finalRazao, 0); // Faturamento 0 for lead
        empresaId = res.lastInsertRowid;
      }

      // 2. Insert contact if not exists
      const existingContato = db.prepare("SELECT id FROM contatos WHERE empresa_id = ? AND nome = ?")
        .get(empresaId, lead.nome) as { id: number } | undefined;

      if (!existingContato) {
        db.prepare("INSERT INTO contatos (empresa_id, nome, whatsapp, cargo) VALUES (?, ?, ?, ?)")
          .run(empresaId, lead.nome, lead.telefone, "Lead");
      }

      // 3. Insert opportunity
      db.prepare(`
        INSERT INTO oportunidades (
          empresa_id, valor_solicitado, comissao_esperada, status_repasse, coluna_kanban, checklist_garantias, canal
        )
        VALUES (?, ?, ?, 'pendente', 'prospect', ?, ?)
      `).run(empresaId, valorSolicitado, comissaoEsperada, defaultChecklist, lead.servico || "Geral");
    });

    transaction();
    console.log(`[CRM] Lead de ${lead.nome} salvo com sucesso no banco de dados!`);
    return { success: true };
  } catch (error) {
    console.error("[CRM] Erro ao salvar Lead no banco de dados:", error);
    return { success: false, error };
  }
}

export function saveBdmgToCrm(payload: any) {
  try {
    const { empresa, socios, bancario } = payload;
    const finalCnpj = empresa.emp_cnpj;
    const finalRazao = empresa.emp_razao;
    const faturamento = parseCurrencyToFloat(empresa.emp_faturamento);
    const valorSolicitado = parseCurrencyToFloat(bancario?.valor_solicitado);
    const comissaoEsperada = valorSolicitado * 0.04;

    const defaultChecklist = JSON.stringify([
      { item: "Imóvel", validado: false },
      { item: "Recebíveis", validado: false },
      { item: "Aval dos sócios", validado: false },
      { item: "Veículos", validado: false },
      { item: "Equipamentos", validado: false }
    ]);

    const transaction = db.transaction(() => {
      // 1. Insert or get company
      let empresaId: number | bigint;
      const existing = db.prepare("SELECT id FROM empresas WHERE cnpj = ?").get(finalCnpj) as { id: number } | undefined;
      
      if (existing) {
        empresaId = existing.id;
        // Update faturamento
        db.prepare("UPDATE empresas SET faturamento = ?, razao_social = ? WHERE id = ?")
          .run(faturamento, finalRazao, empresaId);
      } else {
        const res = db.prepare("INSERT INTO empresas (cnpj, razao_social, faturamento) VALUES (?, ?, ?)")
          .run(finalCnpj, finalRazao, faturamento);
        empresaId = res.lastInsertRowid;
      }

      // 2. Insert contacts
      if (socios && Array.isArray(socios)) {
        for (const socio of socios) {
          const existingContato = db.prepare("SELECT id FROM contatos WHERE empresa_id = ? AND nome = ?")
            .get(empresaId, socio.soc_nome) as { id: number } | undefined;

          if (!existingContato) {
            db.prepare("INSERT INTO contatos (empresa_id, nome, whatsapp, cargo) VALUES (?, ?, ?, ?)")
              .run(empresaId, socio.soc_nome, socio.soc_whatsapp, socio.soc_cargo || "Sócio");
          }
        }
      }

      // 3. Insert opportunity
      db.prepare(`
        INSERT INTO oportunidades (
          empresa_id, valor_solicitado, comissao_esperada, status_repasse, coluna_kanban, checklist_garantias, canal
        )
        VALUES (?, ?, ?, 'pendente', 'prospect', ?, 'Capital de Giro BDMG')
      `).run(empresaId, valorSolicitado, comissaoEsperada, defaultChecklist);
    });

    transaction();
    console.log(`[CRM] Proposta BDMG de ${finalRazao} salva com sucesso no banco de dados!`);
    return { success: true };
  } catch (error) {
    console.error("[CRM] Erro ao salvar Proposta BDMG no banco de dados:", error);
    return { success: false, error };
  }
}

export function saveImobiliarioToCrm(payload: any) {
  try {
    const { proponente, segundo_proponente, imovel, financ } = payload;
    const finalCnpj = proponente.cpf;
    const finalRazao = `${proponente.nome} (Crédito Imobiliário)`;
    const faturamento = parseCurrencyToFloat(proponente.renda);
    const valorSolicitado = parseCurrencyToFloat(financ?.valor_financ || imovel?.valor_compra);
    const comissaoEsperada = valorSolicitado * 0.025; // 2.5% default for real estate commission

    const defaultChecklist = JSON.stringify([
      { item: "Imóvel", validado: false },
      { item: "Recebíveis", validado: false },
      { item: "Aval dos sócios", validado: false },
      { item: "Veículos", validado: false },
      { item: "Equipamentos", validado: false }
    ]);

    const transaction = db.transaction(() => {
      // 1. Insert or get company
      let empresaId: number | bigint;
      const existing = db.prepare("SELECT id FROM empresas WHERE cnpj = ?").get(finalCnpj) as { id: number } | undefined;
      
      if (existing) {
        empresaId = existing.id;
        // Update faturamento
        db.prepare("UPDATE empresas SET faturamento = ?, razao_social = ? WHERE id = ?")
          .run(faturamento, finalRazao, empresaId);
      } else {
        const res = db.prepare("INSERT INTO empresas (cnpj, razao_social, faturamento) VALUES (?, ?, ?)")
          .run(finalCnpj, finalRazao, faturamento);
        empresaId = res.lastInsertRowid;
      }

      // 2. Insert primary contact
      const existingContato = db.prepare("SELECT id FROM contatos WHERE empresa_id = ? AND nome = ?")
        .get(empresaId, proponente.nome) as { id: number } | undefined;

      if (!existingContato) {
        db.prepare("INSERT INTO contatos (empresa_id, nome, whatsapp, cargo) VALUES (?, ?, ?, ?)")
          .run(empresaId, proponente.nome, proponente.whatsapp || proponente.telefone, "Proponente Principal");
      }

      // 3. Insert secondary contact if exists
      if (segundo_proponente && segundo_proponente.nome) {
        const existingContato2 = db.prepare("SELECT id FROM contatos WHERE empresa_id = ? AND nome = ?")
          .get(empresaId, segundo_proponente.nome) as { id: number } | undefined;

        if (!existingContato2) {
          db.prepare("INSERT INTO contatos (empresa_id, nome, whatsapp, cargo) VALUES (?, ?, ?, ?)")
            .run(empresaId, segundo_proponente.nome, segundo_proponente.whatsapp || segundo_proponente.telefone, "Segundo Proponente");
        }
      }

      // 4. Insert opportunity
      db.prepare(`
        INSERT INTO oportunidades (
          empresa_id, valor_solicitado, comissao_esperada, status_repasse, coluna_kanban, checklist_garantias, canal
        )
        VALUES (?, ?, ?, 'pendente', 'prospect', ?, 'Financiamento Imobiliário')
      `).run(empresaId, valorSolicitado, comissaoEsperada, defaultChecklist);
    });

    transaction();
    console.log(`[CRM] Proposta Imobiliário de ${proponente.nome} salva com sucesso no banco de dados!`);
    return { success: true };
  } catch (error) {
    console.error("[CRM] Erro ao salvar Proposta Imobiliário no banco de dados:", error);
    return { success: false, error };
  }
}
