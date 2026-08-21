import { NextRequest, NextResponse } from "next/server";
import { appendProposta, getPropostas } from "@/lib/sheets";
import { sendPropostaNotification } from "@/lib/email";
import { Proposta } from "@/types";

export async function GET() {
  try {
    const propostas = await getPropostas();
    return NextResponse.json({ success: true, data: propostas });
  } catch (error) {
    console.error("GET /api/propostas error:", error);
    return NextResponse.json({ success: false, error: "Erro ao buscar propostas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Proposta;

    const errors: string[] = [];

    if (!body.emp_cnpj || body.emp_cnpj.replace(/\D/g, "").length !== 14) {
      errors.push("CNPJ inválido");
    }

    if (!body.emp_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.emp_email)) {
      errors.push("E-mail da empresa inválido");
    }

    const socios = body.socios || [];
    const cpfs = socios.map((s) => s.cpf.replace(/\D/g, ""));
    const uniqueCpfs = new Set(cpfs);
    if (uniqueCpfs.size !== cpfs.length) {
      errors.push("CPFs duplicados entre sócios");
    }

    for (const socio of socios) {
      if (socio.conjuge && socio.conjuge.cpf) {
        if (socio.conjuge.cpf.replace(/\D/g, "") === socio.cpf.replace(/\D/g, "")) {
          errors.push(`CPF do cônjuge de ${socio.nome} é igual ao do sócio`);
        }
      }
    }

    const totalParticipacao = socios.reduce((sum, s) => sum + (Number(s.participacao) || 0), 0);
    if (totalParticipacao > 100) {
      errors.push(`Soma das participações (${totalParticipacao}%) ultrapassa 100%`);
    }

    if (body.emp_imovel === "sim" && body.emp_imovel_tipo && body.emp_imovel_tipo !== "Não possui") {
      if (!body.emp_imovel_valor || body.emp_imovel_valor <= 0) {
        errors.push("Valor do imóvel da empresa deve ser maior que zero");
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    await appendProposta(body);
    sendPropostaNotification(body).catch((err) => console.error("Email notification failed:", err));
    return NextResponse.json({ success: true, id: body.id_proposta });
  } catch (error) {
    console.error("POST /api/propostas error:", error);
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 });
  }
}
