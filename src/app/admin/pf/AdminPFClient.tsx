"use client";

import { useState, useMemo } from "react";
import { PropostaImovel } from "@/types/imovel";
import { PropostaVeiculo } from "@/types/veiculo";
import { KanbanColumn } from "@/types";
import { buildPFSections, buildVeiculoSections } from "@/lib/detailSchemas";
import DetailPanel from "@/components/admin/DetailPanel";
import { Search, Home, Building2, Car, X, Trash2, Eye, Pencil, Printer } from "lucide-react";
import { formatMoney, maskMoney, parseMoney } from "@/lib/utils";

// ─── Tipos unificados ──────────────────────────────────────────────────────────

type PropostaImovelEnriquecida = PropostaImovel & {
  tipo_ficha: "imovel";
  etapa_kanban: KanbanColumn;
  etapa_label: string;
  nome_display: string;
  cpf_display: string;
  valor_display?: number;
  produto_display: string;
  timestamp_display?: string;
};

type PropostaVeiculoEnriquecida = PropostaVeiculo & {
  tipo_ficha: "veiculo";
  etapa_kanban: string;
  etapa_label: string;
  nome_display: string;
  cpf_display: string;
  valor_display?: number;
  produto_display: string;
  timestamp_display?: string;
};

type PropostaPF = PropostaImovelEnriquecida | PropostaVeiculoEnriquecida;

interface Props {
  initialPropostas: PropostaPF[];
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function ProdutoBadge({ proposta }: { proposta: PropostaPF }) {
  if (proposta.tipo_ficha === "veiculo") {
    const isGarantia = proposta.produto === "Crédito com Garantia de Veículo";
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${isGarantia ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
        <Car className="w-3 h-3" />
        {isGarantia ? "Garantia Veíc." : "Fin. Veículo"}
      </span>
    );
  }
  const isHE = proposta.produto === "Crédito com Garantia de Imóvel";
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${isHE ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
      {isHE ? <Building2 className="w-3 h-3" /> : <Home className="w-3 h-3" />}
      {isHE ? "Home Equity" : "Fin. Imóvel"}
    </span>
  );
}

function EtapaBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border)] whitespace-nowrap">
      {label}
    </span>
  );
}

// ─── Impressão ────────────────────────────────────────────────────────────────

function gerarHtmlFicha(nome: string, produto: string, etapa_label: string, timestamp: string | undefined, sectionsHtml: string) {
  return `<!DOCTYPE html><html><head>
    <title>Ficha – ${nome}</title><meta charset="utf-8" />
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:Arial,sans-serif;font-size:11pt;color:#111;background:#fff;padding:24px}
      h1{font-size:16pt;margin-bottom:4px}
      .sub{font-size:9pt;color:#666;margin-bottom:8px}
      h2{font-size:10pt;font-weight:bold;text-transform:uppercase;letter-spacing:.05em;color:#1E40AF;border-bottom:1.5px solid #1E40AF;padding-bottom:3px;margin:18px 0 8px}
      table{width:100%;border-collapse:collapse;margin-bottom:4px}
      tr:nth-child(even){background:#f5f7fa}
      footer{margin-top:24px;font-size:8pt;color:#999;border-top:1px solid #ddd;padding-top:8px}
      @media print{body{padding:16px}}
    </style></head><body>
    <h1>${nome}</h1>
    <p class="sub">${produto} · Etapa: ${etapa_label} · Enviado em ${timestamp ? new Date(timestamp).toLocaleDateString("pt-BR") : "—"}</p>
    ${sectionsHtml}
    <footer>Ficha gerada em ${new Date().toLocaleDateString("pt-BR")} — RMJ Soluções de Crédito</footer>
    </body></html>`;
}

function buildSectionsHtml(sections: { title: string; rows: { label: string; value?: string | number | null }[] }[]) {
  return sections.map((s) => {
    const rows = s.rows.filter((r) => r.value != null && r.value !== "");
    if (rows.length === 0) return "";
    const rowsHtml = rows.map((r) =>
      r.label === ""
        ? `<tr><td colspan="2" style="padding:4px 8px;font-style:italic;color:#555">${r.value}</td></tr>`
        : `<tr><td style="padding:3px 6px;color:#555;width:36%;font-size:9pt;vertical-align:top">${r.label}</td><td style="padding:3px 6px;font-size:10pt">${r.value}</td></tr>`
    ).join("");
    return `<h2>${s.title}</h2><table><tbody>${rowsHtml}</tbody></table>`;
  }).join("");
}

