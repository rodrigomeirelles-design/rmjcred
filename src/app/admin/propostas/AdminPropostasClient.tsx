"use client";

import { useState, useMemo } from "react";
import { Proposta, KANBAN_COLUMNS, COMISSAO_PERCENTUAL } from "@/types";
import KanbanBoard from "@/components/admin/KanbanBoard";
import { formatMoney } from "@/lib/utils";
import { Search, Download } from "lucide-react";

interface Props {
  initialPropostas: Proposta[];
}

function exportCSV(propostas: Proposta[]) {
  const headers = [
    "ID", "Data", "Empresa", "CNPJ", "Valor Crédito", "Comissão (1,35%)", "Representante",
    "E-mail", "Telefone", "Etapa", "Status Repasse",
    "Data Liberação", "Follow-up", "Motivo Perda",
  ];
  const rows = propostas.map((p) => [
    p.id_proposta, p.timestamp_envio?.split("T")[0] ?? "", p.emp_razao, p.emp_cnpj,
    p.valor_solicitado ?? "", (p.valor_solicitado ?? 0) * COMISSAO_PERCENTUAL || "",
    p.emp_repr_nome, p.emp_email, p.emp_telefone,
    p.coluna_kanban, p.status_repasse,
    p.data_liberacao ?? "", p.followup_data ?? "", p.motivo_perda ?? "",
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `propostas-rmj-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminPropostasClient({ initialPropostas }: Props) {
  const [busca, setBusca] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "PJ" | "PF">("todos");

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const filtered = useMemo(() => {
    return initialPropostas.filter((p) => {
      if (busca) {
        const q = busca.toLowerCase();
        if (!p.emp_razao.toLowerCase().includes(q) && !p.emp_cnpj.includes(busca.replace(/\D/g, ""))) return false;
      }
      if (filtroPeriodo !== "todos" && p.timestamp_envio) {
        const created = new Date(p.timestamp_envio);
        if (filtroPeriodo === "hoje" && created.toDateString() !== today.toDateString()) return false;
        if (filtroPeriodo === "semana" && created < startOfWeek) return false;
        if (filtroPeriodo === "mes" && created < startOfMonth) return false;
      }
      if (filtroStatus !== "todos" && p.coluna_kanban !== filtroStatus) return false;
      if (filtroTipo !== "todos" && (p.tipo_pessoa || "PJ") !== filtroTipo) return false;
      return true;
    });
  }, [initialPropostas, busca, filtroPeriodo, filtroStatus, filtroTipo, today, startOfWeek, startOfMonth]);

  const totalCredito = filtered.reduce((s, p) => s + (p.valor_solicitado || 0), 0);
  const totalPendente = filtered
    .filter((p) => p.status_repasse === "pendente")
    .reduce((s, p) => s + (p.valor_solicitado || 0) * COMISSAO_PERCENTUAL, 0);
  const totalRecebido = filtered
    .filter((p) => p.status_repasse === "recebido")
    .reduce((s, p) => s + (p.valor_solicitado || 0) * COMISSAO_PERCENTUAL, 0);

  async function handleUpdate(id: string, fields: Partial<Proposta>) {
    await fetch(`/api/propostas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 flex-1 min-w-48">
            <Search className="w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Pesquisar por empresa ou CNPJ..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="bg-transparent text-sm outline-none w-full text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
            />
          </div>

          <select
            value={filtroPeriodo}
            onChange={(e) => setFiltroPeriodo(e.target.value)}
            className="input-base w-auto text-sm py-1.5"
          >
            <option value="todos">Todos os períodos</option>
            <option value="hoje">Hoje</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mês</option>
          </select>

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="input-base w-auto text-sm py-1.5"
          >
            <option value="todos">Todos os status</option>
            {KANBAN_COLUMNS.map((col) => (
              <option key={col.id} value={col.id}>{col.label}</option>
            ))}
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

          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>

        <div className="flex gap-4 mt-3 text-xs flex-wrap">
          <span className="text-[var(--color-text-muted)]">
            <strong className="text-[var(--color-text)]">{filtered.length}</strong>{" "}
            proposta{filtered.length !== 1 ? "s" : ""}
          </span>
          {totalCredito > 0 && (
            <span className="text-[var(--color-text-muted)]">
              Volume de crédito:{" "}
              <strong className="font-money text-green-600">{formatMoney(totalCredito)}</strong>
            </span>
          )}
          {totalPendente > 0 && (
            <span className="text-[var(--color-text-muted)]">
              Comissão pendente:{" "}
              <strong className="font-money text-amber-600">{formatMoney(totalPendente)}</strong>
            </span>
          )}
          {totalRecebido > 0 && (
            <span className="text-[var(--color-text-muted)]">
              Comissão recebida:{" "}
              <strong className="font-money text-green-600">{formatMoney(totalRecebido)}</strong>
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanBoard propostas={filtered} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}
