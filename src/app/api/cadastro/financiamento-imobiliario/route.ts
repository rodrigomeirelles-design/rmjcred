import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("Nova Ficha Financiamento Imobiliário recebida:", payload);

    const { 
      simulacao, 
      proponente, 
      segundo_proponente: segundoProponente, 
      endereco_proponente: enderecoProponente, 
      dados_imovel: imovel, 
      endereco_imovel: enderecoImovel, 
      financeiro, 
      info_adicional: observacoes 
    } = payload;

    if (!proponente || !proponente.nome || !proponente.cpf || !proponente.email) {
      return NextResponse.json(
        { success: false, error: "Dados do proponente incompletos." },
        { status: 400 }
      );
    }

    // Clean currency values from mask format
    const parseCurrency = (val: string) => {
      if (!val) return 0;
      const clean = val.replace(/[^\d]/g, "");
      return clean ? parseInt(clean, 10) / 100 : 0;
    };

    const valorImovel = parseCurrency(simulacao?.valor_imovel || "");
    const valorFinanciamento = parseCurrency(simulacao?.valor_financiamento || "");
    const rendaMensal = parseCurrency(financeiro?.renda_mensal || "");

    // Run DB changes in a transaction
    db.transaction(() => {
      // 1. Create or find empresa record (using CPF as identifier for PF)
      const cpfClean = proponente.cpf.replace(/\D/g, "");
      let empresaId: number;
      
      // For PF (physical person), we use CPF formatted as a CNPJ-like key
      const existing = db.prepare("SELECT id FROM empresas WHERE cnpj = ?").get(proponente.cpf) as any;

      if (existing) {
        empresaId = existing.id;
        db.prepare("UPDATE empresas SET razao_social = ?, faturamento = ? WHERE id = ?")
          .run(proponente.nome, rendaMensal * 12, empresaId);
      } else {
        const result = db.prepare("INSERT INTO empresas (cnpj, razao_social, faturamento) VALUES (?, ?, ?)")
          .run(proponente.cpf, proponente.nome, rendaMensal * 12);
        empresaId = result.lastInsertRowid as number;
      }

      // 2. Insert Contato (Proponente)
      const hasProponente = db.prepare("SELECT id FROM contatos WHERE empresa_id = ? AND nome = ?")
        .get(empresaId, proponente.nome);
      if (!hasProponente) {
        db.prepare("INSERT INTO contatos (empresa_id, nome, whatsapp, cargo) VALUES (?, ?, ?, ?)")
          .run(empresaId, proponente.nome, proponente.celular, "Proponente Principal");
      }

      // 3. Insert Second Proponent as contact if exists
      if (segundoProponente && segundoProponente.nome) {
        const hasSegundo = db.prepare("SELECT id FROM contatos WHERE empresa_id = ? AND nome = ?")
          .get(empresaId, segundoProponente.nome);
        if (!hasSegundo) {
          db.prepare("INSERT INTO contatos (empresa_id, nome, whatsapp, cargo) VALUES (?, ?, ?, ?)")
            .run(empresaId, segundoProponente.nome, segundoProponente.celular || "", "Segundo Proponente");
        }
      }

      // 4. Create Oportunidade in the pipeline
      const defaultChecklist = JSON.stringify([
        { item: "Comprovante de renda", validado: false },
        { item: "RG/CPF", validado: false },
        { item: "Comprovante de residência", validado: false },
        { item: "Certidão de estado civil", validado: false },
        { item: "Extrato FGTS", validado: false },
        { item: "Matrícula do imóvel", validado: false }
      ]);

      const comissaoEstimada = valorFinanciamento * 0.025; // 2.5% estimated commission

      db.prepare(`
        INSERT INTO oportunidades (
          empresa_id, 
          valor_solicitado, 
          valor_aprovado,
          comissao_esperada, 
          status_repasse, 
          coluna_kanban, 
          checklist_garantias,
          canal,
          modo_comissao,
          comissao_porcentagem,
          data_proposta,
          created_at,
          updated_at
        )
        VALUES (?, ?, NULL, ?, 'pendente', 'prospect', ?, 'Financiamento Imobiliário', 'credito', 2.5, date('now'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).run(empresaId, valorFinanciamento, comissaoEstimada, defaultChecklist);

      // 5. Store full payload as JSON in a dedicated table for complete data
      db.prepare("INSERT INTO fichas_imobiliario (empresa_id, payload) VALUES (?, ?)")
        .run(empresaId, JSON.stringify(payload));
    })();

    // Google Apps Script backup integration
    const gasUrl = process.env.GAS_WEB_APP_URL;
    if (gasUrl) {
      try {
        const gasResponse = await fetch(gasUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "financiamento_imobiliario",
            dados: payload,
          }),
        });

        const gasData = await gasResponse.json();
        if (!gasData.success) {
          console.warn("GAS retornou erro:", gasData);
        } else {
          console.log("Dados de financiamento imobiliário salvos no Google Sheets (GAS)");
        }
      } catch (gasErr) {
        console.error("Erro ao enviar dados para Google Sheets (GAS):", gasErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Proposta de financiamento imobiliário registrada com sucesso no CRM!"
    });
  } catch (error: any) {
    console.error("Erro na API de financiamento imobiliário:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
