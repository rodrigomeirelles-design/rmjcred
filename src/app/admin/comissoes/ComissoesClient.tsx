"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Proposta,
  getComissaoInfo,
  resolveTipoPessoa,
  TaxConfig,
  getProductCommissionDef,
} from "@/types";
import { formatMoney, formatDate, formatCNPJ } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  DollarSign, Download, Eye, EyeOff, Pencil, Check, X,
  Loader2, TrendingUp, Clock, CheckCircle2, Settings2, AlertTriangle,
} from "lucide-react";

interface Props {
  propostas: Proposta[];
}

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function formatPercent(value: number): string {
  return (value * 100).toFixed(2).replace(".", ",") + "%";
}

function parsePercent(str: string): number {
  const clean = str.replace(/[^0-9,\.]/g, "").replace(",", ".");
  return (parseFloat(clean) || 0) / 100;
}

export default function ComissoesClient({ propostas }: Props) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "PJ" | "PF">("todos");
  const [showValues, setShowValues] = useState(false);
  const [taxConfig, setTaxConfig] = useState<TaxConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [editingTax, setEditingTax] = useState<string | null>(null);
  const [editTaxValue, setEditTaxValue] = useState("");
  const [editingPropostaId, setEditingPropostaId] = useState<string | null>(null);
  const [editPropostaRate, setEditPropostaRate] = useState("");
  const [savingProposta, setSavingProposta] = useState(false);

  // Load tax config from Config tab
  useEffect(() => {
    fetch("/api/comissoes/config")
      .then((r) => r.json())
      .then((data) => { setTaxConfig(data); setLoadingConfig(false); })
      .catch(() => setLoadingConfig(false));
  }, []);

  // Available years from propostas
  const years = useMemo(() => {
    const ySet = new Set<number>();
    propostas.forEach((p) => {
      if (p.data_liberacao) ySet.add(new Date(p.data_liberacao + "T12:00:00").getFullYear());
      if (p.timestamp_envio) ySet.add(new Date(p.timestamp_envio).getFullYear());
    });
    ySet.add(now.getFullYear());
    return Array.from(ySet).sort((a, b) => b - a);
  }, [propostas, now]);

  // Filter propostas with data_liberacao in the selected month
  const allComissioned = useMemo(() => {
    return propostas.filter((p) => {
      const inScope = p.coluna_kanban === "credito_liberado" || p.coluna_kanban === "finalizados";
      if (!inScope || !p.data_liberacao) return false;
      const d = new Date(p.data_liberacao + "T12:00:00");
      if (d.getMonth() !== selectedMonth || d.getFullYear() !== selectedYear) return false;
      const pTipo = p.tipo_pessoa || resolveTipoPessoa(p.emp_cnpj, p.produto, p.emp_razao);
      if (filtroTipo !== "todos" && pTipo !== filtroTipo) return false;
      return true;
    });
  }, [propostas, selectedMonth, selectedYear, filtroTipo]);

  // Alertas
  const propostasSemTaxaVariavel = useMemo(() => {
    return allComissioned.filter((p) => {
      const info = getComissaoInfo(p, taxConfig);
      return info.warningCreditoLiberadoSemTaxa;
    });
  }, [allComissioned, taxConfig]);

  const propostasSemConfigFixa = useMemo(() => {
    return allComissioned.filter((p) => {
      const info = getComissaoInfo(p, taxConfig);
      return info.missingFixedConfig;
    });
  }, [allComissioned, taxConfig]);

  // Summaries
  const totalPendente = allComissioned
    .filter((p) => p.status_repasse === "pendente")
    .reduce((s, p) => {
      const info = getComissaoInfo(p, taxConfig);
      return s + (info.comissaoValor ?? 0);
    }, 0);

  const totalRecebido = allComissioned
    .filter((p) => p.status_repasse === "recebido")
    .reduce((s, p) => {
      const info = getComissaoInfo(p, taxConfig);
      return s + (info.comissaoValor ?? 0);
    }, 0);

  const totalVolume = allComissioned
    .reduce((s, p) => s + (p.valor_solicitado ?? 0), 0);

  // Save tax config
  const saveTax = useCallback(async (key: string, value: number) => {
    setSavingConfig(true);
    try {
      await fetch("/api/comissoes/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
      setTaxConfig((prev) => prev ? { ...prev, [key]: value } : prev);
    } catch (e) {
      console.error(e);
    }
    setSavingConfig(false);
    setEditingTax(null);
  }, []);

  // Save per-proposal rate
  const savePropostaRate = useCallback(async (id: string, rate: number) => {
    setSavingProposta(true);
    try {
      await fetch(`/api/propostas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comissao_percentual: rate }),
      });
      // Atualiza localmente
      const p = propostas.find((x) => x.id_proposta === id);
      if (p) p.comissao_percentual = rate;
    } catch (e) {
      console.error(e);
    }
    setSavingProposta(false);
    setEditingPropostaId(null);
  }, [propostas]);

  // Export CSV
  function exportCSV() {
    const headers = ["Empresa/Nome", "Tipo", "Produto", "Valor Crédito", "Taxa", "Comissão", "Status", "Data Liberação"];
    const rows = allComissioned.map((p) => {
      const info = getComissaoInfo(p, taxConfig);
      const pTipo = p.tipo_pessoa || resolveTipoPessoa(p.emp_cnpj, p.produto, p.emp_razao);
      return [
        p.emp_razao,
        pTipo,
        p.produto,
        p.valor_solicitado ?? "",
        info.label,
        info.comissaoValor != null ? info.comissaoValor : "A definir",
        p.status_repasse,
        p.data_liberacao ?? "",
      ];
    });
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comissoes-${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const maskVal = (val: number) => (showValues ? formatMoney(val) : "R$ •••••");

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Gestão de Comissões</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Acompanhamento de repasses e comissões sobre crédito liberado
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowValues(!showValues)}
          >
            {showValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showValues ? "Ocultar" : "Mostrar"} Valores
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Alerta de propostas em Crédito Liberado sem taxa informada (Alíquota Variável) */}
      {propostasSemTaxaVariavel.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 shadow-sm animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">
              Atenção: {propostasSemTaxaVariavel.length} proposta(s) de produto com alíquota variável (Veículo/Consórcio) em Crédito Liberado sem taxa definida!
            </p>
            <p className="text-amber-700 text-xs mt-0.5">
              Essas comissões não estão sendo somadas ao total do Dashboard até que uma taxa seja informada. Clique no ícone de lápis na coluna &quot;Taxa&quot; para definir a alíquota de cada contrato.
            </p>
          </div>
        </div>
      )}

      {/* Alerta de produto de alíquota fixa sem configuração cadastrada */}
      {propostasSemConfigFixa.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-900 shadow-sm animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">
              Aviso: Alíquota fixa não configurada na aba Config para {propostasSemConfigFixa.length} contrato(s).
            </p>
            <p className="text-rose-700 text-xs mt-0.5">
              O sistema está operando com as alíquotas padrão de contingência. Configure as taxas no card de Alíquotas Padrão abaixo.
            </p>
          </div>
        </div>
      )}

      {/* Competence & Type Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[var(--color-border)] rounded-xl p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Competência:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="input-base text-sm py-1.5 px-3 w-auto"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="input-base text-sm py-1.5 px-3 w-auto"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Filtro Tipo Pessoa */}
        <div className="flex items-center gap-1 bg-[var(--color-surface-subtle)] p-1 rounded-lg">
          {(["todos", "PJ", "PF"] as const).map((tipo) => (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filtroTipo === tipo
                  ? "bg-white text-[var(--color-text)] shadow-sm font-semibold"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {tipo === "todos" ? "Todos" : tipo}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Volume */}
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Crédito Liberado</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-money text-[var(--color-text)]">{maskVal(totalVolume)}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">{allComissioned.length} contrato(s) no mês</p>
        </div>

        {/* Total Comissão */}
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Comissão Total</span>
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-money text-green-600">{maskVal(totalPendente + totalRecebido)}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {totalVolume > 0 ? ((totalPendente + totalRecebido) / totalVolume * 100).toFixed(2).replace(".", ",") + "% médio" : "—"}
          </p>
        </div>

        {/* Pendente */}
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Pendente de Repasse</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-money text-amber-600">{maskVal(totalPendente)}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {allComissioned.filter((p) => p.status_repasse === "pendente").length} a receber
          </p>
        </div>

        {/* Recebido */}
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Repasse Recebido</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-money text-emerald-600">{maskVal(totalRecebido)}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {allComissioned.filter((p) => p.status_repasse === "recebido").length} recebidos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tax Config Card */}
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 shadow-sm space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-[var(--color-text-muted)]" />
              <h2 className="text-sm font-semibold text-[var(--color-text)]">Alíquotas Padrão (Config)</h2>
            </div>
            {loadingConfig && <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--color-text-muted)]" />}
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            Taxas sincronizadas diretamente com a aba Config da planilha. Produtos de Veículo e Consórcio utilizam alíquota variável caso a caso.
          </p>

          <div className="space-y-3 pt-1">
            {[
              { key: "bdmg", label: "BDMG (Capital de Giro / Pronampe)", editable: true },
              { key: "fin_imob", label: "Financiamento Imobiliário", editable: true },
              { key: "home_equity", label: "Home Equity (Garantia Imóvel)", editable: true },
              { key: "veiculo", label: "Veículos (Financ. / Garantia)", editable: false, isVar: true },
              { key: "consorcio", label: "Consórcios (Imóvel / Veículo)", editable: false, isVar: true },
            ].map(({ key, label, editable, isVar }) => (
              <div key={key} className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--color-surface-subtle)]">
                <span className="text-xs font-medium text-[var(--color-text)]">{label}</span>
                <div className="flex items-center gap-2">
                  {isVar ? (
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded">
                      variável (caso a caso)
                    </span>
                  ) : editingTax === key ? (
                    <>
                      <input
                        type="text"
                        className="input-base w-20 text-xs text-right font-mono"
                        value={editTaxValue}
                        onChange={(e) => setEditTaxValue(e.target.value)}
                        autoFocus
                        placeholder="0,00%"
                      />
                      <button
                        onClick={() => saveTax(key, parsePercent(editTaxValue))}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Salvar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingTax(null)}
                        className="p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] rounded"
                        title="Cancelar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="font-mono text-xs font-semibold text-[var(--color-text)]">
                        {taxConfig && taxConfig[key as keyof TaxConfig] != null
                          ? formatPercent(taxConfig[key as keyof TaxConfig]!)
                          : "—"}
                      </span>
                      {editable && (
                        <button
                          onClick={() => {
                            setEditingTax(key);
                            setEditTaxValue(
                              taxConfig && taxConfig[key as keyof TaxConfig] != null
                                ? formatPercent(taxConfig[key as keyof TaxConfig]!)
                                : ""
                            );
                          }}
                          className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] rounded"
                          title="Editar taxa padrão"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
              <h2 className="text-sm font-semibold text-[var(--color-text)]">
                Detalhamento — {MONTHS[selectedMonth]} {selectedYear}
              </h2>
              <span className="text-xs text-[var(--color-text-muted)]">{allComissioned.length} registro(s)</span>
            </div>

            {allComissioned.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <DollarSign className="w-10 h-10 text-[var(--color-border)] mb-3" />
                <p className="text-sm text-[var(--color-text-muted)]">Nenhum contrato com crédito liberado nesta competência</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-left bg-slate-50">
                      <th className="px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Empresa / Nome</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Tipo</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Produto</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide text-right">Valor Crédito</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide text-right">Taxa</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide text-right">Comissão</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide text-center">Status</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Liberação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {allComissioned.map((p) => {
                      const info = getComissaoInfo(p, taxConfig);
                      const isPF = (p.tipo_pessoa || resolveTipoPessoa(p.emp_cnpj, p.produto, p.emp_razao)) === "PF";
                      const isEditing = editingPropostaId === p.id_proposta;

                      return (
                        <tr key={p.id_proposta} className="hover:bg-[var(--color-surface-subtle)] transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-[var(--color-text)] leading-tight line-clamp-1">{p.emp_razao}</p>
                              {info.warningCreditoLiberadoSemTaxa && (
                                <span title="Atenção: Crédito Liberado sem taxa de comissão definida!" className="cursor-help text-amber-500 font-bold">
                                  ⚠️
                                </span>
                              )}
                              {info.missingFixedConfig && (
                                <span title="Atenção: Alíquota fixa não cadastrada na aba Config!" className="cursor-help text-rose-500 font-bold">
                                  ⚠️
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
                              {isPF ? p.emp_cnpj : formatCNPJ(p.emp_cnpj)}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={isPF ? "warning" : "info"} className="text-[10px]">
                              {isPF ? "PF" : "PJ"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-xs text-[var(--color-text)] font-medium max-w-[140px] truncate" title={p.produto}>
                            {p.produto || "—"}
                          </td>
                          <td className="px-4 py-3 text-right font-money font-semibold text-[var(--color-text)]">
                            {showValues ? formatMoney(p.valor_solicitado ?? 0) : "•••••"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {isEditing ? (
                                <>
                                  <input
                                    type="text"
                                    className="input-base w-20 text-xs text-right font-mono"
                                    value={editPropostaRate}
                                    onChange={(e) => setEditPropostaRate(e.target.value)}
                                    autoFocus
                                    placeholder="Ex: 1,35%"
                                  />
                                  <button
                                    onClick={() => savePropostaRate(p.id_proposta, parsePercent(editPropostaRate))}
                                    disabled={savingProposta}
                                    className="p-0.5 text-green-600 hover:bg-green-50 rounded"
                                    title="Confirmar taxa"
                                  >
                                    {savingProposta ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                  </button>
                                  <button
                                    onClick={() => setEditingPropostaId(null)}
                                    className="p-0.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] rounded"
                                    title="Cancelar"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  {info.status === "a_definir" ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                                      A definir
                                    </span>
                                  ) : (
                                    <span className="font-mono text-xs font-semibold text-[var(--color-text)]">
                                      {info.label}
                                    </span>
                                  )}
                                  <button
                                    onClick={() => {
                                      setEditingPropostaId(p.id_proposta);
                                      setEditPropostaRate(info.rate != null ? formatPercent(info.rate) : "");
                                    }}
                                    className="p-1 text-[var(--color-text-muted)] hover:text-blue-600 rounded"
                                    title="Editar alíquota deste contrato"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-money font-semibold text-green-600">
                            {info.status === "a_definir" ? (
                              <span className="text-amber-700 text-xs font-medium italic">A definir</span>
                            ) : (
                              showValues ? formatMoney(info.comissaoValor ?? 0) : "•••••"
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant={p.status_repasse === "recebido" ? "success" : "warning"} className="text-[10px]">
                              {p.status_repasse === "recebido" ? "Recebido" : "Pendente"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-[var(--color-text-muted)] text-xs">
                            {p.data_liberacao ? formatDate(p.data_liberacao) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[var(--color-border)] bg-[var(--color-surface-subtle)] font-bold">
                      <td colSpan={3} className="px-4 py-3 text-xs text-[var(--color-text)] uppercase">Totalizadores</td>
                      <td className="px-4 py-3 text-right font-money text-[var(--color-text)]">{maskVal(totalVolume)}</td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3 text-right font-money text-green-600">{maskVal(totalPendente + totalRecebido)}</td>
                      <td colSpan={2} className="px-4 py-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
