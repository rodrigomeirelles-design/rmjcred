import { NextRequest, NextResponse } from "next/server";
import { getPropostaVeiculoById, updatePropostaVeiculoField, deletePropostaVeiculoRow } from "@/lib/sheets";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const proposta = await getPropostaVeiculoById(id);
    if (!proposta) return NextResponse.json(null, { status: 404 });
    return NextResponse.json(proposta);
  } catch (error) {
    console.error("GET /api/propostas-veiculo/[id]:", error);
    return NextResponse.json(null, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    await updatePropostaVeiculoField(id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/propostas-veiculo/[id]:", error);
    return NextResponse.json({ success: false, error: "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deletePropostaVeiculoRow(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/propostas-veiculo/[id]:", error);
    return NextResponse.json({ success: false, error: "Erro ao excluir" }, { status: 500 });
  }
}
