export type KanbanColumn =
  | "novo"
  | "em_analise"
  | "aguardando_consulta_compartilha_receita"
  | "aguardando_documentacao"
  | "aguardando_declaracao_autorizacao"
  | "aguardando_regularizacao"
  | "aguardando_aprovacao_comite"
  | "aprovada_sob_novas_condicoes"
  | "aprovada"
  | "aguardando_assinatura"
  | "aguardando_liberacao"
  | "nao_aprovada";

export type StatusRepasse = "pendente" | "recebido";

export interface GarantiaItem {
  item: string;
  validado: boolean;
}

export const DEFAULT_GARANTIAS: GarantiaItem[] = [
  { item: "Imóvel", validado: false },
  { item: "Recebíveis", validado: false },
  { item: "Aval dos sócios", validado: false },
  { item: "Veículos", validado: false },
  { item: "Equipamentos", validado: false },
];

export interface ConjugeDados {
  nome: string;
  cpf: string;
  rg: string;
  nascimento: string;
  telefone: string;
  email: string;
  imovel_tipo: string;
  imovel_valor: number | null;
  veiculo_placas: string[];
  renda: number | null;
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
  imovel_tipo: string;
  imovel_valor: number | null;
  veiculo_placas: string[];
  conjuge?: ConjugeDados;
}

export interface PropostaFormData {
  emp_razao: string;
  emp_fantasia?: string;
  emp_cnpj: string;
  emp_funcionarios: number;
  emp_faturamento: number;
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
  coluna_kanban: KanbanColumn;
  status_repasse: StatusRepasse;
  motivo_perda?: string;
  data_recusa?: string;
  followup_data?: string;
  checklist_garantias: GarantiaItem[];
  valor_solicitado?: number;
  valor_aprovado?: number;
  comissao_esperada?: number;
  emp_razao: string;
  emp_fantasia?: string;
  emp_cnpj: string;
  emp_funcionarios: number;
  emp_faturamento: number;
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
  banco_nome: string;
  banco_numero: string;
  banco_agencia: string;
  banco_conta: string;
  banco_digito: string;
  obs_finais?: string;
  socios: SocioDados[];
}

export const KANBAN_COLUMNS: { id: KanbanColumn; label: string; fase: number }[] = [
  { id: "novo", label: "Novo", fase: 0 },
  { id: "em_analise", label: "Em análise", fase: 1 },
  { id: "aguardando_consulta_compartilha_receita", label: "Ag. Consulta Receita", fase: 1 },
  { id: "aguardando_documentacao", label: "Ag. Documentação", fase: 2 },
  { id: "aguardando_declaracao_autorizacao", label: "Ag. Declaração", fase: 2 },
  { id: "aguardando_regularizacao", label: "Ag. Regularização", fase: 2 },
  { id: "aguardando_aprovacao_comite", label: "Ag. Comitê", fase: 3 },
  { id: "aprovada_sob_novas_condicoes", label: "Aprovada c/ Condições", fase: 3 },
  { id: "aprovada", label: "Aprovada", fase: 4 },
  { id: "aguardando_assinatura", label: "Ag. Assinatura", fase: 4 },
  { id: "aguardando_liberacao", label: "Ag. Liberação", fase: 4 },
  { id: "nao_aprovada", label: "Não Aprovada", fase: 5 },
];

export const UF_LIST = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];
