import { NextRequest, NextResponse } from "next/server";
import { updatePropostaField, deletePropostaRow, deletePropostaImovelRow, getPropostaById } from "@/lib/sheets";
import { createCalendarEvent } from "@/lib/calendar";
import { isValidDate90d30d } from "@/types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Validações de data e valor (Regra 6)
    if (body.data_recusa && !isValidDate90d30d(body.data_recusa)) {
      return NextResponse.json(
        { success: false, error: "Data de recusa inválida. Deve estar entre 90 dias atrás e 30 dias à frente." },
        { status: 400 }
      );
    }

    if (body.data_liberacao && !isValidDate90d30d(body.data_liberacao)) {
      return NextResponse.json(
        { success: false, error: "Data de liberação inválida. Deve estar entre 90 dias atrás e 30 dias à frente." },
        { status: 400 }
      );
    }

    if (body.valor_solicitado !== undefined && body.valor_solicitado !== null) {
      const valNum = Number(body.valor_solicitado);
      if (!isNaN(valNum) && valNum > 0 && valNum < 1000) {
        return NextResponse.json(
          { success: false, error: "Valor solicitado deve ser de no mínimo R$ 1.000,00." },
          { status: 400 }
        );
      }
    }
    
    const propostaAnterior = await getPropostaById(id);
    
    await updatePropostaField(id, body);
    
    // Sync to Calendar if followup or liberacao changed
    if (propostaAnterior) {
      const nomeCliente = propostaAnterior.emp_razao || (propostaAnterior.socios && propostaAnterior.socios[0]?.nome) || "Cliente (Sem Nome)";
      
      if (body.followup_data && body.followup_data !== propostaAnterior.followup_data) {
        await createCalendarEvent({
          title: `Follow-up: ${nomeCliente}`,
          date: body.followup_data,
          category: "followup",
          description: `Acompanhar proposta do cliente ${nomeCliente}. ID: ${id}`,
        }).catch(e => console.error("Error creating followup calendar event", e));
      }

      if (body.data_liberacao && body.data_liberacao !== propostaAnterior.data_liberacao) {
        await createCalendarEvent({
          title: `Crédito Liberado: ${nomeCliente}`,
          date: body.data_liberacao,
          category: "credito_liberado",
          description: `Liberação de crédito para o cliente ${nomeCliente}. Valor Solicitado: R$ ${body.valor_solicitado || propostaAnterior.valor_solicitado || 'Não informado'}`,
        }).catch(e => console.error("Error creating credito liberado calendar event", e));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/propostas/[id] error:", error);
    return NextResponse.json({ success: false, error: "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deletePropostaRow(id);
    await deletePropostaImovelRow(id).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/propostas/[id] error:", error);
    return NextResponse.json({ success: false, error: "Erro ao excluir" }, { status: 500 });
  }
}
