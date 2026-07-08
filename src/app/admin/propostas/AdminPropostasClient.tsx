"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Proposta, KANBAN_COLUMNS, getComissaoRate } from "@/types";
import KanbanBoard from "@/components/admin/KanbanBoard";
import NovoLeadModal from "@/components/admin/NovoLeadModal";
import { formatMoney } from "@/lib/utils";
import { Search, Download, Plus, Eye, EyeOff } from "lucide-react";

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
    p.valor_solicitado ?? "", (p.valor_solicitado ?? 0) * getComissaoRate(p) || "",
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
  const router = useRouter();
  const [propostas, setPropostas] = useState<Proposta[]>(initialPropostas);
  
  useEffect(() => {
    let propostasParaAjuste = [...initialPropostas];
    const now = new Date();

    initialPropostas.forEach((p) => {
      if (p.coluna_kanban === "credito_liberado" && p.data_liberacao) {
        const libDate = new Date(p.data_liberacao + "T12:00:00");
        const archiveDate = new Date(libDate.getFullYear(), libDate.getMonth() + 1, 20, 0, 0, 0);
        
        if (now >= archiveDate) {
          propostasParaAjuste = propostasParaAjuste.map(x => 
            x.id_proposta === p.id_proposta ? { ...x, coluna_kanban: "finalizados" } : x
          );
          
          fetch(`/api/propostas/${p.id_proposta}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ coluna_kanban: "finalizados" }),
          }).catch(console.error);
        }
      }
    });

    setPropostas(propostasParaAjuste);
  }, [initialPropostas]);

  const [busca, setBusca] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "PJ" | "PF">("todos");
  const [showNovoLead, setShowNovoLead] = useState(false);
  const [showComissoes, setShowComissoes] = useState(false);

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const filtered = useMemo(() => {
    return propostas.filter((p) => {
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
  }, [propostas, busca, filtroPeriodo, filtroStatus, filtroTipo, today, startOfWeek, startOfMonth]);

  // Comissão pendente = only proposals in credito_liberado with data_liberacao in current month
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const totalPendente = filtered
    .filter((p) => p.coluna_kanban === "credito_liberado" && p.data_liberacao)
    .filter((p) => {
      const d = new Date(p.data_liberacao! + "T12:00:00");
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((s, p) => s + (p.valor_solicitado || 0) * getComissaoRate(p), 0);
  const totalRecebido = filtered
    .filter((p) => p.status_repasse === "recebido")
    .reduce((s, p) => s + (p.valor_solicitado || 0) * getComissaoRate(p), 0);

  async function handleUpdate(id: string, fields: Partial<Proposta>) {
    setPropostas((prev) => prev.map((p) => (p.id_proposta === id ? { ...p, ...fields } : p)));
    await fetch(`/api/propostas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
  }

  async function fetchPropostas() {
    try {
      const res = await fetch("/api/propostas");
      if (res.ok) {
        const data = await res.json();
        setPropostas(data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-3 sm:px-4 py-3 flex-shrink-0">
        {/* Row 1: Search + action buttons */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-xl px-3 py-2 flex-1 min-w-0">
            <Search className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="bg-transparent text-sm outline-none w-full text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => exportCSV(filtered)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:block">Exportar</span>
            </button>

            <button
              onClick={() => setShowNovoLead(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[var(--color-brand-primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-brand-primary-dark)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:block">Novo Lead</span>
            </button>
          </div>
        </div>

        {/* Row 2: Filters */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">

          <select
            value={filtroPeriodo}
            onChange={(e) => setFiltroPeriodo(e.target.value)}
            className="input-base w-auto text-xs py-1.5 min-w-0"
          >
            <option value="todos">Todos os períodos</option>
            <option value="hoje">Hoje</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mês</option>
          </select>

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="input-base w-auto text-xs py-1.5 min-w-0"
          >
            <option value="todos">Todos os status</option>
            {KANBAN_COLUMNS.map((col) => (
              <option key={col.id} value={col.id}>{col.label}</option>
            ))}
          </select>

          <div className="flex rounded-xl border border-[var(--color-border)] overflow-hidden text-xs font-medium">
            {(["todos", "PJ", "PF"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFiltroTipo(t)}
                className={`px-2.5 py-1.5 transition-colors ${filtroTipo === t ? "bg-[var(--color-brand-primary)] text-white" : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]"}`}
              >
                {t === "todos" ? "Todos" : t}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Stats */}
        <div className="flex gap-3 mt-2 text-xs flex-wrap items-center">
          <span className="text-[var(--color-text-muted)]">
            <strong className="text-[var(--color-text)]">{filtered.length}</strong>{" "}
            proposta{filtered.length !== 1 ? "s" : ""}
          </span>
          {totalPendente > 0 && (
            <span className="text-[var(--color-text-muted)]">
              Comissão pendente (M+1):{" "}
              <strong className="font-money text-amber-600">
                {showComissoes ? formatMoney(totalPendente) : "R$ •••••"}
              </strong>
            </span>
          )}
          {totalRecebido > 0 && (
            <span className="text-[var(--color-text-muted)]">
              Comissão recebida:{" "}
              <strong className="font-money text-green-600">
                {showComissoes ? formatMoney(totalRecebido) : "R$ •••••"}
              </strong>
            </span>
          )}
          <button 
            onClick={() => setShowComissoes(!showComissoes)} 
            className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-[var(--color-surface-subtle)] hover:bg-[var(--color-border)] rounded-md text-[var(--color-text-muted)] transition-colors"
          >
            {showComissoes ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showComissoes ? "Ocultar Valores" : "Mostrar Valores"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanBoard propostas={filtered} onUpdate={handleUpdate} showComissoes={showComissoes} filtroStatus={filtroStatus} />
      </div>

      {showNovoLead && (
        <NovoLeadModal
          onClose={() => setShowNovoLead(false)}
          onSuccess={() => {
            setShowNovoLead(false);
            fetchPropostas();
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
