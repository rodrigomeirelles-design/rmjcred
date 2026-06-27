import { NextRequest, NextResponse } from "next/server";
import { getPropostasImovel } from "@/lib/sheets";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const all = await getPropostasImovel();
    const found = all.find((p) => p.id_proposta === id);
    if (!found) return NextResponse.json(null, { status: 404 });
    return NextResponse.json(found);
  } catch (error) {
    console.error("GET /api/propostas-imovel/[id]:", error);
    return NextResponse.json(null, { status: 500 });
  }
}
