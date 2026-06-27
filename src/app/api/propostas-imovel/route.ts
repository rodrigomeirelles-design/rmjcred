import { NextRequest, NextResponse } from "next/server";
import { appendPropostaImovel, getPropostasImovel, updatePropostaImovelField, appendProposta } from "@/lib/sheets";
import { PropostaImovel } from "@/types/imovel";
import { Proposta } from "@/types";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = randomUUID();
    const timestamp = new Date().toISOString();

    const proposta: PropostaImovel = {
      ...body,
      id_proposta: id,
      timestamp_envio: timestamp,
      coluna_kanban: "novo_lead",
    };
    await appendPropostaImovel(proposta);

    // Salva resumo na aba Propostas para aparecer no kanban principal
    const resumo: Proposta = {
      id_proposta: id,
      timestamp_envio: timestamp,
      produto: body.produto ?? "Financiamento Imobiliário",
      tipo_pessoa: "PF",
      coluna_kanban: "novo_negocio",
      status_repasse: "pendente",
      emp_razao: body.nome ?? "",
      emp_cnpj: body.cpf ?? "",
      emp_repr_nome: body.nome ?? "",
      emp_repr_cpf: body.cpf ?? "",
      emp_email: body.email ?? "",
      emp_telefone: body.celular ?? "",
      emp_cep: body.cep ?? "",
      emp_logradouro: body.logradouro ?? "",
      emp_numero: body.numero ?? "",
      emp_bairro: body.bairro ?? "",
      emp_cidade: body.cidade ?? "",
      emp_uf: body.uf ?? "",
      emp_imovel: "nao",
      emp_funcionarios: 0,
      banco_nome: body.banco ?? "",
      banco_numero: "",
      banco_agencia: body.agencia ?? "",
      banco_conta: body.conta ?? "",
      banco_digito: "",
      valor_solicitado: body.valorFinanciamento,
      socios: [],
    };
    await appendProposta(resumo);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("POST /api/propostas-imovel:", error);
    return NextResponse.json({ success: false, error: "Erro ao salvar proposta" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const propostas = await getPropostasImovel();
    return NextResponse.json(propostas);
  } catch (error) {
    console.error("GET /api/propostas-imovel:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...fields } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "ID obrigatório" }, { status: 400 });
    await updatePropostaImovelField(id, fields);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/propostas-imovel:", error);
    return NextResponse.json({ success: false, error: "Erro ao atualizar" }, { status: 500 });
  }
}
