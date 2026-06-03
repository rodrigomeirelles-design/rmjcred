import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const oportunidades = db.prepare(`
      SELECT o.*, e.razao_social, e.cnpj 
      FROM oportunidades o
      JOIN empresas e ON o.empresa_id = e.id
      ORDER BY o.updated_at DESC
    `).all();
    return NextResponse.json(oportunidades);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { empresa_id, valor_solicitado, comissao_esperada } = await request.json();

    if (!empresa_id || valor_solicitado === undefined || comissao_esperada === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const defaultChecklist = JSON.stringify([
      { item: "Imóvel", validado: false },
      { item: "Recebíveis", validado: false },
      { item: "Aval dos sócios", validado: false },
      { item: "Veículos", validado: false },
      { item: "Equipamentos", validado: false }
    ]);

    const result = db.prepare(`
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
    `).run(empresa_id, valor_solicitado, comissao_esperada, defaultChecklist);

    return NextResponse.json({ id: result.lastInsertRowid, message: "Oportunidade criada com sucesso" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
