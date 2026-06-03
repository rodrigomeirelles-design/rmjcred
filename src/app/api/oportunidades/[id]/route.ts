import { NextResponse } from "next/server";
import db from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const oportId = parseInt(id, 10);

    const oportunidade = db.prepare(`
      SELECT o.*, e.razao_social, e.cnpj 
      FROM oportunidades o
      JOIN empresas e ON o.empresa_id = e.id
      WHERE o.id = ?
    `).get(oportId);

    if (!oportunidade) {
      return NextResponse.json({ error: "Oportunidade não encontrada" }, { status: 404 });
    }

    return NextResponse.json(oportunidade);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const oportId = parseInt(id, 10);
    const body = await request.json();

    const {
      valor_solicitado,
      valor_aprovado,
      comissao_esperada,
      status_repasse,
      checklist_garantias
    } = body;

    const checklistJson = typeof checklist_garantias === 'string' 
      ? checklist_garantias 
      : JSON.stringify(checklist_garantias);

    db.prepare(`
      UPDATE oportunidades 
      SET valor_solicitado = ?, 
          valor_aprovado = ?, 
          comissao_esperada = ?, 
          status_repasse = ?, 
          checklist_garantias = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(valor_solicitado, valor_aprovado, comissao_esperada, status_repasse, checklistJson, oportId);

    return NextResponse.json({ message: "Oportunidade atualizada com sucesso" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const oportId = parseInt(id, 10);

    db.prepare("DELETE FROM oportunidades WHERE id = ?").run(oportId);

    return NextResponse.json({ message: "Oportunidade excluída com sucesso" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
