import { NextResponse } from "next/server";
import { saveCadastro } from "@/lib/dataStore";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("Nova Ficha Financiamento Imobiliário recebida:", payload);

    const { proponente } = payload;

    if (!proponente || !proponente.nome || !proponente.cpf || !proponente.email) {
      return NextResponse.json(
        { success: false, error: "Dados do proponente incompletos." },
        { status: 400 }
      );
    }

    const result = await saveCadastro("financiamento-imobiliario", payload);

    if (!result.ok) {
      console.error("[api/cadastro/financiamento-imobiliario] Falha ao salvar:", result.error);
      return NextResponse.json({
        success: false,
        error: "Erro interno ao salvar os dados. Tente novamente."
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, destination: result.destination });
  } catch (error: any) {
    console.error("Erro na API de financiamento imobiliário:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
