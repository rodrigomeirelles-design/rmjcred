import { Proposta, COMISSAO_PERCENTUAL, KANBAN_COLUMNS, SocioDados } from "@/types";
import { PropostaImovel } from "@/types/imovel";
import { formatMoney, formatCNPJ, formatDate } from "@/lib/utils";

export type DetailRow = { label: string; value?: string | number | null; mono?: boolean };
export type DetailSection = { title: string; rows: DetailRow[] };

const money = (v?: number | null) => (v != null && v > 0 ? formatMoney(v) : undefined);

function endereco(logradouro?: string, numero?: string, complemento?: string): string | undefined {
  if (!logradouro && !numero) return undefined;
  return `${logradouro ?? ""}${numero ? `, ${numero}` : ""}${complemento ? ` – ${complemento}` : ""}`;
}

function cidadeUf(cidade?: string, uf?: string): string | undefined {
  if (!cidade && !uf) return undefined;
  return `${cidade ?? ""}${uf ? ` / ${uf}` : ""}`;
}

function proxMes(dataISO: string): string {
  const d = new Date(dataISO + "T12:00:00");
  return new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString().split("T")[0];
}

// ── Núcleo de Pessoa Física: usado para principal e segundo proponente ──
// Definir o conjunto de campos UMA vez garante que nenhum bloco perca campos.
type PessoaFisicaCore = {
  nome?: string; cpf?: string; celular?: string; email?: string;
  nascimento?: string; sexo?: string; nomeMae?: string; nomePai?: string;
  rgCnh?: string; orgaoEmissor?: string; profissao?: string;
  fonteRenda?: string; rendaMensal?: number;
};

function pessoaFisicaCoreRows(d: PessoaFisicaCore): DetailRow[] {
  return [
    { label: "Nome", value: d.nome },
    { label: "CPF", value: d.cpf },
    { label: "Celular", value: d.celular },
    { label: "E-mail", value: d.email },
    { label: "Nascimento", value: d.nascimento },
    { label: "Sexo", value: d.sexo },
    { label: "Nome da Mãe", value: d.nomeMae },
    { label: "Nome do Pai", value: d.nomePai },
    { label: "RG / CNH", value: d.rgCnh },
    { label: "Órgão Emissor", value: d.orgaoEmissor },
    { label: "Profissão", value: d.profissao },
    { label: "Fonte de Renda", value: d.fonteRenda },
    { label: "Renda Mensal", value: money(d.rendaMensal), mono: true },
  ];
}

// ─── PESSOA FÍSICA (Crédito Imobiliário) ──────────────────────────────────────

