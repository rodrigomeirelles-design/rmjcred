import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("Nova Ficha PJ BDMG recebida na API:", payload);

    const gasUrl = process.env.GAS_WEB_APP_URL;

    if (gasUrl) {
      // Repassa a proposta formatada para a planilha via Google Apps Script
      const gasResponse = await fetch(gasUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "cadastro_pj",
          dados: payload,
        }),
      });

      if (!gasResponse.ok) {
        throw new Error("Erro de comunicação com o servidor do Google Sheets (GAS).");
      }

      const gasResult = await gasResponse.json();
      if (!gasResult.ok) {
        throw new Error(gasResult.error || "Erro retornado pelo Apps Script.");
      }
    } else {
      console.warn("GAS_WEB_APP_URL não configurada no servidor. Salvando apenas localmente.");
    }

    return NextResponse.json({ success: true, message: "Cadastro enviado com sucesso!" });
  } catch (error: any) {
    console.error("Erro na API de cadastro BDMG:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
