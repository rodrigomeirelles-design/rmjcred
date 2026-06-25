import { NextRequest, NextResponse } from "next/server";
import { updatePropostaField, deletePropostaRow } from "@/lib/sheets";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    await updatePropostaField(id, body);
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
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/propostas/[id] error:", error);
    return NextResponse.json({ success: false, error: "Erro ao excluir" }, { status: 500 });
  }
}