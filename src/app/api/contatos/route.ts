import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { empresa_id, nome, whatsapp, cargo } = await request.json();

    if (!empresa_id || !nome || !whatsapp || !cargo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO contatos (empresa_id, nome, whatsapp, cargo)
      VALUES (?, ?, ?, ?)
    `).run(empresa_id, nome, whatsapp, cargo);

    return NextResponse.json({ id: result.lastInsertRowid, message: "Contato criado com sucesso" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
