import { NextRequest, NextResponse } from "next/server";
import { getConfig, setConfig } from "@/lib/sheets";

export async function GET() {
  try {
    const [finImob, homeEquity, bdmg] = await Promise.all([
      getConfig("comissao_fin_imob"),
      getConfig("comissao_home_equity"),
      getConfig("comissao_bdmg"),
    ]);
    return NextResponse.json({
      fin_imob: finImob ? parseFloat(finImob) : 0.01,
      home_equity: homeEquity ? parseFloat(homeEquity) : 0.03,
      bdmg: bdmg ? parseFloat(bdmg) : 0.0135,
    });
  } catch (error) {
    console.error("GET /api/comissoes/config:", error);
    return NextResponse.json({ error: "Erro ao carregar configuração" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updates: Promise<void>[] = [];
    if (body.fin_imob != null) updates.push(setConfig("comissao_fin_imob", String(body.fin_imob)));
    if (body.home_equity != null) updates.push(setConfig("comissao_home_equity", String(body.home_equity)));
    if (body.bdmg != null) updates.push(setConfig("comissao_bdmg", String(body.bdmg)));
    await Promise.all(updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/comissoes/config:", error);
    return NextResponse.json({ error: "Erro ao salvar configuração" }, { status: 500 });
  }
}