export function buildPFSections(p: PropostaImovel & { etapa_label?: string }): DetailSection[] {
  const sections: DetailSection[] = [];

  if (p.etapa_label) {
    sections.push({
      title: "Status da Proposta",
      rows: [
        { label: "Etapa", value: p.etapa_label },
        { label: "Produto", value: p.produto },
        { label: "Valor do Financiamento", value: money(p.valorFinanciamento), mono: true },
        { label: "Enviado em", value: p.timestamp_envio ? formatDate(p.timestamp_envio.split("T")[0]) : undefined },
      ],
    });
  }

  sections.push({
    title: "Proponente Principal",
    rows: [
      ...pessoaFisicaCoreRows({
        nome: p.nome, cpf: p.cpf, celular: p.celular, email: p.email,
        nascimento: p.nascimento, sexo: p.sexo, nomeMae: p.nomeMae, nomePai: p.nomePai,
        rgCnh: p.rgCnh, orgaoEmissor: p.orgaoEmissor, profissao: p.profissao,
        fonteRenda: p.fonteRenda, rendaMensal: p.rendaMensal,
      }),
      { label: "Estado Civil", value: p.estadoCivil },
      { label: "Regime de Comunhão", value: p.regimeUniao },
      { label: "Naturalidade", value: p.naturalidade },
      { label: "Nacionalidade", value: p.nacionalidade },
    ],
  });

  sections.push({
    title: "Endereço do Proponente",
    rows: [
      { label: "CEP", value: p.cep },
      { label: "Logradouro", value: endereco(p.logradouro, p.numero, p.complemento) },
      { label: "Bairro", value: p.bairro },
      { label: "Cidade / UF", value: cidadeUf(p.cidade, p.uf) },
    ],
  });

  sections.push({
    title: "Dados Bancários",
    rows: [
      { label: "Banco", value: p.banco },
      { label: "Agência", value: p.agencia },
      { label: "Conta", value: p.conta },
    ],
  });

  if (p.conjuge_nome) {
    sections.push({
      title: `Cônjuge${p.regimeUniao ? ` — ${p.regimeUniao}` : ""}`,
      rows: [
        { label: "Nome", value: p.conjuge_nome },
        { label: "CPF", value: p.conjuge_cpf },
        { label: "Celular", value: p.conjuge_celular },
        { label: "E-mail", value: p.conjuge_email },
        { label: "Nascimento", value: p.conjuge_nascimento },
        { label: "Sexo", value: p.conjuge_sexo },
        { label: "Profissão", value: p.conjuge_profissao },
        { label: "Fonte de Renda", value: p.conjuge_fonteRenda },
        { label: "Renda Mensal", value: money(p.conjuge_rendaMensal), mono: true },
      ],
    });
  }

  if (p.temSegundoProponente && p.sp_nome) {
    sections.push({
      title: "Segundo Proponente (compõe renda)",
      rows: pessoaFisicaCoreRows({
        nome: p.sp_nome, cpf: p.sp_cpf, celular: p.sp_celular, email: p.sp_email,
        nascimento: p.sp_nascimento, sexo: p.sp_sexo, nomeMae: p.sp_nomeMae, nomePai: p.sp_nomePai,
        rgCnh: p.sp_rgCnh, orgaoEmissor: p.sp_orgaoEmissor, profissao: p.sp_profissao,
        fonteRenda: p.sp_fonteRenda, rendaMensal: p.sp_rendaMensal,
      }),
    });
  }

  sections.push({
    title: "Dados do Imóvel",
    rows: [
      { label: "Produto", value: p.produto },
      { label: "Tipo", value: p.tipoImovel },
      { label: "Estado de Conservação", value: p.estadoConservacao },
      { label: "Valor do Imóvel", value: money(p.valorImovel), mono: true },
      { label: "Valor do Financiamento", value: money(p.valorFinanciamento), mono: true },
      { label: "Prazo", value: p.prazo ? `${p.prazo} meses` : undefined },
      { label: "UF do Imóvel", value: p.ufImovel },
      { label: "Usar FGTS", value: p.usarFgts === "sim" ? "Sim" : undefined },
      { label: "Valor do FGTS", value: money(p.valorFgts), mono: true },
    ],
  });

  if (p.imovel_cep || p.imovel_logradouro) {
    sections.push({
      title: "Endereço do Imóvel",
      rows: [
        { label: "CEP", value: p.imovel_cep },
        { label: "Logradouro", value: endereco(p.imovel_logradouro, p.imovel_numero, p.imovel_complemento) },
        { label: "Bairro", value: p.imovel_bairro },
        { label: "Cidade / UF", value: cidadeUf(p.imovel_cidade, p.imovel_uf) },
        { label: "Matrícula / IPTU", value: p.matriculaIptu },
        { label: "Situação", value: p.situacaoImovel },
      ],
    });
  }

  if (p.observacoes) {
    sections.push({ title: "Observações", rows: [{ label: "", value: p.observacoes }] });
  }

  return sections;
}

// ─── PESSOA JURÍDICA (Capital de Giro BDMG) ──────────────────────────────────

function socioSections(s: SocioDados, index: number): DetailSection[] {
  const sections: DetailSection[] = [];
  sections.push({
    title: `Sócio ${index + 1} — ${s.nome}`,
    rows: [
      { label: "CPF", value: s.cpf },
      { label: "RG", value: s.rg },
      { label: "Nascimento", value: s.nascimento ? formatDate(s.nascimento) : undefined },
      { label: "Estado Civil", value: s.estado_civil },
      { label: "Regime", value: s.regime },
      { label: "Participação", value: s.participacao != null ? `${s.participacao}%` : undefined },
      { label: "Profissão", value: s.profissao },
      { label: "Nacionalidade", value: s.nacionalidade },
      { label: "E-mail", value: s.email },
      { label: "Telefone", value: s.telefone },
      { label: "Renda Mensal", value: money(s.renda), mono: true },
      { label: "Endereço", value: endereco(s.logradouro, s.numero, s.complemento) },
      { label: "Bairro", value: s.bairro },
      { label: "Cidade / UF", value: cidadeUf(s.cidade, s.uf) },
      { label: "CEP", value: s.cep },
      { label: "Imóvel (garantia)", value: s.imovel_tipo },
      { label: "Imóvel (valor)", value: money(s.imovel_valor) },
      { label: "Reside em imóvel próprio", value: s.reside_imovel_proprio === "sim" ? "Sim" : s.reside_imovel_proprio === "nao" ? "Não" : undefined },
      { label: "Veículos", value: (s.veiculo_placas?.length ?? 0) > 0 ? s.veiculo_placas.join(", ") : undefined },
    ],
  });

  if (s.conjuge) {
    const c = s.conjuge;
    sections.push({
      title: `Cônjuge de ${s.nome} — ${c.nome}`,
      rows: [
        { label: "CPF", value: c.cpf },
        { label: "RG", value: c.rg },
        { label: "Nascimento", value: c.nascimento ? formatDate(c.nascimento) : undefined },
        { label: "Telefone", value: c.telefone },
        { label: "E-mail", value: c.email },
        { label: "Imóvel", value: c.imovel_tipo },
        { label: "Imóvel (valor)", value: money(c.imovel_valor) },
        { label: "Veículos", value: (c.veiculo_placas?.length ?? 0) > 0 ? c.veiculo_placas.join(", ") : undefined },
        { label: "Compõe renda", value: c.incluir_renda === "sim" ? money(c.renda) : undefined, mono: true },
      ],
    });
  }

  return sections;
}

