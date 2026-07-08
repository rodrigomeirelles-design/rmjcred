export type KanbanColumn =
  | "novo_negocio"
  | "em_analise"
  | "em_aprovacao"
  | "formalizacao"
  | "credito_liberado"
  | "nao_aprovado"
  | "leads_perdidos"
  | "finalizados";

export type StatusRepasse = "pendente" | "recebido";
export type TipoPessoa = "PJ" | "PF";

export interface ConjugeDados {
  nome: string;
  cpf: string;
  rg: string;
  nascimento: string;
  telefone: string;
  email: string;
  imovel_tipo?: string;
  imovel_valor?: number | null;
  possui_imovel: "sim" | "nao";
  possui_veiculo: "sim" | "nao";
  veiculo_placas: string[];
  renda?: number | null;
  incluir_renda: "sim" | "nao";
}

export interface SocioDados {
  nome: string;
  cpf: string;
  rg: string;
  participacao: number;
  nascimento: string;
  estado_civil: string;
  regime?: string;
  profissao: string;
  nacionalidade: string;
  email: string;
  telefone: string;
  renda: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  possui_imovel: "sim" | "nao";
  imovel_tipo?: string;
  imovel_valor?: number | null;
  imovel_residencial?: "sim" | "nao";
  imovel_residencial_valor?: number | null;
  reside_imovel_proprio?: "sim" | "nao";
  possui_veiculo: "sim" | "nao";
  veiculo_placas: string[];
  conjuge?: ConjugeDados;
}

export interface PropostaFormData {
  emp_razao: string;
  emp_fantasia?: string;
  emp_cnpj: string;
  emp_funcionarios: number;
  emp_repr_nome: string;
  emp_repr_cpf: string;
  emp_email: string;
  emp_telefone: string;
  emp_cep: string;
  emp_logradouro: string;
  emp_numero: string;
  emp_complemento?: string;
  emp_bairro: string;
  emp_cidade: string;
  emp_uf: string;
  emp_imovel: "sim" | "nao";
  emp_imovel_tipo?: string;
  emp_imovel_valor?: number;
  emp_regime_tributario?: string;
  socios: SocioDados[];
  banco_nome: string;
  banco_numero: string;
  banco_agencia: string;
  banco_conta: string;
  banco_digito: string;
  obs_finais?: string;
  aceite_lgpd: boolean;
}

export interface Proposta {
  id_proposta: string;
  timestamp_envio: string;
  produto: string;
  tipo_pessoa?: TipoPessoa;
  coluna_kanban: KanbanColumn;
  status_repasse: StatusRepasse;
  motivo_perda?: string;
  data_recusa?: string;
  followup_data?: string;
  data_liberacao?: string;
  data_finalizado?: string;
  valor_solicitado?: number;
  comissao_percentual?: number;
  emp_razao: string;
  emp_fantasia?: string;
  emp_cnpj: string;
  emp_funcionarios: number;
  emp_repr_nome: string;
  emp_repr_cpf: string;
  emp_email: string;
  emp_telefone: string;
  emp_cep: string;
  emp_logradouro: string;
  emp_numero: string;
  emp_complemento?: string;
  emp_bairro: string;
  emp_cidade: string;
  emp_uf: string;
  emp_imovel: string;
  emp_imovel_tipo?: string;
  emp_imovel_valor?: number;
  emp_regime_tributario?: string;
  banco_nome: string;
  banco_numero: string;
  banco_agencia: string;
  banco_conta: string;
  banco_digito: string;
  obs_finais?: string;
  socios: SocioDados[];
}

export const COMISSAO_PERCENTUAL = 0.0135;
export const COMISSAO_FIN_IMOB = 0.01;
export const COMISSAO_HOME_EQUITY = 0.03;

/** Returns the effective commission rate for a proposal */
export function getComissaoRate(p: Proposta): number {
  if (p.comissao_percentual != null && p.comissao_percentual > 0) return p.comissao_percentual;
  if (p.produto?.includes("Veículo") || p.produto?.includes("Veículos")) return 0;
  if (p.produto === "Crédito com Garantia de Imóvel" || p.produto?.includes("Home Equity")) return COMISSAO_HOME_EQUITY;
  if (p.produto === "Financiamento Imobiliário" || p.produto?.includes("Imóvel")) return COMISSAO_FIN_IMOB;
  return COMISSAO_PERCENTUAL;
}

export const KANBAN_COLUMNS: { id: KanbanColumn; label: string; fase: number }[] = [
  { id: "novo_negocio",     label: "Novo Negócio",     fase: 0 },
  { id: "em_analise",       label: "Em Análise",       fase: 1 },
  { id: "em_aprovacao",     label: "Em Aprovação",     fase: 2 },
  { id: "formalizacao",     label: "Formalização",     fase: 3 },
  { id: "credito_liberado", label: "Crédito Liberado", fase: 4 },
  { id: "finalizados",      label: "Finalizados",      fase: 5 },
  { id: "nao_aprovado",     label: "Não Aprovado",     fase: 6 },
  { id: "leads_perdidos",   label: "Leads Perdidos",   fase: 7 },
];

export const UF_LIST = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];
