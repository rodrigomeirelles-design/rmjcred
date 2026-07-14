export type KanbanColumnImovel =
  | "novo_lead"
  | "em_analise"
  | "aguardando_documentos"
  | "em_aprovacao"
  | "aprovado"
  | "formalizacao"
  | "credito_liberado"
  | "nao_aprovado";

export type ProdutoImovel = "Financiamento Imobiliário" | "Crédito com Garantia de Imóvel";

export const KANBAN_COLUMNS_IMOVEL: { id: KanbanColumnImovel; label: string; fase: number }[] = [
  { id: "novo_lead",             label: "Novo Lead",           fase: 0 },
  { id: "em_analise",            label: "Em Análise",          fase: 1 },
  { id: "aguardando_documentos", label: "Aguard. Documentos",  fase: 2 },
  { id: "em_aprovacao",          label: "Em Aprovação",        fase: 3 },
  { id: "aprovado",              label: "Aprovado",            fase: 4 },
  { id: "formalizacao",          label: "Formalização",        fase: 5 },
  { id: "credito_liberado",      label: "Crédito Liberado",    fase: 6 },
  { id: "nao_aprovado",          label: "Não Aprovado",        fase: 7 },
];

export interface PropostaImovelFormData {
  nome: string;
  cpf: string;
  celular: string;
  email: string;
  nascimento: string;
  sexo?: string;
  nomeMae: string;
  nomePai?: string;
  rgCnh: string;
  orgaoEmissor?: string;
  estadoCivil: string;
  naturalidade?: string;
  nacionalidade?: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  fonteRenda: string;
  rendaMensal: number;
  profissao?: string;
  empresa_cnpj?: string;
  empresa_endereco?: string;
  empresa_ramo?: string;
  banco: string;
  agencia?: string;
  conta?: string;
  temSegundoProponente: boolean;
  sp_nome?: string;
  sp_cpf?: string;
  sp_celular?: string;
  sp_email?: string;
  sp_nascimento?: string;
  sp_sexo?: string;
  sp_nomeMae?: string;
  sp_nomePai?: string;
  sp_rgCnh?: string;
  sp_orgaoEmissor?: string;
  sp_fonteRenda?: string;
  sp_rendaMensal?: number;
  sp_profissao?: string;
  tipoImovel: string;
  estadoConservacao: string;
  valorImovel: number;
  valorFinanciamento: number;
  prazo: string;
  ufImovel?: string;
  usarFgts?: "sim" | "nao";
  valorFgts?: number;
  imovel_cep?: string;
  imovel_logradouro?: string;
  imovel_numero?: string;
  imovel_complemento?: string;
  imovel_bairro?: string;
  imovel_cidade?: string;
  imovel_uf?: string;
  matriculaIptu?: string;
  situacaoImovel?: string;
  regimeUniao?: string;
  regimeCasamento?: string;
  conjuge_nome?: string;
  conjuge_cpf?: string;
  conjuge_celular?: string;
  conjuge_email?: string;
  conjuge_nascimento?: string;
  conjuge_sexo?: string;
  conjuge_profissao?: string;
  conjuge_fonteRenda?: string;
  conjuge_rendaMensal?: number;
  conjugeFiliacao?: string;
  conjugeRg?: string;
  observacoes?: string;
  aceite_lgpd: boolean;
}

export interface PropostaImovel extends PropostaImovelFormData {
  id_proposta: string;
  timestamp_envio: string;
  produto: ProdutoImovel;
  coluna_kanban: KanbanColumnImovel;
}

export const FONTE_RENDA_OPTIONS = [
  { value: "CLT / Empregado", label: "CLT / Empregado" },
  { value: "MEI / Microempreendedor", label: "MEI / Microempreendedor" },
  { value: "Autônomo", label: "Autônomo" },
  { value: "Profissional Liberal", label: "Profissional Liberal" },
  { value: "Aposentado / Pensionista", label: "Aposentado / Pensionista" },
  { value: "Empresário / Sócio", label: "Empresário / Sócio" },
];

export const TIPO_IMOVEL_OPTIONS = [
  { value: "Apartamento", label: "Apartamento" },
  { value: "Casa", label: "Casa" },
  { value: "Sobrado", label: "Sobrado" },
  { value: "Terreno", label: "Terreno" },
  { value: "Imóvel Comercial", label: "Imóvel Comercial" },
  { value: "Galpão", label: "Galpão" },
];

export const ESTADO_CONSERVACAO_OPTIONS = [
  { value: "Na Planta / Em Construção", label: "Na Planta / Em Construção" },
  { value: "Novo (até 5 anos)", label: "Novo (até 5 anos)" },
  { value: "Usado – Bom Estado", label: "Usado – Bom Estado" },
  { value: "Usado – Necessita Reforma", label: "Usado – Necessita Reforma" },
];

export const PRAZO_IMOVEL_OPTIONS = [
  { value: "60",  label: "60 meses (5 anos)" },
  { value: "120", label: "120 meses (10 anos)" },
  { value: "180", label: "180 meses (15 anos)" },
  { value: "240", label: "240 meses (20 anos)" },
  { value: "300", label: "300 meses (25 anos)" },
  { value: "360", label: "360 meses (30 anos)" },
  { value: "420", label: "420 meses (35 anos) — sujeito a análise" },
];

export const REGIME_UNIAO_OPTIONS = [
  { value: "Comunhão Parcial de Bens",             label: "Comunhão Parcial de Bens" },
  { value: "Comunhão Universal de Bens",            label: "Comunhão Universal de Bens" },
  { value: "Separação Total de Bens",               label: "Separação Total de Bens" },
  { value: "Participação Final nos Aquestos",        label: "Participação Final nos Aquestos" },
];

export const BANCO_IMOVEL_OPTIONS = [
  { value: "Caixa Econômica Federal", label: "Caixa Econômica Federal" },
  { value: "Bradesco", label: "Bradesco" },
  { value: "Itaú", label: "Itaú" },
  { value: "Santander", label: "Santander" },
  { value: "Banco do Brasil", label: "Banco do Brasil" },
  { value: "Inter", label: "Inter" },
  { value: "Sem preferência", label: "Sem preferência" },
  { value: "Outro", label: "Outro" },
];

export const ESTADO_CIVIL_OPTIONS = [
  { value: "Solteiro(a)", label: "Solteiro(a)" },
  { value: "Casado(a)", label: "Casado(a)" },
  { value: "Divorciado(a)", label: "Divorciado(a)" },
  { value: "Viúvo(a)", label: "Viúvo(a)" },
  { value: "União Estável", label: "União Estável" },
];

export const SEXO_OPTIONS = [
  { value: "Masculino", label: "Masculino" },
  { value: "Feminino", label: "Feminino" },
  { value: "Outro", label: "Outro" },
  { value: "Prefiro não informar", label: "Prefiro não informar" },
];

export const SITUACAO_IMOVEL_OPTIONS = [
  { value: "Quitado", label: "Quitado" },
  { value: "Com financiamento em andamento", label: "Com financiamento em andamento" },
  { value: "Em inventário / processo judicial", label: "Em inventário / processo judicial" },
];