export function buildPJSections(p: Proposta): DetailSection[] {
  const comissao = (p.valor_solicitado ?? 0) * COMISSAO_PERCENTUAL;
  const etapaLabel = KANBAN_COLUMNS.find((c) => c.id === p.coluna_kanban)?.label ?? p.coluna_kanban;

  const sections: DetailSection[] = [];

  sections.push({
    title: "Status da Proposta",
    rows: [
      { label: "Etapa", value: etapaLabel },
      { label: "Valor do Crédito", value: money(p.valor_solicitado), mono: true },
      { label: "Comissão (1,35%)", value: comissao > 0 ? formatMoney(comissao) : undefined, mono: true },
      { label: "Repasse", value: p.status_repasse === "recebido" ? "Comissão recebida" : "Pendente" },
      { label: "Data de Liberação", value: p.data_liberacao ? formatDate(p.data_liberacao) : undefined },
      { label: "Processamento M+1", value: p.data_liberacao ? formatDate(proxMes(p.data_liberacao)) : undefined },
      { label: "Follow-up", value: p.followup_data ? formatDate(p.followup_data) : undefined },
      { label: "Motivo de Recusa", value: p.motivo_perda },
    ],
  });

  sections.push({
    title: "Dados da Empresa",
    rows: [
      { label: "Razão Social", value: p.emp_razao },
      { label: "Nome Fantasia", value: p.emp_fantasia },
      { label: "CNPJ", value: p.emp_cnpj ? formatCNPJ(p.emp_cnpj) : undefined },
      { label: "Nº Funcionários", value: p.emp_funcionarios ? String(p.emp_funcionarios) : undefined },
      { label: "Regime Tributário", value: p.emp_regime_tributario },
      { label: "Imóvel da Empresa", value: p.emp_imovel_tipo },
      { label: "Imóvel (valor)", value: money(p.emp_imovel_valor) },
    ],
  });

  sections.push({
    title: "Representante Legal",
    rows: [
      { label: "Nome", value: p.emp_repr_nome },
      { label: "CPF", value: p.emp_repr_cpf },
      { label: "E-mail", value: p.emp_email },
      { label: "Telefone", value: p.emp_telefone },
    ],
  });

  sections.push({
    title: "Endereço",
    rows: [
      { label: "CEP", value: p.emp_cep },
      { label: "Logradouro", value: endereco(p.emp_logradouro, p.emp_numero, p.emp_complemento) },
      { label: "Bairro", value: p.emp_bairro },
      { label: "Cidade / UF", value: cidadeUf(p.emp_cidade, p.emp_uf) },
    ],
  });

  (p.socios ?? []).forEach((s, i) => {
    sections.push(...socioSections(s, i));
  });

  sections.push({
    title: "Dados Bancários",
    rows: [
      { label: "Banco", value: p.banco_nome ? `${p.banco_nome}${p.banco_numero ? ` — ${p.banco_numero}` : ""}` : undefined },
      { label: "Agência", value: p.banco_agencia },
      { label: "Conta", value: p.banco_conta ? `${p.banco_conta}${p.banco_digito ? `-${p.banco_digito}` : ""}` : undefined },
    ],
  });

  if (p.obs_finais) {
    sections.push({ title: "Observações", rows: [{ label: "", value: p.obs_finais }] });
  }

  return sections;
}
