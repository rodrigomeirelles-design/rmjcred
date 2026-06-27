"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Proposta, getComissaoRate } from "@/types";
import { formatMoney, formatDate, formatCNPJ, maskMoney, parseMoney } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  DollarSign, Download, Eye, EyeOff, Pencil, Check, X,
  Loader2, TrendingUp, Clock, CheckCircle2, Settings2,
} from "lucide-react";

interface Props {
  propostas: Proposta[];
}

interface TaxConfig {
  fin_imob: number;
  home_equity: number;
  bdmg: number;
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

  // Load tax config
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
  const monthPropostas = useMemo(() => {
    return propostas.filter((p) => {
      if (!p.data_liberacao) return false;
      const d = new Date(p.data_liberacao + "T12:00:00");
      if (d.getMonth() !== selectedMonth || d.getFullYear() !== selectedYear) return false;
      if (filtroTipo !== "todos" && (p.tipo_pessoa || "PJ") !== filtroTipo) return false;
      return true;
    });
  }, [propostas, selectedMonth, selectedYear, filtroTipo]);

  // Also show finalizados/recebidos for context
  const allComissioned = useMemo(() => {
    return propostas.filter((p) => {
      const inScope = p.coluna_kanban === "credito_liberado" || p.coluna_kanban === "finalizados";
      if (!inScope || !p.data_liberacao) return false;
      const d = new Date(p.data_liberacao + "T12:00:00");
      if (d.getMonth() !== selectedMonth || d.getFullYear() !== selectedYear) return false;
      if (filtroTipo !== "todos" && (p.tipo_pessoa || "PJ") !== filtroTipo) return false;
      return true;
    });
  }, [propostas, selectedMonth, selectedYear, filtroTipo]);

  // Summaries
  const totalPendente = allComissioned
    .filter((p) => p.status_repasse === "pendente")
    .reduce((s, p) => s + (p.valor_solicitado ?? 0) * getComissaoRate(p), 0);

