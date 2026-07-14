import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { syncGoogleSheetsToCrm } from "@/lib/crmSync";

export async function GET() {
  const cookieStore = await cookies();
  if (!cookieStore.get("rmj_admin_session")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
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
