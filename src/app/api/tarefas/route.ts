import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// GET /api/tarefas - List all tasks
export async function GET() {
  try {
    const tarefas = db.prepare(`
      SELECT t.*, o.coluna_kanban, o.valor_solicitado
      FROM tarefas t
      LEFT JOIN oportunidades o ON t.oportunidade_id = o.id
      ORDER BY t.concluida ASC, t.data_vencimento ASC
    `).all();
    return NextResponse.json(tarefas);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/tarefas - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { oportunidade_id, cliente_nome, tipo, descricao, data_vencimento } = body;

    if (!cliente_nome || !descricao || !data_vencimento) {
      return NextResponse.json(
        { error: "Campos obrigatórios: cliente_nome, descricao, data_vencimento" },
        { status: 400 }
      );
    }

    const result = db.prepare(`
      INSERT INTO tarefas (oportunidade_id, cliente_nome, tipo, descricao, data_vencimento)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      oportunidade_id || null,
      cliente_nome,
      tipo || "Manual",
      descricao,
      data_vencimento
    );

    return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