  const totalRecebido = allComissioned
    .filter((p) => p.status_repasse === "recebido")
    .reduce((s, p) => s + (p.valor_solicitado ?? 0) * getComissaoRate(p), 0);

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
    } catch (e) {
      console.error(e);
    }
    setSavingProposta(false);
    setEditingPropostaId(null);
  }, []);

  // Export CSV
  function exportCSV() {
    const headers = ["Empresa/Nome", "Tipo", "Produto", "Valor Crédito", "Taxa", "Comissão", "Status", "Data Liberação"];
    const rows = allComissioned.map((p) => {
      const rate = getComissaoRate(p);
      return [
        p.emp_razao, p.tipo_pessoa || "PJ", p.produto,
        p.valor_solicitado ?? "", formatPercent(rate),
        (p.valor_solicitado ?? 0) * rate, p.status_repasse,
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

  const maskVal = (v: number) => showValues ? formatMoney(v) : "R$ •••••";

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--color-text)]">Comissões</h1>
              <p className="text-xs text-[var(--color-text-muted)]">Gestão de comissões e recebimentos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowValues(!showValues)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[var(--color-surface-subtle)] hover:bg-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-muted)] transition-colors"
            >
              {showValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showValues ? "Ocultar" : "Mostrar"}
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-[var(--color-surface-subtle)] hover:bg-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-muted)] transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={`${selectedYear}-${selectedMonth}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split("-").map(Number);
              setSelectedYear(y);
              setSelectedMonth(m);
            }}
            className="input-base w-auto text-sm py-1.5"
          >
            {years.flatMap((y) =>
              Array.from({ length: 12 }, (_, m) => (
                <option key={`${y}-${m}`} value={`${y}-${m}`}>
                  {MONTHS[m]} {y}
                </option>
              ))
            )}
          </select>

          <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden text-sm font-medium">
            {(["todos", "PJ", "PF"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFiltroTipo(t)}
                className={`px-3 py-1.5 transition-colors ${filtroTipo === t ? "bg-[var(--color-brand-primary)] text-white" : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]"}`}
              >
                {t === "todos" ? "Todos" : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-600">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Pendente</span>
            </div>
            <p className="font-money text-2xl font-bold text-[var(--color-text)]">{maskVal(totalPendente)}</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {allComissioned.filter((p) => p.status_repasse === "pendente").length} proposta(s) · Pagamento em M+1
            </p>
          </div>

          <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Recebido</span>
            </div>
            <p className="font-money text-2xl font-bold text-[var(--color-text)]">{maskVal(totalRecebido)}</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {allComissioned.filter((p) => p.status_repasse === "recebido").length} proposta(s) confirmada(s)
            </p>
          </div>

          <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Volume de Crédito</span>
            </div>
            <p className="font-money text-2xl font-bold text-[var(--color-text)]">{maskVal(totalVolume)}</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {allComissioned.length} proposta(s) na competência
            </p>
          </div>
        </div>

        {/* Tax Configuration */}
        <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
            <Settings2 className="w-4 h-4 text-[var(--color-text-muted)]" />
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Configuração de Taxas Padrão</h2>
            {(savingConfig || loadingConfig) && <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--color-text-muted)] ml-2" />}
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {[
              { key: "bdmg", label: "BDMG Capital de Giro", editable: false },
              { key: "fin_imob", label: "Financiamento Imobiliário", editable: true },
              { key: "home_equity", label: "Home Equity (Garantia de Imóvel)", editable: true },
            ].map(({ key, label, editable }) => (
              <div key={key} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-[var(--color-text)]">{label}</span>
                <div className="flex items-center gap-2">
                  {editingTax === key ? (
                    <>
                      <input
                        type="text"
                        className="input-base w-24 text-sm text-right font-mono"
                        value={editTaxValue}
                        onChange={(e) => setEditTaxValue(e.target.value)}
                        autoFocus
                        placeholder="0,00%"
                      />
                      <button
                        onClick={() => saveTax(key, parsePercent(editTaxValue))}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingTax(null)} className="p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="font-mono text-sm font-semibold text-[var(--color-text)]">
                        {taxConfig ? formatPercent(taxConfig[key as keyof TaxConfig]) : "—"}
                      </span>
                      {editable && (
                        <button
                          onClick={() => {
                            setEditingTax(key);
                            setEditTaxValue(taxConfig ? formatPercent(taxConfig[key as keyof TaxConfig]) : "");
                          }}
                          className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] rounded"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {!editable && (
                        <span className="text-[10px] text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] px-2 py-0.5 rounded">fixo</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Detalhamento — {MONTHS[selectedMonth]} {selectedYear}
            </h2>
            <span className="text-xs text-[var(--color-text-muted)]">{allComissioned.length} registro(s)</span>
          </div>

          {allComissioned.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <DollarSign className="w-10 h-10 text-[var(--color-border)] mb-3" />
              <p className="text-sm text-[var(--color-text-muted)]">Nenhuma comissão encontrada nesta competência</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-left">
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
                    const rate = getComissaoRate(p);
                    const comissao = (p.valor_solicitado ?? 0) * rate;
                    const isPF = p.tipo_pessoa === "PF";
                    const isEditing = editingPropostaId === p.id_proposta;

                    return (
                      <tr key={p.id_proposta} className="hover:bg-[var(--color-surface-subtle)] transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-[var(--color-text)] leading-tight line-clamp-1">{p.emp_razao}</p>
                          <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
                            {isPF ? p.emp_cnpj : formatCNPJ(p.emp_cnpj)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={isPF ? "warning" : "info"} className="text-[10px]">
                            {isPF ? "PF" : "PJ"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-[var(--color-text)]">
                          {isPF ? (p.produto === "Crédito com Garantia de Imóvel" ? "Home Equity" : "Fin. Imob.") : "BDMG CG"}
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
                                />
                                <button
                                  onClick={() => savePropostaRate(p.id_proposta, parsePercent(editPropostaRate))}
                                  disabled={savingProposta}
                                  className="p-0.5 text-green-600 hover:bg-green-50 rounded"
                                >
                                  {savingProposta ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                </button>
                                <button onClick={() => setEditingPropostaId(null)} className="p-0.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] rounded">
                                  <X className="w-3 h-3" />
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="font-mono text-xs font-semibold text-[var(--color-text)]">{formatPercent(rate)}</span>
                                <button
                                  onClick={() => {
                                    setEditingPropostaId(p.id_proposta);
                                    setEditPropostaRate(formatPercent(rate));
                                  }}
                                  className="p-0.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded opacity-0 group-hover:opacity-100"
                                  style={{ opacity: 1 }}
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-money font-semibold text-green-600">
                          {showValues ? formatMoney(comissao) : "•••••"}
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
                  <tr className="border-t-2 border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
                    <td colSpan={3} className="px-4 py-3 text-xs font-semibold text-[var(--color-text)] uppercase">Total</td>
                    <td className="px-4 py-3 text-right font-money font-bold text-[var(--color-text)]">{maskVal(totalVolume)}</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-right font-money font-bold text-green-600">{maskVal(totalPendente + totalRecebido)}</td>
                    <td colSpan={2} className="px-4 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
