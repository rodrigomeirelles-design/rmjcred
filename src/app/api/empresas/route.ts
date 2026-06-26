import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readClientesFromSheets } from "@/lib/googleSheetsReader";

export async function GET() {
  const cookieStore = await cookies();
  if (!cookieStore.get("rmj_admin_session")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const clientes = await readClientesFromSheets();
    console.log(`[API /empresas] Retornando ${clientes.length} cliente(s) da planilha.`);
    return NextResponse.json(clientes);
  } catch (error: any) {
    console.error("[API /empresas] Erro ao ler Google Sheets:", error?.message ?? error);
    return NextResponse.json(
      { error: `Falha ao ler planilha: ${error?.message ?? "erro desconhecido"}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!cookieStore.get("rmj_admin_session")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Cadastro manual via CRM não disponível. Use o formulário do site." },
    { status: 405 }
  );
}
