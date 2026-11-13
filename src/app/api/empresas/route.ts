import { NextRequest, NextResponse } from "next/server";
import { getPropostas } from "@/lib/sheets";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cnpj = searchParams.get("cnpj");
    const cpf = searchParams.get("cpf");

    const propostas = await getPropostas();

    if (cnpj) {
      const clean = cnpj.replace(/\D/g, "");
      const matches = propostas.filter(
        (p) => p.emp_cnpj && p.emp_cnpj.replace(/\D/g, "") === clean
      );
      if (matches.length === 0) {
        return NextResponse.json({ success: true, data: null });
      }
      matches.sort(
        (a, b) =>
          new Date(b.timestamp_envio || 0).getTime() -
          new Date(a.timestamp_envio || 0).getTime()
      );
      const p = matches[0];
      return NextResponse.json({
        success: true,
        data: {
          id: p.id_proposta,
          razaoSocial: p.emp_razao,
          cnpj: p.emp_cnpj,
          representante: p.emp_repr_nome,
          cpfRepresentante: p.emp_repr_cpf,
          telefone: p.emp_telefone,
          email: p.emp_email,
          etapaAtual: p.coluna_kanban,
          propostas: matches,
        },
      });
    }

    if (cpf) {
      const clean = cpf.replace(/\D/g, "");
      const matches = propostas.filter(
        (p) =>
          (p.emp_repr_cpf && p.emp_repr_cpf.replace(/\D/g, "") === clean) ||
          (p.emp_cnpj && p.emp_cnpj.replace(/\D/g, "") === clean)
      );
      if (matches.length === 0) {
        return NextResponse.json({ success: true, data: null });
      }
      matches.sort(
        (a, b) =>
          new Date(b.timestamp_envio || 0).getTime() -
          new Date(a.timestamp_envio || 0).getTime()
      );
      const p = matches[0];
      return NextResponse.json({
        success: true,
        data: {
          id: p.id_proposta,
          nome: p.emp_repr_nome || p.emp_razao,
          cpf: p.emp_repr_cpf || p.emp_cnpj,
          telefone: p.emp_telefone,
          celular: p.emp_telefone,
          email: p.emp_email,
          etapaAtual: p.coluna_kanban,
          propostas: matches,
        },
      });
    }

    return NextResponse.json({ success: true, data: propostas });
  } catch (error) {
    console.error("GET /api/empresas error:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar empresas" },
      { status: 500 }
    );
  }
}
