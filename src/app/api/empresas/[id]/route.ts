import { NextResponse } from "next/server";
import db from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const empresaId = parseInt(id, 10);

    const empresa = db.prepare("SELECT * FROM empresas WHERE id = ?").get(empresaId);
    if (!empresa) {
      return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
    }

    const contatos = db.prepare("SELECT * FROM contatos WHERE empresa_id = ?").all(empresaId);
    const oportunidades = db.prepare("SELECT * FROM oportunidades WHERE empresa_id = ?").all(empresaId);

    return NextResponse.json({
      ...empresa,
      contatos,
      oportunidades
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
