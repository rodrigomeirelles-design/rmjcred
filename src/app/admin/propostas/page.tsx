import { getPropostas, getPropostasImovel, appendProposta } from "@/lib/sheets";
import { Proposta } from "@/types";
import { PropostaImovel } from "@/types/imovel";
import AdminPropostasClient from "./AdminPropostasClient";
import { requireAuth } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function pfOrphanToSummary(p: PropostaImovel): Proposta {
  return {
    id_proposta: p.id_proposta,
    timestamp_envio: p.timestamp_envio,
    produto: p.produto,
    tipo_pessoa: "PF",
    coluna_kanban: "novo_negocio",
    status_repasse: "pendente",
    emp_razao: p.nome,
    emp_cnpj: p.cpf,
    emp_repr_nome: p.nome,
    emp_repr_cpf: p.cpf,
    emp_email: p.email,
    emp_telefone: p.celular,
    emp_cep: p.cep,
    emp_logradouro: p.logradouro,
    emp_numero: p.numero,
    emp_bairro: p.bairro,
    emp_cidade: p.cidade,
    emp_uf: p.uf,
    emp_imovel: "nao",
    emp_funcionarios: 0,
    banco_nome: p.banco ?? "",
    banco_numero: "",
    banco_agencia: p.agencia ?? "",
    banco_conta: p.conta ?? "",
    banco_digito: "",
    valor_solicitado: p.valorFinanciamento,
    socios: [],
  };
}

export default async function AdminPropostasPage() {
  await requireAuth();
  let propostas: Proposta[] = [];
  try {
    const [shared, imovel] = await Promise.all([getPropostas(), getPropostasImovel()]);
    const sharedIds = new Set(shared.map((p) => p.id_proposta));
    const orphans = imovel.filter((p) => !sharedIds.has(p.id_proposta));
    if (orphans.length > 0) {
      const synthPF = orphans.map(pfOrphanToSummary);
      await Promise.all(synthPF.map((p) => appendProposta(p).catch(() => {})));
      propostas = [...shared, ...synthPF];
    } else {
      propostas = shared;
    }
  } catch (error) {
    console.error("Erro ao carregar propostas:", error);
  }
  return <AdminPropostasClient initialPropostas={propostas} />;
}
