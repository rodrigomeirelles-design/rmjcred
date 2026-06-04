import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("Nova Ficha PJ BDMG recebida na API:", payload);

    const { empresa, socios, bancario } = payload;

    if (!empresa || !empresa.emp_cnpj || !empresa.emp_razao) {
      return NextResponse.json({ success: false, error: "Dados da empresa incompletos." }, { status: 400 });
    }

    // Clean faturamento and numeric values from mask format
    const parseCurrency = (val: string) => {
      if (!val) return 0;
      const clean = val.replace(/[^\d]/g, "");
      return clean ? parseInt(clean, 10) / 100 : 0;
    };

    const faturamentoVal = parseCurrency(empresa.emp_faturamento);

    // Run DB changes in a transaction
    db.transaction(() => {
      // 1. Insert or Update Empresa
      let empresaId: number;
      const existing = db.prepare("SELECT id FROM empresas WHERE cnpj = ?").get(empresa.emp_cnpj) as any;

      if (existing) {
        empresaId = existing.id;
        db.prepare("UPDATE empresas SET faturamento = ?, razao_social = ? WHERE id = ?")
          .run(faturamentoVal, empresa.emp_razao, empresaId);
      } else {
        const result = db.prepare("INSERT INTO empresas (cnpj, razao_social, faturamento) VALUES (?, ?, ?)")
          .run(empresa.emp_cnpj, empresa.emp_razao, faturamentoVal);
        empresaId = result.lastInsertRowid as number;
      }

      // 2. Insert Contatos (Representante + Sócios)
      // Check if Representative already exists
      const hasRepr = db.prepare("SELECT id FROM contatos WHERE empresa_id = ? AND nome = ?")
        .get(empresaId, empresa.emp_repr_nome);
      if (!hasRepr) {
        db.prepare("INSERT INTO contatos (empresa_id, nome, whatsapp, cargo) VALUES (?, ?, ?, ?)")
          .run(empresaId, empresa.emp_repr_nome, empresa.emp_telefone, "Representante Legal");
      }

      if (socios && Array.isArray(socios)) {
        for (const socio of socios) {
          if (socio.dados && socio.dados.nome) {
            const hasSocio = db.prepare("SELECT id FROM contatos WHERE empresa_id = ? AND nome = ?")
              .get(empresaId, socio.dados.nome);
            if (!hasSocio) {
              db.prepare("INSERT INTO contatos (empresa_id, nome, whatsapp, cargo) VALUES (?, ?, ?, ?)")
                .run(empresaId, socio.dados.nome, socio.dados.telefone, "Sócio");
            }
          }
        }
      }

      // 3. Create Oportunidade in the 'prospect' column
      const defaultChecklist = JSON.stringify([
        { item: "Imóvel", validado: false },
        { item: "Recebíveis", validado: false },
        { item: "Aval dos sócios", validado: false },
        { item: "Veículos", validado: false },
        { item: "Equipamentos", validado: false }
      ]);

      const valorSolicitado = 100000; // Default requested limit: 100k BRL
      const comissaoEsperada = 4000; // Default expected commission: 4k BRL (4%)

      db.prepare(`
        INSERT INTO oportunidades (
          empresa_id, 
          valor_solicitado, 
          valor_aprovado,
          comissao_esperada, 
          status_repasse, 
          coluna_kanban, 
          checklist_garantias,
          created_at,
          updated_at
        )
        VALUES (?, ?, NULL, ?, 'pendente', 'prospect', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).run(empresaId, valorSolicitado, comissaoEsperada, defaultChecklist);
    })();

    // Google Apps Script backup integration
    const gasUrl = process.env.GAS_WEB_APP_URL;
    if (gasUrl) {
      try {
        const gasResponse = await fetch(gasUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "cadastro_pj",
            dados: payload,
          }),
        });

        const gasData = await gasResponse.json();
        if (!gasData.success) {
          console.warn("GAS retornou erro:", gasData);
        } else {
          console.log("Dados salvos com sucesso no Google Sheets (GAS)");
        }
      } catch (gasErr) {
        console.error("Erro ao enviar dados para Google Sheets (GAS):", gasErr);
      }
    }

    return NextResponse.json({ success: true, message: "Cadastro e proposta salvos no CRM local com sucesso!" });
  } catch (error: any) {
    console.error("Erro na API de cadastro BDMG:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