function imprimirFicha(p: PropostaPF) {
  let sections;
  if (p.tipo_ficha === "veiculo") {
    sections = buildVeiculoSections({ ...p, etapa_label: p.etapa_label });
  } else {
    sections = buildPFSections({ ...p, etapa_label: p.etapa_label });
  }

  const sectionsHtml = buildSectionsHtml(sections);
  const html = gerarHtmlFicha(p.nome_display, p.produto_display, p.etapa_label, p.timestamp_display, sectionsHtml);

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 300);
}

// ─── Modal Editar Imóvel ───────────────────────────────────────────────────────

function EditarModalImovel({ p, onClose, onSaved }: {
  p: PropostaImovelEnriquecida;
  onClose: () => void;
  onSaved: (updated: Partial<PropostaImovel>) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [temSP, setTemSP] = useState(p.temSegundoProponente);
  const [fields, setFields] = useState({
    nome: p.nome, cpf: p.cpf, celular: p.celular, email: p.email,
    nascimento: p.nascimento, sexo: p.sexo ?? "", estadoCivil: p.estadoCivil,
    rgCnh: p.rgCnh, orgaoEmissor: p.orgaoEmissor ?? "",
    nomeMae: p.nomeMae, nomePai: p.nomePai ?? "",
    naturalidade: p.naturalidade ?? "", nacionalidade: p.nacionalidade ?? "",
    regimeUniao: p.regimeUniao ?? "",
    conjuge_nome: p.conjuge_nome ?? "", conjuge_cpf: p.conjuge_cpf ?? "",
    conjuge_celular: p.conjuge_celular ?? "", conjuge_email: p.conjuge_email ?? "",
    conjuge_nascimento: p.conjuge_nascimento ?? "", conjuge_sexo: p.conjuge_sexo ?? "",
    conjuge_profissao: p.conjuge_profissao ?? "", conjuge_fonteRenda: p.conjuge_fonteRenda ?? "",
    cep: p.cep, logradouro: p.logradouro, numero: p.numero, complemento: p.complemento ?? "",
    bairro: p.bairro, cidade: p.cidade, uf: p.uf,
    fonteRenda: p.fonteRenda, profissao: p.profissao ?? "", empresa: p.empresa ?? "",
    data_casamento: p.data_casamento ?? "",
    banco: p.banco, agencia: p.agencia ?? "", conta: p.conta ?? "",
    sp_nome: p.sp_nome ?? "", sp_cpf: p.sp_cpf ?? "", sp_celular: p.sp_celular ?? "",
    sp_email: p.sp_email ?? "", sp_nascimento: p.sp_nascimento ?? "", sp_sexo: p.sp_sexo ?? "",
    sp_nomeMae: p.sp_nomeMae ?? "", sp_nomePai: p.sp_nomePai ?? "",
    sp_rgCnh: p.sp_rgCnh ?? "", sp_orgaoEmissor: p.sp_orgaoEmissor ?? "",
    sp_fonteRenda: p.sp_fonteRenda ?? "", sp_profissao: p.sp_profissao ?? "",
    tipoImovel: p.tipoImovel, estadoConservacao: p.estadoConservacao,
    prazo: p.prazo, ufImovel: p.ufImovel ?? "",
    matriculaIptu: p.matriculaIptu ?? "", situacaoImovel: p.situacaoImovel ?? "",
    observacoes: p.observacoes ?? "",
    rendaMensal_d: p.rendaMensal ? maskMoney(Math.round(p.rendaMensal * 100).toString()) : "",
    conjuge_rendaMensal_d: p.conjuge_rendaMensal ? maskMoney(Math.round(p.conjuge_rendaMensal * 100).toString()) : "",
    sp_rendaMensal_d: p.sp_rendaMensal ? maskMoney(Math.round(p.sp_rendaMensal * 100).toString()) : "",
    valorImovel_d: p.valorImovel ? maskMoney(Math.round(p.valorImovel * 100).toString()) : "",
    valorFinanciamento_d: p.valorFinanciamento ? maskMoney(Math.round(p.valorFinanciamento * 100).toString()) : "",
    valorFgts_d: p.valorFgts ? maskMoney(Math.round(p.valorFgts * 100).toString()) : "",
  });

  function set(key: keyof typeof fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const updates: Record<string, string | number | boolean> = {
      nome: fields.nome, cpf: fields.cpf, celular: fields.celular, email: fields.email,
      nascimento: fields.nascimento, sexo: fields.sexo, estadoCivil: fields.estadoCivil,
      rgCnh: fields.rgCnh, orgaoEmissor: fields.orgaoEmissor,
      nomeMae: fields.nomeMae, nomePai: fields.nomePai,
      naturalidade: fields.naturalidade, nacionalidade: fields.nacionalidade,
      regimeUniao: fields.regimeUniao, data_casamento: fields.data_casamento,
      conjuge_nome: fields.conjuge_nome, conjuge_cpf: fields.conjuge_cpf,
      conjuge_celular: fields.conjuge_celular, conjuge_email: fields.conjuge_email,
      conjuge_nascimento: fields.conjuge_nascimento, conjuge_sexo: fields.conjuge_sexo,
      conjuge_profissao: fields.conjuge_profissao, conjuge_fonteRenda: fields.conjuge_fonteRenda,
      conjuge_rendaMensal: parseMoney(fields.conjuge_rendaMensal_d),
      cep: fields.cep, logradouro: fields.logradouro, numero: fields.numero,
      complemento: fields.complemento, bairro: fields.bairro, cidade: fields.cidade, uf: fields.uf,
      fonteRenda: fields.fonteRenda, profissao: fields.profissao, empresa: fields.empresa,
      banco: fields.banco, agencia: fields.agencia, conta: fields.conta,
      rendaMensal: parseMoney(fields.rendaMensal_d),
      temSegundoProponente: temSP,
      sp_nome: temSP ? fields.sp_nome : "",
      sp_cpf: temSP ? fields.sp_cpf : "",
      sp_celular: temSP ? fields.sp_celular : "",
      sp_email: temSP ? fields.sp_email : "",
      sp_nascimento: temSP ? fields.sp_nascimento : "",
      sp_sexo: temSP ? fields.sp_sexo : "",
      sp_nomeMae: temSP ? fields.sp_nomeMae : "",
      sp_nomePai: temSP ? fields.sp_nomePai : "",
      sp_rgCnh: temSP ? fields.sp_rgCnh : "",
      sp_orgaoEmissor: temSP ? fields.sp_orgaoEmissor : "",
      sp_fonteRenda: temSP ? fields.sp_fonteRenda : "",
      sp_profissao: temSP ? fields.sp_profissao : "",
      sp_rendaMensal: temSP ? parseMoney(fields.sp_rendaMensal_d) : 0,
      tipoImovel: fields.tipoImovel, estadoConservacao: fields.estadoConservacao,
      prazo: fields.prazo, ufImovel: fields.ufImovel,
      matriculaIptu: fields.matriculaIptu, situacaoImovel: fields.situacaoImovel,
      observacoes: fields.observacoes,
      valorImovel: parseMoney(fields.valorImovel_d),
      valorFinanciamento: parseMoney(fields.valorFinanciamento_d),
      valorFgts: parseMoney(fields.valorFgts_d),
    };

    await fetch("/api/propostas-imovel", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id_proposta, ...updates }),
    });

    await fetch(`/api/propostas/${p.id_proposta}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emp_razao: fields.nome, emp_cnpj: fields.cpf,
        emp_email: fields.email, emp_telefone: fields.celular,
        valor_solicitado: parseMoney(fields.valorFinanciamento_d),
      }),
    });

    setSaving(false);
    onSaved(updates as unknown as Partial<PropostaImovel>);
  }

  const exigeConjuge = ["Casado(a)", "União Estável"].includes(fields.estadoCivil);

  function Field({ label, name, type = "text", placeholder }: { label: string; name: keyof typeof fields; type?: string; placeholder?: string }) {
    return (
      <div>
        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">{label}</label>
        <input
          type={type}
          value={fields[name]}
          onChange={(e) => set(name, e.target.value)}
          placeholder={placeholder}
          className="w-full text-sm bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] outline-none focus:border-[var(--color-brand-primary)] transition-colors"
        />
      </div>
    );
  }

  function MoneyField({ label, name }: { label: string; name: keyof typeof fields }) {
    return (
      <div>
        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">{label}</label>
        <input
          type="text"
          inputMode="numeric"
          value={fields[name]}
          onChange={(e) => set(name, maskMoney(e.target.value))}
          placeholder="R$ 0,00"
          className="w-full text-sm bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] outline-none focus:border-[var(--color-brand-primary)] transition-colors font-mono"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-[var(--color-surface)] border-b border-[var(--color-border)] px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-base font-bold text-[var(--color-text)]">Editar Proposta — Imóvel</h2>
            <p className="text-xs text-[var(--color-text-muted)]">{p.nome} · {p.cpf}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <EditSection title="Proponente Principal">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Nome Completo" name="nome" />
              <Field label="CPF" name="cpf" placeholder="000.000.000-00" />
              <Field label="Celular" name="celular" placeholder="(00) 00000-0000" />
              <Field label="E-mail" name="email" type="email" />
              <Field label="Data de Nascimento" name="nascimento" type="date" />
              <Field label="Sexo" name="sexo" />
              <Field label="Nome da Mãe" name="nomeMae" />
              <Field label="Nome do Pai" name="nomePai" />
              <Field label="RG / CNH" name="rgCnh" />
              <Field label="Órgão Emissor" name="orgaoEmissor" />
              <Field label="Profissão" name="profissao" />
              <Field label="Empresa / Empregador" name="empresa" />
              <Field label="Estado Civil" name="estadoCivil" />
              <Field label="Naturalidade" name="naturalidade" />
              <Field label="Nacionalidade" name="nacionalidade" />
              <Field label="Fonte de Renda" name="fonteRenda" />
              <MoneyField label="Renda Mensal" name="rendaMensal_d" />
            </div>
          </EditSection>

          {exigeConjuge && (
            <EditSection title="Cônjuge">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Regime de Comunhão" name="regimeUniao" />
                <Field label="Data do Casamento / União" name="data_casamento" type="date" />
                <Field label="Nome do Cônjuge" name="conjuge_nome" />
                <Field label="CPF do Cônjuge" name="conjuge_cpf" />
                <Field label="Celular do Cônjuge" name="conjuge_celular" />
                <Field label="E-mail do Cônjuge" name="conjuge_email" />
                <Field label="Nascimento do Cônjuge" name="conjuge_nascimento" type="date" />
                <Field label="Sexo do Cônjuge" name="conjuge_sexo" />
                <Field label="Profissão do Cônjuge" name="conjuge_profissao" />
                <Field label="Fonte de Renda Cônjuge" name="conjuge_fonteRenda" />
                <MoneyField label="Renda Mensal Cônjuge" name="conjuge_rendaMensal_d" />
              </div>
            </EditSection>
          )}

          <EditSection title="Segundo Proponente (compõe renda)">
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={temSP}
                onChange={(e) => setTemSP(e.target.checked)}
                className="w-4 h-4 accent-[var(--color-brand-primary)]"
              />
              <span className="text-sm text-[var(--color-text)]">Incluir segundo proponente</span>
            </label>
            {temSP && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Nome Completo" name="sp_nome" />
                <Field label="CPF" name="sp_cpf" />
                <Field label="Celular" name="sp_celular" />
                <Field label="E-mail" name="sp_email" type="email" />
                <Field label="Data de Nascimento" name="sp_nascimento" type="date" />
                <Field label="Sexo" name="sp_sexo" />
                <Field label="Nome da Mãe" name="sp_nomeMae" />
                <Field label="Nome do Pai" name="sp_nomePai" />
                <Field label="RG / CNH" name="sp_rgCnh" />
                <Field label="Órgão Emissor" name="sp_orgaoEmissor" />
                <Field label="Profissão" name="sp_profissao" />
                <Field label="Fonte de Renda" name="sp_fonteRenda" />
                <MoneyField label="Renda Mensal" name="sp_rendaMensal_d" />
              </div>
            )}
          </EditSection>

          <EditSection title="Endereço">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="CEP" name="cep" />
              <Field label="Número" name="numero" />
              <div className="sm:col-span-2"><Field label="Logradouro" name="logradouro" /></div>
              <Field label="Complemento" name="complemento" />
              <Field label="Bairro" name="bairro" />
              <Field label="Cidade" name="cidade" />
              <Field label="UF" name="uf" />
            </div>
          </EditSection>

          <EditSection title="Dados Bancários">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Banco" name="banco" />
              <Field label="Agência" name="agencia" />
              <Field label="Conta" name="conta" />
            </div>
          </EditSection>

          <EditSection title="Imóvel">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Tipo do Imóvel" name="tipoImovel" />
              <Field label="Estado de Conservação" name="estadoConservacao" />
              <MoneyField label="Valor do Imóvel" name="valorImovel_d" />
              <MoneyField label="Valor do Financiamento" name="valorFinanciamento_d" />
              <Field label="Prazo (meses)" name="prazo" />
              <Field label="UF do Imóvel" name="ufImovel" />
              <MoneyField label="Valor do FGTS" name="valorFgts_d" />
              <Field label="Matrícula / IPTU" name="matriculaIptu" />
              <Field label="Situação do Imóvel" name="situacaoImovel" />
            </div>
          </EditSection>

          <EditSection title="Observações">
            <textarea
              value={fields.observacoes}
              onChange={(e) => set("observacoes", e.target.value)}
              rows={3}
              className="w-full text-sm bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] outline-none focus:border-[var(--color-brand-primary)] transition-colors resize-none"
              placeholder="Anotações sobre esta proposta..."
            />
          </EditSection>
        </div>

        <div className="sticky bottom-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] px-5 py-4 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm bg-[var(--color-brand-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-medium">
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 pb-2 border-b border-[var(--color-border)]">{title}</p>
      {children}
    </div>
  );
}

// ─── Tabela principal ──────────────────────────────────────────────────────────

type FiltroTipo = "todos" | "imovel" | "veiculo";

export default function AdminPFClient({ initialPropostas }: Props) {
  const [propostas, setPropostas] = useState(initialPropostas);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos");
  const [detalhe, setDetalhe] = useState<PropostaPF | null>(null);
  const [editando, setEditando] = useState<PropostaImovelEnriquecida | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return propostas.filter((p) => {
      if (busca) {
        const q = busca.toLowerCase();
        if (!p.nome_display.toLowerCase().includes(q) && !p.cpf_display.includes(busca)) return false;
      }
      if (filtroTipo === "imovel" && p.tipo_ficha !== "imovel") return false;
      if (filtroTipo === "veiculo" && p.tipo_ficha !== "veiculo") return false;
      return true;
    });
  }, [propostas, busca, filtroTipo]);

  async function handleDelete(p: PropostaPF) {
    if (!confirm("Excluir esta proposta? Esta ação não pode ser desfeita.")) return;
    setDeletingId(p.id_proposta);
    // Excluir do kanban principal
    await fetch(`/api/propostas/${p.id_proposta}`, { method: "DELETE" });
    // Excluir da planilha específica
    if (p.tipo_ficha === "imovel") {
      await fetch(`/api/propostas-imovel/${p.id_proposta}`, { method: "DELETE" });
    } else {
      await fetch(`/api/propostas-veiculo/${p.id_proposta}`, { method: "DELETE" });
    }
    setPropostas((prev) => prev.filter((x) => x.id_proposta !== p.id_proposta));
    setDeletingId(null);
  }

  function handleSavedImovel(id: string, updated: Partial<PropostaImovel>) {
    setPropostas((prev) => prev.map((p) => p.id_proposta === id ? { ...p, ...updated } as PropostaPF : p));
    setEditando(null);
  }

  const totalVolume = filtered.reduce((s, p) => s + (p.valor_display || 0), 0);

  return (
    <div className="flex flex-col h-full">
      {/* Painel de detalhe */}
      {detalhe && (
        <DetailPanel
          title={detalhe.nome_display}
          subtitle={detalhe.cpf_display}
          badge={<ProdutoBadge proposta={detalhe} />}
          sections={
            detalhe.tipo_ficha === "veiculo"
              ? buildVeiculoSections({ ...detalhe as PropostaVeiculoEnriquecida, etapa_label: detalhe.etapa_label })
              : buildPFSections({ ...detalhe as PropostaImovelEnriquecida, etapa_label: detalhe.etapa_label })
          }
          onClose={() => setDetalhe(null)}
          actions={
            <>
              {detalhe.tipo_ficha === "imovel" && (
                <button
                  onClick={() => { setEditando(detalhe as PropostaImovelEnriquecida); setDetalhe(null); }}
                  title="Editar"
                  className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => imprimirFicha(detalhe)}
                title="Imprimir ficha"
                className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
              </button>
            </>
          }
        />
      )}

      {/* Modal editar imóvel */}
      {editando && (
        <EditarModalImovel
          p={editando}
          onClose={() => setEditando(null)}
          onSaved={(updated) => handleSavedImovel(editando.id_proposta, updated)}
        />
      )}

      {/* Header com busca e filtros */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 flex-1 min-w-48">
            <Search className="w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou CPF..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="bg-transparent text-sm outline-none w-full text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
            />
          </div>
          <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden text-xs font-semibold">
            {(["todos", "imovel", "veiculo"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFiltroTipo(t)}
                className={`px-3 py-1.5 transition-colors ${filtroTipo === t ? "bg-[var(--color-brand-primary)] text-white" : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]"}`}
              >
                {t === "todos" ? "Todos" : t === "imovel" ? "🏠 Imóvel" : "🚗 Veículo"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-4 mt-2 text-xs flex-wrap">
          <span className="text-[var(--color-text-muted)]">
            <strong className="text-[var(--color-text)]">{filtered.length}</strong> proposta{filtered.length !== 1 ? "s" : ""}
          </span>
          {totalVolume > 0 && (
            <span className="text-[var(--color-text-muted)]">
              Volume: <strong className="font-mono text-green-600">{formatMoney(totalVolume)}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-[var(--color-surface)] border-b border-[var(--color-border)] z-10">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Nome Completo</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wide hidden sm:table-cell">CPF</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wide hidden md:table-cell">Etapa</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Produto</th>
              <th className="text-right px-4 py-3 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wide hidden lg:table-cell">Valor</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wide hidden xl:table-cell">Data</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-16 text-[var(--color-text-muted)]">
                  Nenhuma proposta encontrada
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id_proposta} className="hover:bg-[var(--color-surface-subtle)] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--color-text)]">{p.nome_display}</p>
                  <p className="text-xs text-[var(--color-text-muted)] sm:hidden">{p.cpf_display}</p>
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs hidden sm:table-cell">{p.cpf_display}</td>
                <td className="px-4 py-3 hidden md:table-cell"><EtapaBadge label={p.etapa_label} /></td>
                <td className="px-4 py-3"><ProdutoBadge proposta={p} /></td>
                <td className="px-4 py-3 text-right font-mono text-green-600 hidden lg:table-cell">
                  {p.valor_display ? formatMoney(p.valor_display) : "—"}
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)] text-xs hidden xl:table-cell">
                  {p.timestamp_display ? new Date(p.timestamp_display).toLocaleDateString("pt-BR") : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <ActionBtn title="Detalhes" onClick={() => setDetalhe(p)}><Eye className="w-3.5 h-3.5" /></ActionBtn>
                    {p.tipo_ficha === "imovel" && (
                      <ActionBtn title="Editar" onClick={() => setEditando(p as PropostaImovelEnriquecida)} color="blue"><Pencil className="w-3.5 h-3.5" /></ActionBtn>
                    )}
                    <ActionBtn title="Imprimir ficha" onClick={() => imprimirFicha(p)} color="purple"><Printer className="w-3.5 h-3.5" /></ActionBtn>
                    <ActionBtn title="Excluir" onClick={() => handleDelete(p)} disabled={deletingId === p.id_proposta} color="red"><Trash2 className="w-3.5 h-3.5" /></ActionBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionBtn({ children, title, onClick, disabled, color }: {
  children: React.ReactNode; title: string; onClick: () => void; disabled?: boolean; color?: "blue" | "red" | "purple";
}) {
  const colorClass = {
    blue: "text-blue-500 hover:bg-blue-50 hover:text-blue-700",
    red: "text-red-400 hover:bg-red-50 hover:text-red-600",
    purple: "text-purple-400 hover:bg-purple-50 hover:text-purple-600",
    undefined: "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text)]",
  }[color ?? "undefined"];

  return (
    <button onClick={onClick} disabled={disabled} title={title} className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${colorClass}`}>
      {children}
    </button>
  );
}
