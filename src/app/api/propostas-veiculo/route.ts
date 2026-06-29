import { NextRequest, NextResponse } from "next/server";
import {
  appendPropostaVeiculo,
  getPropostasVeiculo,
  updatePropostaVeiculoField,
  appendProposta,
} from "@/lib/sheets";
import { PropostaVeiculo } from "@/types/veiculo";
import { Proposta } from "@/types";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id        = randomUUID();
    const timestamp = new Date().toISOString();

    const proposta: PropostaVeiculo = {
      ...body,
      id_proposta:   id,
      timestamp_envio: timestamp,
      coluna_kanban: "novo_lead",
    };
    await appendPropostaVeiculo(proposta);

    const resumo: Proposta = {
      id_proposta:   id,
      timestamp_envio: timestamp,
      produto:       body.produto ?? "Financiamento de Veículo",
      tipo_pessoa:   "PF",
      coluna_kanban: "novo_negocio",
      status_repasse: "pendente",
      emp_razao:     body.nome ?? "",
      emp_cnpj:      body.cpf  ?? "",
      emp_repr_nome: body.nome ?? "",
      emp_repr_cpf:  body.cpf  ?? "",
      emp_email:     body.email   ?? "",
      emp_telefone:  body.celular ?? "",
      emp_cep:       body.cep         ?? "",
      emp_logradouro: body.logradouro ?? "",
      emp_numero:    body.numero      ?? "",
      emp_bairro:    body.bairro      ?? "",
      emp_cidade:    body.cidade      ?? "",
      emp_uf:        body.uf          ?? "",
      emp_imovel:    "nao",
      emp_funcionarios: 0,
      banco_nome:    body.banco         ?? "",
      banco_numero:  "",
      banco_agencia: body.banco_agencia ?? "",
      banco_conta:   body.banco_conta   ?? "",
      banco_digito:  "",
      valor_solicitado: body.valor_financiamento,
      socios: [],
    };
    await appendProposta(resumo);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("POST /api/propostas-veiculo:", error);
    return NextResponse.json({ success: false, error: "Erro ao salvar proposta" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const propostas = await getPropostasVeiculo();
    return NextResponse.json(propostas);
  } catch (error) {
    console.error("GET /api/propostas-veiculo:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...fields } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "ID obrigatório" }, { status: 400 });
    await updatePropostaVeiculoField(id, fields);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/propostas-veiculo:", error);
    return NextResponse.json({ success: false, error: "Erro ao atualizar" }, { status: 500 });
  }
}
