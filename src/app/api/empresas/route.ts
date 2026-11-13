import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { syncGoogleSheetsToCrm } from "@/lib/crmSync";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  if (!cookieStore.get("rmj_admin_session")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const cnpjParam = searchParams.get("cnpj");
    const cpfParam = searchParams.get("cpf");

    // Lookup por CNPJ ou CPF específico
    if (cnpjParam || cpfParam) {
      const cleanParam = (cnpjParam || cpfParam)!.replace(/\D/g, "");
      if (cleanParam.length >= 8) {
        const empresa = db.prepare(`
          SELECT e.*,
            (SELECT o.coluna_kanban FROM oportunidades o WHERE o.empresa_id = e.id ORDER BY o.created_at DESC, o.id DESC LIMIT 1) as ultima_etapa,
            (SELECT o.canal FROM oportunidades o WHERE o.empresa_id = e.id ORDER BY o.created_at DESC, o.id DESC LIMIT 1) as ultimo_canal
          FROM empresas e
          WHERE REPLACE(REPLACE(REPLACE(REPLACE(e.cnpj, '.', ''), '-', ''), '/', ''), ' ', '') = ?
             OR e.cnpj LIKE ?
             OR e.proposta_json LIKE ?
          LIMIT 1
        `).get(cleanParam, `%${cleanParam}%`, `%${cleanParam}%`) as any;

        if (empresa) {
          const contatos = db.prepare("SELECT * FROM contatos WHERE empresa_id = ?").all(empresa.id) as any[];
          let ficha: any = {};
          try {
            if (empresa.proposta_json) ficha = JSON.parse(empresa.proposta_json);
          } catch {}

          const representante = contatos[0]?.nome || ficha.emp_repr_nome || "";
          const cpfRepresentante = ficha.emp_repr_cpf || "";
          const telefone = contatos[0]?.whatsapp || ficha.emp_telefone || "";
          const email = ficha.emp_email || "";

          return NextResponse.json({
            found: true,
            empresa: {
              id: empresa.id,
              razaoSocial: empresa.razao_social,
              razao_social: empresa.razao_social,
              cnpj: empresa.cnpj,
              faturamento: empresa.faturamento,
              ultima_etapa: empresa.ultima_etapa || null,
              ultimo_canal: empresa.ultimo_canal || null,
              representante,
              cpfRepresentante,
              telefone,
              email,
              contatos
            }
          });
        }

        return NextResponse.json({ found: false, empresa: null });
      }
    }

    // Sincroniza dados da planilha do Google em background/realtime
    await syncGoogleSheetsToCrm();

    const empresas = db.prepare(`
      SELECT e.*, COUNT(o.id) as total_oportunidades 
      FROM empresas e
      LEFT JOIN oportunidades o ON e.id = o.empresa_id
      GROUP BY e.id
      ORDER BY e.razao_social ASC
    `).all();
    return NextResponse.json(empresas);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!cookieStore.get("rmj_admin_session")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const { cnpj, razao_social, faturamento, contatos } = await request.json();
    
    if (!cnpj || !razao_social || faturamento === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const insertEmpresa = db.prepare(`
      INSERT INTO empresas (cnpj, razao_social, faturamento)
      VALUES (?, ?, ?)
    `);

    const insertContato = db.prepare(`
      INSERT INTO contatos (empresa_id, nome, whatsapp, cargo)
      VALUES (?, ?, ?, ?)
    `);

    // Run in a transaction
    const transaction = db.transaction((empData, contactsData) => {
      const result = insertEmpresa.run(empData.cnpj, empData.razao_social, empData.faturamento);
      const empresaId = result.lastInsertRowid;

      if (contactsData && Array.isArray(contactsData)) {
        for (const contato of contactsData) {
          insertContato.run(empresaId, contato.nome, contato.whatsapp, contato.cargo);
        }
      }
      return empresaId;
    });

    const newId = transaction({ cnpj, razao_social, faturamento }, contatos);

    return NextResponse.json({ id: newId, message: "Empresa criada com sucesso" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
