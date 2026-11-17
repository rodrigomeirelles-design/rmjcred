export const KANBAN_STAGES = {
  NOVO_NEGOCIO: "novo_negocio",
  EM_ANALISE: "em_analise",
  EM_APROVACAO: "em_aprovacao",
  FORMALIZACAO: "formalizacao",
  CREDITO_LIBERADO: "credito_liberado",
  FINALIZADOS: "finalizados",
  NAO_APROVADO: "nao_aprovado",
  LEADS_PERDIDOS: "leads_perdidos",
} as const;

export type KanbanColumn = typeof KANBAN_STAGES[keyof typeof KANBAN_STAGES];

export type StatusRepasse = "pendente" | "recebido";
export type TipoPessoa = "PJ" | "PF";

export interface ConjugeDados {
  nome: string;
  cpf: string;
  rg: string;
  nascimento: string;
  telefone: string;
  email: string;
  profissao?: string;
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

export interface TaxConfig {
  fin_imob?: number;
  home_equity?: number;
  bdmg?: number;
  [key: string]: number | undefined;
}

export const COMISSAO_PERCENTUAL = 0.0135;
export const COMISSAO_FIN_IMOB = 0.01;
export const COMISSAO_HOME_EQUITY = 0.03;

export interface ProductCommissionDef {
  type: "fixed" | "variable";
  configKey?: "comissao_bdmg" | "comissao_fin_imob" | "comissao_home_equity";
  defaultRate?: number;
  category: "bdmg" | "imovel" | "veiculo" | "consorcio";
}

/** Mapa explícito cobrindo as 29 grafias encontradas na base */
export const PRODUCT_COMMISSION_MAP: Record<string, ProductCommissionDef> = {
  // BDMG (Fixa — comissao_bdmg, default: 0.0135 = 1,35%)
  "BDMG Capital de Giro": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG Giro Procred360": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG Solidário 2026": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG Solidário 2025": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "FUNGETUR Novo Pronampe": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG GIRO": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG Pronampe 2022": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG Pronampe Fidelidade 2022": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG Crédito para Crescer - Pronampe": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG MPE Investe - Pronampe": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG Empreendedoras de Minas": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG Pronampe Mulheres 2022": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG MPE Investe Empreendedoras - Pronampe": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG Empreendedoras Procred360": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG Crédito para Crescer - Pronampe Investimento": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG MPE Investe Fidelidade - Pronampe": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG Crédito para Crescer": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG Giro Mais PEAC": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },
  "BDMG Investimento Fixo": { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" },

  // Imobiliário (Fixa — comissao_fin_imob, default: 0.01 = 1,00%)
  "Financiamento Imobiliário": { type: "fixed", configKey: "comissao_fin_imob", defaultRate: 0.01, category: "imovel" },

  // Home Equity (Fixa — comissao_home_equity, default: 0.03 = 3,00%)
  "Home Equity (Crédito com Garantia de Imóvel)": { type: "fixed", configKey: "comissao_home_equity", defaultRate: 0.03, category: "imovel" },
  "Crédito com Garantia de Imóvel": { type: "fixed", configKey: "comissao_home_equity", defaultRate: 0.03, category: "imovel" },

  // Veículos (Variável — sem taxa fixa padrão / definida caso a caso)
  "Crédito com Garantia de Veículo": { type: "variable", category: "veiculo" },
  "Financiamento de Veículos": { type: "variable", category: "veiculo" },
  "Financiamento de Veículo": { type: "variable", category: "veiculo" },
  "Garantia de Veículo": { type: "variable", category: "veiculo" },

  // Consórcios (Variável — sem taxa fixa padrão / definida caso a caso)
  "Consórcio": { type: "variable", category: "consorcio" },
  "Consórcio — Imóvel": { type: "variable", category: "consorcio" },
  "Consórcio - Imóvel": { type: "variable", category: "consorcio" },
  "Consórcio de Veículos": { type: "variable", category: "consorcio" },
  "Consórcio Imobiliário": { type: "variable", category: "consorcio" },
};

export function getProductCommissionDef(produto?: string | null): ProductCommissionDef {
  const p = (produto || "").trim();
  if (PRODUCT_COMMISSION_MAP[p]) {
    return PRODUCT_COMMISSION_MAP[p];
  }
  const lower = p.toLowerCase();
  if (lower.includes("veículo") || lower.includes("veiculo")) {
    return { type: "variable", category: "veiculo" };
  }
  if (lower.includes("consórcio") || lower.includes("consorcio")) {
    return { type: "variable", category: "consorcio" };
  }
  if (lower.includes("home equity") || lower.includes("garantia de imóvel") || lower.includes("garantia de imovel")) {
    return { type: "fixed", configKey: "comissao_home_equity", defaultRate: 0.03, category: "imovel" };
  }
  if (lower.includes("imobiliário") || lower.includes("imobiliario") || lower.includes("imóvel") || lower.includes("imovel")) {
    return { type: "fixed", configKey: "comissao_fin_imob", defaultRate: 0.01, category: "imovel" };
  }
  return { type: "fixed", configKey: "comissao_bdmg", defaultRate: 0.0135, category: "bdmg" };
}

export interface ComissaoInfo {
  rate: number | null;
  isVariable: boolean;
  isDefined: boolean;
  missingFixedConfig: boolean;
  warningCreditoLiberadoSemTaxa: boolean;
  status: "a_definir" | "definida" | "fixa";
  label: string;
  comissaoValor: number | null;
}

export function getComissaoInfo(
  p: Proposta,
  config?: TaxConfig | null
): ComissaoInfo {
  const def = getProductCommissionDef(p.produto);
  const isVariable = def.type === "variable";

  // Se taxa individual gravada (inclusive 0)
  if (p.comissao_percentual !== undefined && p.comissao_percentual !== null && !isNaN(p.comissao_percentual)) {
    const rate = Number(p.comissao_percentual);
    const comissaoValor = (p.valor_solicitado ?? 0) * rate;
    return {
      rate,
      isVariable,
      isDefined: true,
      missingFixedConfig: false,
      warningCreditoLiberadoSemTaxa: false,
      status: "definida",
      label: (rate * 100).toFixed(2).replace(".", ",") + "%",
      comissaoValor,
    };
  }

  // Se variável e sem taxa preenchida
  if (isVariable) {
    const isCreditoLiberado = p.coluna_kanban === "credito_liberado" || p.coluna_kanban === "finalizados";
    return {
      rate: null,
      isVariable: true,
      isDefined: false,
      missingFixedConfig: false,
      warningCreditoLiberadoSemTaxa: isCreditoLiberado,
      status: "a_definir",
      label: "A definir",
      comissaoValor: null,
    };
  }

  // Taxa fixa: buscar na Config (com fallback no defaultRate)
  let configuredRate: number | undefined;
  if (config && def.configKey) {
    if (def.configKey === "comissao_bdmg") configuredRate = config.bdmg;
    else if (def.configKey === "comissao_fin_imob") configuredRate = config.fin_imob;
    else if (def.configKey === "comissao_home_equity") configuredRate = config.home_equity;
  }

  const missingFixedConfig = configuredRate === undefined || configuredRate === null || isNaN(configuredRate);
  const rate = !missingFixedConfig ? (configuredRate as number) : (def.defaultRate ?? 0);
  const comissaoValor = (p.valor_solicitado ?? 0) * rate;

  return {
    rate,
    isVariable: false,
    isDefined: true,
    missingFixedConfig,
    warningCreditoLiberadoSemTaxa: false,
    status: "fixa",
    label: (rate * 100).toFixed(2).replace(".", ",") + "%",
    comissaoValor,
  };
}

export function getComissaoRate(p: Proposta, config?: TaxConfig | null): number {
  const info = getComissaoInfo(p, config);
  return info.rate ?? 0;
}

export function resolveTipoPessoa(
  doc?: string | null,
  produto?: string | null,
  razaoOuNome?: string | null
): TipoPessoa {
  const digits = (doc || "").replace(/\D/g, "");
  if (digits.length === 14) return "PJ";
  if (digits.length === 11) return "PF";
  if (digits.length === 13) return "PJ"; // Tratamento para CNPJ com perda de zero à esquerda

  // Regra de reserva pelo produto
  const prod = (produto || "").toLowerCase();
  if (
    prod.includes("bdmg") ||
    prod.includes("giro") ||
    prod.includes("pronampe") ||
    prod.includes("procred") ||
    prod.includes("fungetur") ||
    prod.includes("peac") ||
    prod.includes("capital de giro")
  ) {
    return "PJ";
  }

  if (
    prod.includes("imobiliário") ||
    prod.includes("imobiliario") ||
    prod.includes("imovel") ||
    prod.includes("imóvel") ||
    prod.includes("veículo") ||
    prod.includes("veiculo") ||
    prod.includes("home equity")
  ) {
    return "PF";
  }

  const nome = (razaoOuNome || "").toUpperCase();
  if (
    nome.includes("LTDA") ||
    nome.includes(" ME") ||
    nome.includes(" EPP") ||
    nome.includes("S/A") ||
    nome.includes("S.A.")
  ) {
    return "PJ";
  }

  return "PF";
}

export interface DateValidationResult {
  valid: boolean;
  error?: string;
}

export function parseDateSafe(input?: string | null): Date | null {
  if (!input) return null;
  const str = String(input).trim();
  if (!str) return null;

  const brMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brMatch) {
    const d = new Date(parseInt(brMatch[3], 10), parseInt(brMatch[2], 10) - 1, parseInt(brMatch[1], 10), 12, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  }

  const isoDateMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoDateMatch) {
    const d = new Date(parseInt(isoDateMatch[1], 10), parseInt(isoDateMatch[2], 10) - 1, parseInt(isoDateMatch[3], 10), 12, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

export function toDateInputFormat(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Regra A: data_liberacao e data_recusa são válidas entre o timestamp_envio
 * da proposta e hoje + 30 dias.
 */
export function getEventoDateLimits(timestampEnvio?: string | null): { min: string; max: string; minDateDisplay: string } {
  const now = new Date();
  const max = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30, 12, 0, 0);
  let minDate = new Date(2024, 0, 1, 12, 0, 0);
  if (timestampEnvio) {
    const parsed = parseDateSafe(timestampEnvio);
    if (parsed) minDate = parsed;
  }
  return {
    min: toDateInputFormat(minDate),
    max: toDateInputFormat(max),
    minDateDisplay: formatDateDisplay(minDate),
  };
}

export function validateEventoDate(dateStr: string, timestampEnvio?: string | null): DateValidationResult {
  if (!dateStr) return { valid: false, error: "Data não informada." };
  const d = parseDateSafe(dateStr);
  if (!d) return { valid: false, error: "Formato de data inválido." };

  const limits = getEventoDateLimits(timestampEnvio);
  const minD = parseDateSafe(limits.min);
  const maxD = parseDateSafe(limits.max);
  if (!minD || !maxD) return { valid: false, error: "Limites de data inválidos." };

  const check = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
  if (check < minD || check > maxD) {
    return {
      valid: false,
      error: `Data inválida. Deve estar entre a data de criação da proposta (${limits.minDateDisplay}) e até 30 dias à frente.`,
    };
  }
  return { valid: true };
}

/**
 * Regra B: followup_data é válida de hoje até 24 meses à frente.
 */
export function getFollowupDateLimits(): { min: string; max: string } {
  const now = new Date();
  const min = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  const max = new Date(now.getFullYear(), now.getMonth() + 24, now.getDate(), 12, 0, 0);
  return {
    min: toDateInputFormat(min),
    max: toDateInputFormat(max),
  };
}

export function validateFollowupDate(dateStr: string): DateValidationResult {
  if (!dateStr) return { valid: false, error: "Data de follow-up não informada." };
  const d = parseDateSafe(dateStr);
  if (!d) return { valid: false, error: "Formato de data de follow-up inválido." };

  const limits = getFollowupDateLimits();
  const minD = parseDateSafe(limits.min);
  const maxD = parseDateSafe(limits.max);
  if (!minD || !maxD) return { valid: false, error: "Limites de follow-up inválidos." };

  const check = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
  if (check < minD || check > maxD) {
    return {
      valid: false,
      error: "Data de follow-up inválida. Deve estar entre hoje e até 24 meses à frente.",
    };
  }
  return { valid: true };
}

export const KANBAN_COLUMNS: { id: KanbanColumn; label: string; fase: number }[] = [
  { id: KANBAN_STAGES.NOVO_NEGOCIO,     label: "Novo Negócio",     fase: 0 },
  { id: KANBAN_STAGES.EM_ANALISE,       label: "Em Análise",       fase: 1 },
  { id: KANBAN_STAGES.EM_APROVACAO,     label: "Em Aprovação",     fase: 2 },
  { id: KANBAN_STAGES.FORMALIZACAO,     label: "Formalização",     fase: 3 },
  { id: KANBAN_STAGES.CREDITO_LIBERADO, label: "Crédito Liberado", fase: 4 },
  { id: KANBAN_STAGES.FINALIZADOS,      label: "Finalizados",      fase: 5 },
  { id: KANBAN_STAGES.NAO_APROVADO,     label: "Não Aprovado",     fase: 6 },
  { id: KANBAN_STAGES.LEADS_PERDIDOS,   label: "Leads Perdidos",   fase: 7 },
];

export const UF_LIST = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];
