import { NextRequest, NextResponse } from "next/server";
import { appendProposta, appendPropostaImovel, getPropostas } from "@/lib/sheets";
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
      const isVeiculo = body.produto?.includes("Veículo");
      
      const p_nome = body.nome || body.emp_repr_nome || body.emp_razao || "";
      const p_cpf = (body.cpf || body.emp_cnpj || body.emp_repr_cpf || "").replace(/\D/g, "");
      const p_celular = body.celular || body.emp_telefone || "";
      const p_email = body.email || body.emp_email || "";
      const p_valor = body.valorFinanciamento || body.valor_solicitado || 0;

      if (isVeiculo) {
        const { appendPropostaVeiculo } = await import("@/lib/sheets");
        await appendPropostaVeiculo({
          id_proposta: id,
          timestamp_envio: timestamp,
          produto: body.produto || "Financiamento de Veículos",
          coluna_kanban: "novo_lead",
          nome: p_nome,
          cpf: p_cpf,
          celular: p_celular,
          email: p_email,
          nascimento: "", estado_civil: "", nacionalidade: "", nome_mae: "", rg: "", rg_orgao_emissor: "", rg_data_emissao: "",
          cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "", tempo_residencia: "",
          situacao_profissional: "assalariado", empresa: "", empresa_cnpj: "", cargo: "", data_admissao: "",
          autonomo_empresa: "", autonomo_cnpj: "", autonomo_atividade: "", autonomo_tempo: "",
          renda_mensal: 0, outras_rendas: "", outras_rendas_valor: 0,
          banco: "", banco_agencia: "", banco_conta: "", banco_tipo_conta: undefined,
          veiculo_tipo: "novo", veiculo_categoria: "carros", veiculo_marca_id: "", veiculo_marca: "", veiculo_modelo_id: "", veiculo_modelo: "",
          veiculo_ano_id: "", veiculo_ano_fabricacao: "", veiculo_placa: "", veiculo_valor_fipe: 0,
          valor_veiculo: p_valor, valor_entrada: 0, valor_financiamento: p_valor, parcelas: "",
          veiculo_tem_divida: "nao", veiculo_saldo_devedor: 0,
          conjugeNome: "", conjugeCpf: "", conjugeNascimento: "", conjugeCelular: "", conjugeEmail: "", conjugeRenda: 0,
          observacoes: "", aceite_lgpd: true,
        });
      } else {
        const pf: PropostaImovel = {
          id_proposta: id,
          timestamp_envio: timestamp,
          produto: body.produto || "Financiamento Imobiliário",
          coluna_kanban: "novo_lead",
          nome: p_nome,
          cpf: p_cpf,
          celular: p_celular,
          email: p_email,
          nascimento: "", estadoCivil: "", nomeMae: "", rgCnh: "",
          cep: "", logradouro: "", numero: "", bairro: "", cidade: "", uf: "",
          fonteRenda: "", rendaMensal: 0, banco: "", tipoImovel: "", estadoConservacao: "",
          valorImovel: 0, valorFinanciamento: p_valor, prazo: "", temSegundoProponente: false, aceite_lgpd: true,
        };
        await appendPropostaImovel(pf);
      }

      const resumo: Proposta = {
        id_proposta: id,
        timestamp_envio: timestamp,
        produto: body.produto || "Financiamento",
        tipo_pessoa: "PF",
        coluna_kanban: "novo_negocio",
        status_repasse: "pendente",
        emp_razao: p_nome,
        emp_cnpj: p_cpf,
        emp_repr_nome: p_nome,
        emp_repr_cpf: p_cpf,
        emp_email: p_email,
        emp_telefone: p_celular,
        emp_cep: "", emp_logradouro: "", emp_numero: "",
        emp_bairro: "", emp_cidade: "", emp_uf: "",
        emp_imovel: "nao", emp_funcionarios: 0,
        banco_nome: "", banco_numero: "", banco_agencia: "",
        banco_conta: "", banco_digito: "",
        valor_solicitado: p_valor || undefined,
        socios: [],
        obs_finais: body.obs_finais,
      };
      await appendProposta(resumo);
    } else {
      const cnpjDigits = (body.emp_cnpj || "").replace(/\D/g, "");

      // If linked or existing company, borrow existing address & bank info if available
      let existing: Proposta | undefined;
      if (body.vinculada || body.empresaIdVinculada || cnpjDigits) {
        try {
          const propostas = await getPropostas();
          existing = propostas.find(
            (p) => p.emp_cnpj && p.emp_cnpj.replace(/\D/g, "") === cnpjDigits
          );
        } catch {
          // ignore lookup error and proceed
        }
      }

      const pj: Proposta = {
        id_proposta: id,
        timestamp_envio: timestamp,
        produto: body.produto || "BDMG Capital de Giro",
        tipo_pessoa: "PJ",
        coluna_kanban: "novo_negocio",
        status_repasse: "pendente",
        emp_razao: body.emp_razao || existing?.emp_razao || "",
        emp_cnpj: cnpjDigits,
        emp_fantasia: body.emp_fantasia || existing?.emp_fantasia || "",
        emp_repr_nome: body.emp_repr_nome || existing?.emp_repr_nome || "",
        emp_repr_cpf: (body.emp_repr_cpf || existing?.emp_repr_cpf || "").replace(/\D/g, ""),
        emp_email: body.emp_email || existing?.emp_email || "",
        emp_telefone: body.emp_telefone || existing?.emp_telefone || "",
        emp_cep: body.emp_cep || existing?.emp_cep || "",
        emp_logradouro: body.emp_logradouro || existing?.emp_logradouro || "",
        emp_numero: body.emp_numero || existing?.emp_numero || "",
        emp_complemento: body.emp_complemento || existing?.emp_complemento || "",
        emp_bairro: body.emp_bairro || existing?.emp_bairro || "",
        emp_cidade: body.emp_cidade || existing?.emp_cidade || "",
        emp_uf: body.emp_uf || existing?.emp_uf || "",
        emp_imovel: body.emp_imovel || existing?.emp_imovel || "nao",
        emp_imovel_tipo: body.emp_imovel_tipo || existing?.emp_imovel_tipo,
        emp_imovel_valor: body.emp_imovel_valor || existing?.emp_imovel_valor,
        emp_funcionarios: body.emp_funcionarios || existing?.emp_funcionarios || 0,
        banco_nome: body.banco_nome || existing?.banco_nome || "",
        banco_numero: body.banco_numero || existing?.banco_numero || "",
        banco_agencia: body.banco_agencia || existing?.banco_agencia || "",
        banco_conta: body.banco_conta || existing?.banco_conta || "",
        banco_digito: body.banco_digito || existing?.banco_digito || "",
        valor_solicitado: body.valor_solicitado || undefined,
        socios: body.socios && body.socios.length > 0 ? body.socios : (existing?.socios || []),
        obs_finais: body.obs_finais,
      };
      await appendProposta(pj);
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("POST /api/leads:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
