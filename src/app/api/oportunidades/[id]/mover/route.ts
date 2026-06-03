import { NextResponse } from "next/server";
import db from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const oportId = parseInt(id, 10);
    const body = await request.json();
    const { coluna_kanban, motivo_perda, data_recusa } = body;

    if (!coluna_kanban) {
      return NextResponse.json({ error: "Coluna de destino é obrigatória" }, { status: 400 });
    }

    // Fetch opportunity to check state
    const oportunidade = db.prepare("SELECT * FROM oportunidades WHERE id = ?").get(oportId) as any;
    if (!oportunidade) {
      return NextResponse.json({ error: "Oportunidade não encontrada" }, { status: 404 });
    }

    // Regra 1: Bloqueio de Aprovada por garantias
    if (coluna_kanban === "aprovada") {
      const checklist = JSON.parse(oportunidade.checklist_garantias || "[]");
      const pendentes = checklist.filter((item: any) => !item.validado).map((item: any) => item.item);
      
      if (pendentes.length > 0) {
        return NextResponse.json({
          error: "Bloqueio de Aprovação",
          message: "Valide o checklist de garantias antes de avançar para a coluna Aprovada.",
          pendentes
        }, { status: 400 });
      }
    }

    // Regra 2: Regra dos 30 dias BDMG
    let finalMotivo = oportunidade.motivo_perda;
    let finalDataRecusa = oportunidade.data_recusa;
    let finalFollowupData = oportunidade.followup_data;

    if (coluna_kanban === "nao_aprovada") {
      if (!motivo_perda || motivo_perda.trim().length < 5) {
        return NextResponse.json({ error: "O motivo da perda deve ter no mínimo 5 caracteres." }, { status: 400 });
      }
      if (!data_recusa) {
        return NextResponse.json({ error: "A data de recusa é obrigatória." }, { status: 400 });
      }

      finalMotivo = motivo_perda;
      finalDataRecusa = data_recusa;

      // Calculate followup_data = data_recusa + 30 days
      const date = new Date(data_recusa);
      date.setDate(date.getDate() + 30);
      finalFollowupData = date.toISOString().split("T")[0];
    }

    db.prepare(`
      UPDATE oportunidades 
      SET coluna_kanban = ?,
          motivo_perda = ?,
          data_recusa = ?,
          followup_data = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(coluna_kanban, finalMotivo, finalDataRecusa, finalFollowupData, oportId);

    return NextResponse.json({
      message: "Oportunidade movida com sucesso",
      followup_data: finalFollowupData
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
