import { KanbanColumnImovel } from "./imovel";
import { ESTADO_CIVIL_OPTIONS } from "./imovel";

export type KanbanColumnVeiculo = KanbanColumnImovel;
export { ESTADO_CIVIL_OPTIONS };

export const KANBAN_COLUMNS_VEICULO = [
  { id: "novo_lead" as const,             label: "Novo Lead",           fase: 0 },
  { id: "em_analise" as const,            label: "Em Análise",          fase: 1 },
  { id: "aguardando_documentos" as const, label: "Aguard. Documentos",  fase: 2 },
  { id: "em_aprovacao" as const,          label: "Em Aprovação",        fase: 3 },
  { id: "aprovado" as const,              label: "Aprovado",            fase: 4 },
  { id: "formalizacao" as const,          label: "Formalização",        fase: 5 },
  { id: "credito_liberado" as const,      label: "Crédito Liberado",    fase: 6 },
  { id: "nao_aprovado" as const,          label: "Não Aprovado",        fase: 7 },
];

export type ProdutoVeiculo = "Financiamento de Veículo" | "Crédito com Garantia de Veículo";
export type SituacaoProfissionalVeiculo = "assalariado" | "autonomo" | "aposentado";
export type CategoriaVeiculo = "carros" | "motos" | "caminhoes";

export interface PropostaVeiculoFormData {
  nome: string;
  cpf: string;
  rg: string;
  rg_orgao_emissor?: string;
  rg_data_emissao?: string;
  nascimento: string;
  estado_civil: string;
  nacionalidade?: string;
  nome_mae: string;

  celular: string;
  telefone?: string;
  email: string;

  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  tempo_residencia?: string;

  situacao_profissional: SituacaoProfissionalVeiculo;
  empresa?: string;
  empresa_cnpj?: string;
  cargo?: string;
  data_admissao?: string;
  autonomo_empresa?: string;
  autonomo_cnpj?: string;
  autonomo_atividade?: string;
  autonomo_tempo?: string;
  renda_mensal: number;
  outras_rendas?: string;
  outras_rendas_valor?: number;

  banco: string;
  banco_agencia?: string;
  banco_conta?: string;
  banco_tipo_conta?: "Corrente" | "Poupança";

  veiculo_tipo: "novo" | "usado";
  veiculo_categoria: CategoriaVeiculo;
  veiculo_marca_id?: string;
  veiculo_marca: string;
  veiculo_modelo_id?: string;
  veiculo_modelo: string;
  veiculo_ano_id?: string;
  veiculo_ano_fabricacao: string;
  veiculo_placa?: string;
  veiculo_valor_fipe?: number;

  valor_veiculo: number;
  valor_entrada?: number;
  valor_financiamento: number;
  parcelas: string;

  veiculo_tem_divida?: "sim" | "nao";
  veiculo_saldo_devedor?: number;

  conjugeNome?: string;
  conjugeCpf?: string;
  conjugeNascimento?: string;
  conjugeCelular?: string;
  conjugeEmail?: string;
  conjugeRenda?: number;
  observacoes?: string;
  aceite_lgpd: boolean;
}

export interface PropostaVeiculo extends PropostaVeiculoFormData {
  id_proposta: string;
  timestamp_envio: string;
  produto: ProdutoVeiculo;
  coluna_kanban: KanbanColumnVeiculo;
}

export const CATEGORIA_VEICULO_OPTIONS = [
  { value: "carros",    label: "Carro / Utilitário" },
  { value: "motos",     label: "Moto" },
  { value: "caminhoes", label: "Caminhão / Ônibus" },
];

export const PARCELAS_VEICULO_OPTIONS = [
  { value: "12", label: "12 meses (1 ano)" },
  { value: "24", label: "24 meses (2 anos)" },
  { value: "36", label: "36 meses (3 anos)" },
  { value: "48", label: "48 meses (4 anos)" },
  { value: "60", label: "60 meses (5 anos)" },
];

export const BANCO_VEICULO_OPTIONS = [
  { value: "BV Financeira",         label: "BV Financeira" },
  { value: "Santander",             label: "Santander" },
  { value: "Itaú",                  label: "Itaú" },
  { value: "Bradesco",              label: "Bradesco" },
  { value: "Banco do Brasil",       label: "Banco do Brasil" },
  { value: "Caixa Econômica Federal", label: "Caixa Econômica Federal" },
  { value: "Pan",                   label: "Pan" },
  { value: "Sicredi",               label: "Sicredi" },
  { value: "Sem preferência",       label: "Sem preferência" },
  { value: "Outro",                 label: "Outro" },
];

export const TIPO_CONTA_OPTIONS = [
  { value: "Corrente", label: "Conta Corrente" },
  { value: "Poupança", label: "Conta Poupança" },
];

export const TEMPO_RESIDENCIA_OPTIONS = [
  { value: "Menos de 1 ano", label: "Menos de 1 ano" },
  { value: "1 a 2 anos",     label: "1 a 2 anos" },
  { value: "2 a 5 anos",     label: "2 a 5 anos" },
  { value: "5 a 10 anos",    label: "5 a 10 anos" },
  { value: "Mais de 10 anos", label: "Mais de 10 anos" },
];

export const AUTONOMO_TEMPO_OPTIONS = [
  { value: "Menos de 1 ano", label: "Menos de 1 ano" },
  { value: "1 a 2 anos",     label: "1 a 2 anos" },
  { value: "2 a 5 anos",     label: "2 a 5 anos" },
  { value: "5 a 10 anos",    label: "5 a 10 anos" },
  { value: "Mais de 10 anos", label: "Mais de 10 anos" },
];
