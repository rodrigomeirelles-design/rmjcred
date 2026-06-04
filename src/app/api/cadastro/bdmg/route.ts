import { NextResponse } from "next/server";
import { saveCadastro } from "@/lib/dataStore";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("Nova Ficha PJ BDMG recebida na API:", payload);

    const { empresa, socios, bancario } = payload;

    if (!empresa || !empresa.emp_cnpj || !empresa.emp_razao) {
      return NextResponse.json({ success: false, error: "Dados da empresa incompletos." }, { status: 400 });
    }

    const result = await saveCadastro("bdmg", payload);

    if (!result.ok) {
      console.error("[api/cadastro/bdmg] Falha ao salvar:", result.error);
      return NextResponse.json({
        success: false,
        error: "Erro interno ao salvar os dados. Tente novamente."
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, destination: result.destination });
  } catch (error: any) {
    console.error("Erro na API de cadastro BDMG:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
