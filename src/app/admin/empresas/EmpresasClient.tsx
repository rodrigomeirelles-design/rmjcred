"use client";

import { useState, useMemo } from "react";
import { Proposta, KANBAN_COLUMNS, type KanbanColumn, COMISSAO_PERCENTUAL } from "@/types";
import { formatMoney, formatDate, formatCNPJ, addDays } from "@/lib/utils";
import {
  Building2, Search, X, Printer, Loader2,
  CheckCircle2, Clock, ArrowLeftRight, Eye, Pencil, Trash2,
} from "lucide-react";

interface Props {
  initialPropostas: Proposta[];
}

const KANBAN_LABEL = Object.fromEntries(KANBAN_COLUMNS.map((c) => [c.id, c.label]));

function proxMes(dataISO: string): string {
  const d = new Date(dataISO + "T12:00:00");
  return new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString().split("T")[0];
}

// ─── Ficha de Cadastro A4 ────────────────────────────────────────────────────

const S: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
    background: "white", color: "#1a1a1a", fontSize: 10, lineHeight: 1.6,
    padding: "36px 40px",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    borderBottom: "1px solid #e8e8e8", paddingBottom: 20, marginBottom: 24,
  },
  headerLeft: { display: "flex", flexDirection: "column", gap: 4 },
  brand: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 },
  brandDot: { width: 10, height: 10, borderRadius: "50%", background: "#234469", flexShrink: 0 },
  brandName: { fontSize: 11, fontWeight: 700, color: "#234469", letterSpacing: "0.06em", textTransform: "uppercase" as const },
  companyName: { fontSize: 20, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.4px", lineHeight: 1.2 },
  cnpj: { fontSize: 10, color: "#999", fontFamily: "monospace", marginTop: 2 },
  headerRight: { textAlign: "right" as const, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 },
  etapa: {
    fontSize: 10, fontWeight: 600, color: "#234469",
    background: "#eef2f9", padding: "4px 12px", borderRadius: 20,
    display: "inline-block",
  },
  metaDate: { fontSize: 9, color: "#aaa" },
  metaId: {
    fontSize: 8, fontFamily: "monospace", color: "#bbb",
    background: "#f5f5f5", padding: "2px 8px", borderRadius: 4, display: "inline-block",
  },
  sectionTitle: {
    fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const,
    letterSpacing: "0.12em", color: "#aaa",
    borderBottom: "1px solid #f0f0f0", paddingBottom: 6,
    marginBottom: 10, marginTop: 20,
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 28px" },
  grid1: { display: "grid", gridTemplateColumns: "1fr", gap: "8px" },
  cell: { display: "flex", flexDirection: "column" as const, gap: 1 },
  cellLabel: { fontSize: 8, fontWeight: 600, color: "#bbb", textTransform: "uppercase" as const, letterSpacing: "0.06em" },
  cellValue: { fontSize: 10, color: "#1a1a1a", wordBreak: "break-word" as const },
  socioBox: {
    border: "1px solid #f0f0f0", borderRadius: 10,
    marginTop: 14, overflow: "hidden" as const, pageBreakInside: "avoid" as const,
  },
  socioHeader: {
    background: "#f8f9fb", padding: "8px 14px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    borderBottom: "1px solid #f0f0f0",
  },
  socioName: { fontSize: 11, fontWeight: 700, color: "#1a1a1a" },
  socioTag: {
    fontSize: 9, color: "#234469", background: "#eef2f9",
    padding: "2px 10px", borderRadius: 20, fontWeight: 600,
  },
  socioBody: { padding: "12px 14px" },
  conjugeBox: {
    background: "#fafafa", border: "1px solid #f0f0f0",
    borderRadius: 6, padding: "10px 12px", marginTop: 12,
  },
  conjugeLabel: {
    fontSize: 9, fontWeight: 700, color: "#bbb",
    textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 8,
  },
  footer: {
    marginTop: 28, paddingTop: 14, borderTop: "1px solid #f0f0f0",
    textAlign: "center" as const, fontSize: 8, color: "#ccc", letterSpacing: "0.05em",
  },
};

function Cell({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div style={S.cell}>
      <span style={S.cellLabel}>{label}</span>
      <span style={S.cellValue}>{String(value)}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={S.sectionTitle}>{children}</div>;
}

function FichaCadastro({ proposta }: { proposta: Proposta }) {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const kLabel = KANBAN_LABEL[proposta.coluna_kanban] || proposta.coluna_kanban;

  return (
    <div className="hidden print:block ficha-cadastro" style={S.page}>
      {/* Cabeçalho */}
      <div style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.brand}>
            <span style={S.brandDot} />
            <span style={S.brandName}>RMJ Soluções de Crédito</span>
          </div>
          <span style={S.companyName}>{proposta.emp_razao || proposta.emp_fantasia || formatCNPJ(proposta.emp_cnpj)}</span>
          <span style={S.cnpj}>{formatCNPJ(proposta.emp_cnpj)}</span>
        </div>
        <div style={S.headerRight}>
          <span style={S.etapa}>{kLabel}</span>
          <span style={S.metaDate}>Emitido em {hoje}</span>
          <span style={S.metaId}>#{proposta.id_proposta?.slice(0, 8).toUpperCase()}</span>
        </div>
      </div>

      {/* Empresa */}
      <SectionTitle>Dados da Empresa</SectionTitle>
      <div style={S.grid2}>
        <Cell label="Razão Social" value={proposta.emp_razao} />
        <Cell label="CNPJ" value={formatCNPJ(proposta.emp_cnpj)} />
        <Cell label="Nome Fantasia" value={proposta.emp_fantasia} />
        <Cell label="Nº Funcionários" value={proposta.emp_funcionarios} />
        {proposta.valor_solicitado != null && <Cell label="Valor do Crédito" value={formatMoney(proposta.valor_solicitado)} />}
      </div>

      {/* Representante */}
      <SectionTitle>Representante Legal</SectionTitle>
      <div style={S.grid2}>
        <Cell label="Nome" value={proposta.emp_repr_nome} />
        <Cell label="CPF" value={proposta.emp_repr_cpf} />
        <Cell label="E-mail" value={proposta.emp_email} />
        <Cell label="Telefone / WhatsApp" value={proposta.emp_telefone} />
      </div>

      {/* Endereço */}
      <SectionTitle>Endereço da Empresa</SectionTitle>
      <div style={S.grid2}>
        <Cell label="CEP" value={proposta.emp_cep} />
        <Cell label="Logradouro / Nº" value={`${proposta.emp_logradouro}, ${proposta.emp_numero}${proposta.emp_complemento ? ` — ${proposta.emp_complemento}` : ""}`} />
        <Cell label="Bairro" value={proposta.emp_bairro} />
        <Cell label="Cidade / UF" value={`${proposta.emp_cidade} / ${proposta.emp_uf}`} />
      </div>

      {/* Patrimônio empresa */}
      {proposta.emp_imovel === "sim" && (
        <>
          <SectionTitle>Patrimônio da Empresa — Imóvel</SectionTitle>
          <div style={S.grid2}>
            <Cell label="Tipo de Comprovação" value={proposta.emp_imovel_tipo} />
            <Cell label="Valor Estimado" value={proposta.emp_imovel_valor ? formatMoney(proposta.emp_imovel_valor) : undefined} />
          </div>
        </>
      )}

      {/* Sócios */}
      {proposta.socios?.map((s, i) => (
        <div key={i} style={S.socioBox}>
          <div style={S.socioHeader}>
            <span style={S.socioName}>Sócio {i + 1} — {s.nome}</span>
            <span style={S.socioTag}>{s.participacao}%</span>
          </div>
          <div style={S.socioBody}>
            <div style={S.grid2}>
              <Cell label="CPF" value={s.cpf} />
              <Cell label="RG" value={s.rg} />
              <Cell label="Data de Nascimento" value={formatDate(s.nascimento)} />
              <Cell label="Estado Civil" value={s.estado_civil} />
              {s.regime && <Cell label="Regime" value={s.regime} />}
              <Cell label="Profissão" value={s.profissao} />
              <Cell label="Nacionalidade" value={s.nacionalidade} />
              <Cell label="E-mail" value={s.email} />
              <Cell label="Telefone" value={s.telefone} />
              <Cell label="Renda Mensal" value={formatMoney(s.renda)} />
              <Cell label="CEP" value={s.cep} />
              <Cell label="Logradouro / Nº" value={`${s.logradouro}, ${s.numero}${s.complemento ? ` — ${s.complemento}` : ""}`} />
              <Cell label="Bairro" value={s.bairro} />
              <Cell label="Cidade / UF" value={`${s.cidade} / ${s.uf}`} />
              {s.possui_imovel === "sim" && <Cell label="Imóvel (comprovação)" value={s.imovel_tipo} />}
              {s.possui_imovel === "sim" && s.imovel_valor != null && <Cell label="Imóvel (valor)" value={formatMoney(s.imovel_valor)} />}
              {s.possui_veiculo === "sim" && (s.veiculo_placas?.length ?? 0) > 0 && <Cell label="Veículos (placas)" value={s.veiculo_placas.join(", ")} />}
            </div>

            {s.conjuge && (
              <div style={S.conjugeBox}>
                <div style={S.conjugeLabel}>Cônjuge — {s.conjuge.nome}</div>
                <div style={S.grid2}>
                  <Cell label="CPF" value={s.conjuge.cpf} />
                  <Cell label="RG" value={s.conjuge.rg} />
                  <Cell label="Data de Nascimento" value={formatDate(s.conjuge.nascimento)} />
                  <Cell label="Telefone" value={s.conjuge.telefone} />
                  <Cell label="E-mail" value={s.conjuge.email} />
                  {s.conjuge.possui_imovel === "sim" && <Cell label="Imóvel (comprovação)" value={s.conjuge.imovel_tipo} />}
                  {s.conjuge.possui_imovel === "sim" && s.conjuge.imovel_valor != null && <Cell label="Imóvel (valor)" value={formatMoney(s.conjuge.imovel_valor)} />}
                  {s.conjuge.possui_veiculo === "sim" && (s.conjuge.veiculo_placas?.length ?? 0) > 0 && <Cell label="Veículos" value={s.conjuge.veiculo_placas.join(", ")} />}
                  {s.conjuge.incluir_renda === "sim" && s.conjuge.renda != null && <Cell label="Renda" value={formatMoney(s.conjuge.renda)} />}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Dados Bancários */}
      <SectionTitle>Dados Bancários</SectionTitle>
      <div style={S.grid2}>
        <Cell label="Banco" value={`${proposta.banco_nome} — Nº ${proposta.banco_numero}`} />
        <Cell label="Agência" value={proposta.banco_agencia} />
        <Cell label="Conta / Dígito" value={`${proposta.banco_conta}-${proposta.banco_digito}`} />
      </div>

      {/* Observações */}
      {proposta.obs_finais && (
        <>
          <SectionTitle>Observações Finais</SectionTitle>
          <div style={{ ...S.grid1, fontSize: 9, color: "#333", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 4, padding: "5px 8px" }}>
            {proposta.obs_finais}
          </div>
        </>
      )}

      {/* Status */}
      <SectionTitle>Status da Proposta</SectionTitle>
      <div style={S.grid2}>
        <Cell label="Etapa Atual" value={kLabel} />
        <Cell label="Status Repasse" value={proposta.status_repasse === "recebido" ? "Comissão recebida" : "Comissão pendente"} />
        {proposta.valor_solicitado != null && <Cell label="Valor do Crédito" value={formatMoney(proposta.valor_solicitado)} />}
        {proposta.valor_solicitado != null && <Cell label="Comissão (1,35%)" value={formatMoney(proposta.valor_solicitado * COMISSAO_PERCENTUAL)} />}
        {proposta.data_liberacao && <Cell label="Data de Liberação" value={formatDate(proposta.data_liberacao)} />}
        {proposta.data_liberacao && <Cell label="Processamento M+1" value={formatDate(proxMes(proposta.data_liberacao))} />}
        {proposta.followup_data && <Cell label="Follow-up Agendado" value={formatDate(proposta.followup_data)} />}
        {proposta.motivo_perda && <Cell label="Motivo da Recusa" value={proposta.motivo_perda} />}
      </div>

      <div style={S.footer}>
        RMJ Soluções de Crédito · Capital de Giro BDMG · Emitido em {hoje} · Documento Confidencial
      </div>
    </div>
  );
}

// ─── Modal Não Aprovada ─────────────────────────────────────────────────────

function NaoAprovadaModal({ empresa, onConfirm, onClose }: {
  empresa: string;
  onConfirm: (motivo: string, data: string) => void;
  onClose: () => void;
}) {
  const [motivo, setMotivo] = useState("");
  const [data, setData] = useState("");
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:hidden">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <h2 className="font-semibold text-[var(--color-text)]">Registrar recusa — {empresa}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--color-surface-subtle)] rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="label-base mb-1">Motivo da recusa <span className="text-red-500">*</span></label>
            <textarea
              className="input-base min-h-[80px] resize-none"
              placeholder="Descreva o motivo da recusa pelo BDMG..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>
          <div>
            <label className="label-base mb-1">Data da recusa <span className="text-red-500">*</span></label>
            <input type="date" className="input-base" value={data} onChange={(e) => setData(e.target.value)} />
          </div>
          {data && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Follow-up automático em: <strong>{formatDate(addDays(data, 30))}</strong>
            </p>
          )}
        </div>
        <div className="flex gap-3 p-5 border-t border-[var(--color-border)]">
          <button onClick={onClose} className="flex-1 btn-outline">Cancelar</button>
          <button
            onClick={() => onConfirm(motivo, data)}
            disabled={!motivo.trim() || !data}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Drawer de detalhes ─────────────────────────────────────────────────────

function DataRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-[var(--color-text-muted)] w-36 flex-shrink-0">{label}</span>
      <span className="text-[var(--color-text)] font-medium flex-1 break-words">{value}</span>
    </div>
  );
}

function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

const FASE_COLOR: Record<KanbanColumn, string> = {
  novo_negocio:     "bg-slate-100 text-slate-600",
  em_analise:       "bg-blue-100 text-blue-700",
  em_aprovacao:     "bg-amber-100 text-amber-700",
  formalizacao:     "bg-purple-100 text-purple-700",
  credito_liberado: "bg-green-100 text-green-700",
  nao_aprovado:     "bg-red-100 text-red-700",
  leads_perdidos:   "bg-zinc-100 text-zinc-500",
};

function EmpresaDrawer({ proposta, saving, onClose, onMove, onPrint }: {
  proposta: Proposta;
  saving: boolean;
  onClose: () => void;
  onMove: (id: string, to: KanbanColumn) => void;
  onPrint: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end print:hidden">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-[var(--color-surface)] w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col border-l border-[var(--color-border)]">

        <div className="sticky top-0 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-5 py-4 z-10 gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-bold text-[var(--color-text)] truncate">{proposta.emp_razao || formatCNPJ(proposta.emp_cnpj)}</p>
            <p className="text-xs text-[var(--color-text-muted)] font-mono">{formatCNPJ(proposta.emp_cnpj)}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {saving && <Loader2 className="w-4 h-4 animate-spin text-[var(--color-text-muted)]" />}
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-brand-primary)] text-white rounded-lg text-xs font-semibold hover:bg-[var(--color-brand-primary-dark)] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimir Ficha
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors">
              <X className="w-4 h-4 text-[var(--color-text)]" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-5 space-y-6">
          {/* Mover no Kanban */}
          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <ArrowLeftRight className="w-4 h-4 text-[var(--color-brand-primary)]" />
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Mover no Kanban</h3>
            </div>
            <select
              value={proposta.coluna_kanban}
              onChange={(e) => onMove(proposta.id_proposta, e.target.value as KanbanColumn)}
              disabled={saving}
              className="input-base w-full text-sm"
            >
              {KANBAN_COLUMNS.map((col) => (
                <option key={col.id} value={col.id}>{col.label}</option>
              ))}
            </select>
          </div>

          <DrawerSection title="Dados da Empresa">
            <DataRow label="Razão Social" value={proposta.emp_razao} />
            <DataRow label="Nome Fantasia" value={proposta.emp_fantasia} />
            <DataRow label="CNPJ" value={formatCNPJ(proposta.emp_cnpj)} />
            <DataRow label="Nº Funcionários" value={String(proposta.emp_funcionarios || "")} />
          </DrawerSection>

          <DrawerSection title="Representante Legal">
            <DataRow label="Nome" value={proposta.emp_repr_nome} />
            <DataRow label="CPF" value={proposta.emp_repr_cpf} />
            <DataRow label="E-mail" value={proposta.emp_email} />
            <DataRow label="Telefone" value={proposta.emp_telefone} />
          </DrawerSection>

          <DrawerSection title="Endereço">
            <DataRow label="CEP" value={proposta.emp_cep} />
            <DataRow label="Logradouro" value={`${proposta.emp_logradouro}, ${proposta.emp_numero}`} />
            <DataRow label="Complemento" value={proposta.emp_complemento} />
            <DataRow label="Bairro" value={proposta.emp_bairro} />
            <DataRow label="Cidade / UF" value={`${proposta.emp_cidade} / ${proposta.emp_uf}`} />
          </DrawerSection>

          {proposta.emp_imovel === "sim" && (
            <DrawerSection title="Patrimônio da Empresa">
              <DataRow label="Tipo Comprovação" value={proposta.emp_imovel_tipo} />
              <DataRow label="Valor Estimado" value={proposta.emp_imovel_valor ? formatMoney(proposta.emp_imovel_valor) : undefined} />
            </DrawerSection>
          )}

          {proposta.socios?.map((s, i) => (
            <div key={i} className="border border-[var(--color-border)] rounded-xl overflow-hidden">
              <div className="bg-[var(--color-surface-subtle)] px-4 py-2.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[var(--color-brand-primary)] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="font-semibold text-sm text-[var(--color-text)] flex-1 min-w-0 truncate">{s.nome}</p>
                <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0">{s.participacao}%</span>
              </div>
              <div className="p-4 space-y-4">
                <DrawerSection title="Dados Pessoais">
                  <DataRow label="CPF" value={s.cpf} />
                  <DataRow label="RG" value={s.rg} />
                  <DataRow label="Nascimento" value={formatDate(s.nascimento)} />
                  <DataRow label="Estado Civil" value={s.estado_civil} />
                  {s.regime && <DataRow label="Regime" value={s.regime} />}
                  <DataRow label="Profissão" value={s.profissao} />
                  <DataRow label="Nacionalidade" value={s.nacionalidade} />
                  <DataRow label="E-mail" value={s.email} />
                  <DataRow label="Telefone" value={s.telefone} />
                  <DataRow label="Renda" value={formatMoney(s.renda)} />
                </DrawerSection>
                <DrawerSection title="Endereço do Sócio">
                  <DataRow label="CEP" value={s.cep} />
                  <DataRow label="Logradouro" value={`${s.logradouro}, ${s.numero}`} />
                  <DataRow label="Complemento" value={s.complemento} />
                  <DataRow label="Bairro" value={s.bairro} />
                  <DataRow label="Cidade / UF" value={`${s.cidade} / ${s.uf}`} />
                </DrawerSection>
                {(s.possui_imovel === "sim" || s.possui_veiculo === "sim") && (
                  <DrawerSection title="Patrimônio do Sócio">
                    {s.possui_imovel === "sim" && <DataRow label="Imóvel (comprov.)" value={s.imovel_tipo} />}
                    {s.possui_imovel === "sim" && s.imovel_valor != null && <DataRow label="Imóvel (valor)" value={formatMoney(s.imovel_valor)} />}
                    {s.possui_veiculo === "sim" && (s.veiculo_placas?.length ?? 0) > 0 && <DataRow label="Placas" value={s.veiculo_placas.join(", ")} />}
                  </DrawerSection>
                )}
                {s.conjuge && (
                  <div className="border-t border-[var(--color-border)] pt-4">
                    <h4 className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">
                      Cônjuge — {s.conjuge.nome}
                    </h4>
                    <div className="space-y-1.5">
                      <DataRow label="CPF" value={s.conjuge.cpf} />
                      <DataRow label="RG" value={s.conjuge.rg} />
                      <DataRow label="Nascimento" value={formatDate(s.conjuge.nascimento)} />
                      <DataRow label="Telefone" value={s.conjuge.telefone} />
                      <DataRow label="E-mail" value={s.conjuge.email} />
                      {s.conjuge.possui_imovel === "sim" && <DataRow label="Imóvel (comprov.)" value={s.conjuge.imovel_tipo} />}
                      {s.conjuge.possui_imovel === "sim" && s.conjuge.imovel_valor != null && <DataRow label="Imóvel (valor)" value={formatMoney(s.conjuge.imovel_valor)} />}
                      {s.conjuge.possui_veiculo === "sim" && (s.conjuge.veiculo_placas?.length ?? 0) > 0 && <DataRow label="Veículos" value={s.conjuge.veiculo_placas.join(", ")} />}
                      {s.conjuge.incluir_renda === "sim" && s.conjuge.renda != null && <DataRow label="Renda" value={formatMoney(s.conjuge.renda)} />}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <DrawerSection title="Dados Bancários">
            <DataRow label="Banco" value={`${proposta.banco_nome} — Nº ${proposta.banco_numero}`} />
            <DataRow label="Agência" value={proposta.banco_agencia} />
            <DataRow label="Conta / Dígito" value={`${proposta.banco_conta}-${proposta.banco_digito}`} />
          </DrawerSection>

          {proposta.obs_finais && (
            <DrawerSection title="Observações Finais">
              <p className="text-sm text-[var(--color-text)] bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-lg p-3 leading-relaxed">
                {proposta.obs_finais}
              </p>
            </DrawerSection>
          )}

          <DrawerSection title="Status da Proposta">
            {proposta.valor_solicitado != null && <DataRow label="Valor do Crédito" value={formatMoney(proposta.valor_solicitado)} />}
            {proposta.valor_solicitado != null && <DataRow label="Comissão (1,35%)" value={formatMoney(proposta.valor_solicitado * COMISSAO_PERCENTUAL)} />}
            {proposta.data_liberacao && <DataRow label="Data de Liberação" value={formatDate(proposta.data_liberacao)} />}
            {proposta.data_liberacao && <DataRow label="Processamento M+1" value={formatDate(proxMes(proposta.data_liberacao))} />}
            <DataRow label="Repasse" value={proposta.status_repasse === "recebido" ? "Comissão recebida" : "Pendente"} />
            {proposta.followup_data && (
              <div className="flex items-center gap-2 mt-1 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span className="text-sm text-amber-800">Follow-up em <strong>{formatDate(proposta.followup_data)}</strong></span>
              </div>
            )}
            {proposta.motivo_perda && (
              <div className="mt-1 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm text-red-700">
                <strong>Motivo da recusa:</strong> {proposta.motivo_perda}
              </div>
            )}
          </DrawerSection>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Editar ───────────────────────────────────────────────────────────

function EditModal({ proposta, onSave, onClose }: {
  proposta: Proposta;
  onSave: (id: string, fields: Record<string, string | number | null>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    emp_razao: proposta.emp_razao || "",
    emp_cnpj: proposta.emp_cnpj || "",
    emp_fantasia: proposta.emp_fantasia || "",
    emp_repr_nome: proposta.emp_repr_nome || "",
    emp_email: proposta.emp_email || "",
    emp_telefone: proposta.emp_telefone || "",
    valor_solicitado: proposta.valor_solicitado != null ? String(proposta.valor_solicitado) : "",
    obs_finais: proposta.obs_finais || "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const fields: Record<string, string | number | null> = {
      emp_razao: form.emp_razao,
      emp_cnpj: form.emp_cnpj,
      emp_fantasia: form.emp_fantasia || null,
      emp_repr_nome: form.emp_repr_nome,
      emp_email: form.emp_email,
      emp_telefone: form.emp_telefone,
      obs_finais: form.obs_finais || null,
    };
    if (form.valor_solicitado) {
      const v = parseFloat(form.valor_solicitado.replace(/\D/g, "")) / 100;
      fields.valor_solicitado = isNaN(v) ? null : v;
    }
    await onSave(proposta.id_proposta, fields);
    setSaving(false);
    onClose();
  }

  function f(key: keyof typeof form) {
    return { value: form[key], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, [key]: e.target.value })) };
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <h2 className="font-semibold text-[var(--color-text)]">Editar proposta</h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--color-surface-subtle)] rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label-base">Razão Social</label>
              <input className="input-base" {...f("emp_razao")} />
            </div>
            <div>
              <label className="label-base">CNPJ</label>
              <input className="input-base font-mono" {...f("emp_cnpj")} />
            </div>
            <div>
              <label className="label-base">Nome Fantasia</label>
              <input className="input-base" {...f("emp_fantasia")} />
            </div>
            <div>
              <label className="label-base">Representante</label>
              <input className="input-base" {...f("emp_repr_nome")} />
            </div>
            <div>
              <label className="label-base">E-mail</label>
              <input type="email" className="input-base" {...f("emp_email")} />
            </div>
            <div>
              <label className="label-base">Telefone</label>
              <input className="input-base" {...f("emp_telefone")} />
            </div>
            <div>
              <label className="label-base">Valor do Crédito (R$)</label>
              <input className="input-base font-mono" placeholder="0,00" {...f("valor_solicitado")} />
            </div>
            <div className="col-span-2">
              <label className="label-base">Observações</label>
              <textarea className="input-base min-h-[72px] resize-none" {...f("obs_finais")} />
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-[var(--color-border)]">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.emp_razao.trim()}
            className="flex-1 px-4 py-2 bg-[var(--color-brand-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-primary-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Excluir ───────────────────────────────────────────────────────────

function DeleteModal({ empresa, onConfirm, onClose, deleting }: {
  empresa: string;
  onConfirm: () => void;
  onClose: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <h2 className="font-semibold text-[var(--color-text)]">Excluir proposta</h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--color-surface-subtle)] rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          <p className="text-sm text-[var(--color-text-muted)]">
            Tem certeza que deseja excluir a proposta de <strong className="text-[var(--color-text)]">{empresa}</strong>? Esta ação não pode ser desfeita.
          </p>
        </div>
        <div className="flex gap-3 p-5 border-t border-[var(--color-border)]">
          <button onClick={onClose} disabled={deleting} className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] transition-colors disabled:opacity-40">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ───────────────────────────────────────────────────

export default function EmpresasClient({ initialPropostas }: Props) {
  const [propostas, setPropostas] = useState(initialPropostas);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Proposta | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingNaoAprovada, setPendingNaoAprovada] = useState<{ id: string } | null>(null);
  const [editing, setEditing] = useState<Proposta | null>(null);
  const [deleting, setDeleting] = useState<Proposta | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const qDigits = q.replace(/\D/g, "");
    return propostas.filter((p) =>
      p.emp_razao.toLowerCase().includes(q) ||
      (qDigits && p.emp_cnpj.replace(/\D/g, "").includes(qDigits)) ||
      (p.emp_repr_nome?.toLowerCase() || "").includes(q)
    );
  }, [propostas, search]);

  async function handleMove(id: string, to: KanbanColumn) {
    const proposta = propostas.find((p) => p.id_proposta === id);
    if (!proposta || to === proposta.coluna_kanban) return;

    if (to === "nao_aprovado") {
      setPendingNaoAprovada({ id });
      return;
    }

    setSaving(true);
    try {
      await fetch(`/api/propostas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coluna_kanban: to }),
      });
      const up = (p: Proposta) => p.id_proposta === id ? { ...p, coluna_kanban: to } : p;
      setPropostas((prev) => prev.map(up));
      setSelected((prev) => prev?.id_proposta === id ? { ...prev, coluna_kanban: to } : prev);
    } finally {
      setSaving(false);
    }
  }

  async function confirmNaoAprovada(motivo: string, data: string) {
    if (!pendingNaoAprovada) return;
    const { id } = pendingNaoAprovada;
    const followup = addDays(data, 30);
    const patch = { coluna_kanban: "nao_aprovado" as KanbanColumn, motivo_perda: motivo, data_recusa: data, followup_data: followup };
    setSaving(true);
    setPendingNaoAprovada(null);
    try {
      await fetch(`/api/propostas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const up = (p: Proposta) => p.id_proposta === id ? { ...p, ...patch } : p;
      setPropostas((prev) => prev.map(up));
      setSelected((prev) => prev?.id_proposta === id ? { ...prev, ...patch } : prev);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEdit(id: string, fields: Record<string, string | number | null>) {
    await fetch(`/api/propostas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    setPropostas((prev) => prev.map((p) => p.id_proposta === id ? { ...p, ...fields } as Proposta : p));
    setSelected((prev) => prev?.id_proposta === id ? { ...prev, ...fields } as Proposta : prev);
  }

  async function handleDelete(id: string) {
    setIsDeleting(true);
    try {
      await fetch(`/api/propostas/${id}`, { method: "DELETE" });
      setPropostas((prev) => prev.filter((p) => p.id_proposta !== id));
      if (selected?.id_proposta === id) setSelected(null);
      setDeleting(null);
    } finally {
      setIsDeleting(false);
    }
  }

  const selectedCurrent = selected
    ? (propostas.find((p) => p.id_proposta === selected.id_proposta) ?? selected)
    : null;

  const totalCredito = filtered.reduce((s, p) => s + (p.valor_solicitado || 0), 0);

  return (
    <>
      <div className="print:hidden flex flex-col h-full">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between gap-4 flex-shrink-0 flex-wrap bg-[var(--color-surface)]">
          <div>
            <h1 className="text-lg font-bold text-[var(--color-text)]">Pessoa Jurídica</h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              {filtered.length} empresa{filtered.length !== 1 ? "s" : ""}
              {totalCredito > 0 && (
                <span> · Volume de crédito: <span className="font-money font-semibold text-green-600">{formatMoney(totalCredito)}</span></span>
              )}
            </p>
          </div>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Nome, CNPJ ou representante..."
              className="input-base pl-9 text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabela */}
        <div className="flex-1 overflow-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Building2 className="w-12 h-12 text-[var(--color-text-muted)] mb-3 opacity-40" />
              <p className="text-[var(--color-text-muted)] font-medium">
                {search ? "Nenhuma empresa encontrada" : "Nenhuma empresa cadastrada ainda"}
              </p>
              {search && (
                <button onClick={() => setSearch("")} className="text-xs text-[var(--color-brand-primary)] mt-2 hover:underline">
                  Limpar busca
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border)] sticky top-0 z-10">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider w-[35%]">Empresa</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Etapa</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Representante</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Crédito</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell">Cadastro</th>
                  <th className="px-4 py-3 w-28"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const corFase = FASE_COLOR[p.coluna_kanban] ?? "bg-slate-100 text-slate-600";
                  const kLabel = KANBAN_LABEL[p.coluna_kanban] || p.coluna_kanban;
                  return (
                    <tr
                      key={p.id_proposta}
                      onClick={() => setSelected(p)}
                      className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[var(--color-text)] truncate max-w-[260px]">{p.emp_razao || formatCNPJ(p.emp_cnpj)}</p>
                        <p className="text-xs text-[var(--color-text-muted)] font-mono mt-0.5">{formatCNPJ(p.emp_cnpj)}</p>
                        <div className="flex gap-1.5 mt-1.5 flex-wrap">
                          {p.status_repasse === "recebido" && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Comissão recebida
                            </span>
                          )}
                          {p.followup_data && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" /> Follow-up: {formatDate(p.followup_data)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${corFase}`}>{kLabel}</span>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)] hidden md:table-cell">
                        <p className="truncate max-w-[180px]">{p.emp_repr_nome}</p>
                        <p className="text-xs truncate max-w-[180px]">{p.emp_email}</p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-money font-semibold text-green-600 whitespace-nowrap">{p.valor_solicitado ? formatMoney(p.valor_solicitado) : "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--color-text-muted)] text-xs hidden lg:table-cell whitespace-nowrap">
                        {formatDate(p.timestamp_envio?.split("T")[0] || "")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelected(p); }}
                            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)] hover:bg-blue-50 transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditing(p); }}
                            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleting(p); }}
                            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedCurrent && (
        <EmpresaDrawer
          proposta={selectedCurrent}
          saving={saving}
          onClose={() => setSelected(null)}
          onMove={handleMove}
          onPrint={() => window.print()}
        />
      )}

      {pendingNaoAprovada && (
        <NaoAprovadaModal
          empresa={propostas.find((p) => p.id_proposta === pendingNaoAprovada.id)?.emp_razao ?? ""}
          onConfirm={confirmNaoAprovada}
          onClose={() => setPendingNaoAprovada(null)}
        />
      )}

      {selectedCurrent && <FichaCadastro proposta={selectedCurrent} />}

      {editing && (
        <EditModal
          proposta={editing}
          onSave={handleSaveEdit}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <DeleteModal
          empresa={deleting.emp_razao || formatCNPJ(deleting.emp_cnpj)}
          deleting={isDeleting}
          onConfirm={() => handleDelete(deleting.id_proposta)}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  );
}
