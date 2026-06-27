import { NextRequest, NextResponse } from "next/server";
import { appendProposta, appendPropostaImovel } from "@/lib/sheets";
import { Proposta } from "@/types";
import { PropostaImovel } from "@/types/imovel";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = randomUUID();
    const timestamp = new Date().toISOString();
    const isPF = body.tipo_pessoa === "PF";

    if (isPF) {
      const pf: PropostaImovel = {
        id_proposta: id,
        timestamp_envio: timestamp,
        produto: body.produto || "Financiamento Imobiliário",
        coluna_kanban: "novo_lead",
        nome: body.nome || "",
        cpf: (body.cpf || "").replace(/\D/g, ""),
        celular: body.celular || "",
        email: body.email || "",
        nascimento: "",
        estadoCivil: "",
        nomeMae: "",
        rgCnh: "",
        cep: "",
        logradouro: "",
        numero: "",
        bairro: "",
        cidade: "",
        uf: "",
        fonteRenda: "",
        rendaMensal: 0,
        banco: "",
        tipoImovel: "",
        estadoConservacao: "",
        valorImovel: 0,
        valorFinanciamento: body.valorFinanciamento || 0,
        prazo: "",
        temSegundoProponente: false,
        aceite_lgpd: true,
      };
      await appendPropostaImovel(pf);

      const resumo: Proposta = {
        id_proposta: id,
        timestamp_envio: timestamp,
        produto: pf.produto,
        tipo_pessoa: "PF",
        coluna_kanban: "novo_negocio",
        status_repasse: "pendente",
        emp_razao: body.nome || "",
        emp_cnpj: (body.cpf || "").replace(/\D/g, ""),
        emp_repr_nome: body.nome || "",
        emp_repr_cpf: (body.cpf || "").replace(/\D/g, ""),
        emp_email: body.email || "",
        emp_telefone: body.celular || "",
        emp_cep: "", emp_logradouro: "", emp_numero: "",
        emp_bairro: "", emp_cidade: "", emp_uf: "",
        emp_imovel: "nao", emp_funcionarios: 0,
        banco_nome: "", banco_numero: "", banco_agencia: "",
        banco_conta: "", banco_digito: "",
        valor_solicitado: body.valorFinanciamento || undefined,
        socios: [],
      };
      await appendProposta(resumo);
    } else {
      const pj: Proposta = {
        id_proposta: id,
        timestamp_envio: timestamp,
        produto: "BDMG Capital de Giro",
        tipo_pessoa: "PJ",
        coluna_kanban: "novo_negocio",
        status_repasse: "pendente",
        emp_razao: body.emp_razao || "",
        emp_cnpj: (body.emp_cnpj || "").replace(/\D/g, ""),
        emp_repr_nome: body.emp_repr_nome || "",
        emp_repr_cpf: (body.emp_repr_cpf || "").replace(/\D/g, ""),
        emp_email: body.emp_email || "",
        emp_telefone: body.emp_telefone || "",
        emp_cep: "", emp_logradouro: "", emp_numero: "",
        emp_bairro: "", emp_cidade: "", emp_uf: "",
        emp_imovel: "nao", emp_funcionarios: 0,
        banco_nome: "", banco_numero: "", banco_agencia: "",
        banco_conta: "", banco_digito: "",
        valor_solicitado: body.valor_solicitado || undefined,
        socios: [],
      };
      await appendProposta(pj);
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("POST /api/leads:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
