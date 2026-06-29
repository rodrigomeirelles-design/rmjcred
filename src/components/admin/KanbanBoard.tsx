"use client";

import { useState, useCallback, useEffect } from "react";
import {
  DndContext, DragEndEvent, DragStartEvent,
  PointerSensor, useSensor, useSensors, DragOverlay, useDroppable,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Proposta, type KanbanColumn, KANBAN_COLUMNS, getComissaoRate } from "@/types";
import { PropostaImovel } from "@/types/imovel";
import { formatMoney, formatDate, formatCNPJ, addDays, maskMoney, parseMoney } from "@/lib/utils";
import { buildPJSections, buildPFSections, buildVeiculoSections } from "@/lib/detailSchemas";
import DetailPanel from "@/components/admin/DetailPanel";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  Calendar, Clock, CheckCircle2,
  FileText, X, Loader2, Pencil, Eye, ExternalLink, Plus
} from "lucide-react";

interface KanbanBoardProps {
  propostas: Proposta[];
  showComissoes?: boolean;
  filtroStatus?: string;
  onUpdate: (id: string, fields: Partial<Proposta>) => Promise<void>;
}

// ─── Helpers ────────────────────────────────────────────────────────────────────────

function calcComissao(p: Proposta) {
  return (p.valor_solicitado ?? 0) * getComissaoRate(p);
}

function proxMes(dataISO: string): string {
  const d = new Date(dataISO + "T12:00:00");
  return new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString().split("T")[0];
}

/** Check if a date string (YYYY-MM-DD) is in a previous month relative to today */
function isFromPreviousMonth(dateStr: string): boolean {
  const d = new Date(dateStr + "T12:00:00");
  const now = new Date();
  return d.getFullYear() < now.getFullYear() || 
    (d.getFullYear() === now.getFullYear() && d.getMonth() < now.getMonth());
}

// ─── Helpers de produto ─────────────────────────────────────────────────────

function getProdutoBadge(proposta: Proposta): { label: string; variant: "info" | "warning" | "success" | "danger" | "default" } {
  const p = proposta.produto || "";
  if (p.includes("BDMG") || p.includes("Capital de Giro"))
    return { label: "BDMG CG",         variant: "info" };
  if (p.includes("Home Equity") || (p.includes("Garantia") && p.includes("Imóvel")))
    return { label: "Home Equity",      variant: "warning" };
  if (p.includes("Imobiliário") || p.includes("Financiamento Imobili"))
    return { label: "Fin. Imobiliário", variant: "warning" };
  if (p.includes("Garantia de Veículo") || p.includes("Garantia de Veículos"))
    return { label: "Gar. Veículo",     variant: "success" };
  if (p.includes("Veículo") || p.includes("Veículos"))
    return { label: "Fin. Veículos",    variant: "success" };
  if (p.includes("Consórcio"))
    return { label: "Consórcio",        variant: "default" };
  return { label: p.slice(0, 14) || "Lead", variant: "default" };
}

function getLabelCreditoCard(proposta: Proposta): string {
  const p = proposta.produto || "";
  if (p.includes("Veículo")) return "Veículo";
  if (p.includes("Consórcio")) return "Consórcio";
  if (p.includes("Imobiliário") || p.includes("Home Equity") || p.includes("Imóvel")) return "Financiamento";
  return "Crédito";
}

// ─── Card visual ────────────────────────────────────────────────────────────

function PropostaCard({ proposta, isDragging }: { proposta: Proposta; isDragging?: boolean }) {
  const isPF = proposta.tipo_pessoa === "PF";
  const hasFollowup = !!proposta.followup_data;
  const { label: produtoBadgeLabel, variant: produtoBadgeVariant } = getProdutoBadge(proposta);

  return (
    <div className={`bg-white border border-[var(--color-border)] rounded-xl p-3.5 space-y-2.5 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${isDragging ? "opacity-50" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-xs sm:text-sm text-[var(--color-text)] line-clamp-2 leading-tight">
            {proposta.emp_razao || (isPF ? proposta.emp_cnpj : formatCNPJ(proposta.emp_cnpj))}
          </p>
          <p className="text-[10px] sm:text-xs text-[var(--color-text-muted)] font-mono mt-0.5">
            {isPF ? proposta.emp_cnpj : formatCNPJ(proposta.emp_cnpj)}
          </p>
        </div>
        <Badge variant={produtoBadgeVariant} className="flex-shrink-0 text-[10px]">
          {produtoBadgeLabel}
        </Badge>
      </div>

      {proposta.valor_solicitado != null && (
        <div className="flex items-center justify-between text-xs bg-[var(--color-surface-subtle)] rounded-lg px-2.5 py-1.5">
          <span className="text-[var(--color-text-muted)]">{getLabelCreditoCard(proposta)}</span>
          <span className="font-money font-semibold text-[var(--color-text)]">{formatMoney(proposta.valor_solicitado)}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 flex-wrap">
        {proposta.coluna_kanban === "finalizados" && (
          <Badge variant="success" className="text-[10px]">
            <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Convertido
          </Badge>
        )}
        {!isPF && proposta.status_repasse === "recebido" && (
          <Badge variant="success" className="text-[10px]">
            <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Comissão recebida
          </Badge>
        )}
        {isPF && <Badge variant="default" className="text-[10px]">Pessoa Física</Badge>}
      </div>

      {hasFollowup && (
        <div className="flex items-center gap-1.5 bg-amber-50 rounded-lg px-2 py-1">
          <Clock className="w-3 h-3 text-amber-500 flex-shrink-0" />
          <span className="text-[10px] font-medium text-amber-700">
            Follow-up: {formatDate(proposta.followup_data!)}
          </span>
        </div>
      )}

      {proposta.coluna_kanban === "credito_liberado" && proposta.data_liberacao && (
        <div className="flex items-center gap-1.5 bg-green-50 rounded-lg px-2 py-1">
          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
          <span className="text-[10px] font-medium text-green-700">
            Liberado: {formatDate(proposta.data_liberacao)}
          </span>
        </div>
      )}

      <div className="flex items-center justify-end pt-1 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
          <Calendar className="w-3 h-3" />
          {formatDate(proposta.timestamp_envio?.split("T")[0] || "")}
        </div>
      </div>
    </div>
  );
}

function SortableCard({ proposta, onCardClick }: { proposta: Proposta; onCardClick: (p: Proposta) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: proposta.id_proposta,
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      onClick={() => onCardClick(proposta)}
    >
      <PropostaCard proposta={proposta} isDragging={isDragging} />
    </div>
  );
}

// ─── Kanban Column ───────────────────────────────────────────────────────────

function KanbanColumnView({
  column, propostas, onCardClick, showComissoes
}: {
  column: typeof KANBAN_COLUMNS[number];
  propostas: Proposta[];
  onCardClick: (p: Proposta) => void;
  showComissoes?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const totalVolume = propostas.reduce((sum, p) => sum + (p.valor_solicitado ?? 0), 0);
  const totalComissao = propostas.reduce((sum, p) => sum + calcComissao(p), 0);
  const faseColors: Record<number, string> = {
    0: "bg-slate-100 text-slate-600",
    1: "bg-blue-100 text-blue-700",
    2: "bg-amber-100 text-amber-700",
    3: "bg-purple-100 text-purple-700",
    4: "bg-green-100 text-green-700",
    5: "bg-emerald-100 text-emerald-700",
    6: "bg-red-100 text-red-700",
    7: "bg-zinc-100 text-zinc-500",
  };

  return (
    <div className="flex-shrink-0 w-64 flex flex-col bg-[var(--color-surface-subtle)] rounded-xl border border-[var(--color-border)]">
      <div className="px-3 pt-3 pb-2 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-[var(--color-text)] leading-tight">{column.label}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${faseColors[column.fase]}`}>
            {propostas.length}
          </span>
        </div>
        {totalVolume > 0 && (
          <p className="font-money text-[11px] text-[var(--color-text-muted)] font-medium">
            {showComissoes ? formatMoney(totalVolume) : "R$ •••••"}
          </p>
        )}
        {totalComissao > 0 && (
          <p className="font-money text-[10px] text-green-600 font-medium">
            {showComissoes ? `Com. ${formatMoney(totalComissao)}` : "Com. R$ •••••"}
          </p>
        )}
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px] rounded-b-xl transition-colors ${isOver ? "bg-blue-50" : ""}`}
      >
        <SortableContext items={propostas.map((p) => p.id_proposta)} strategy={verticalListSortingStrategy}>
          {propostas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-10 h-10 bg-[var(--color-border)] rounded-full flex items-center justify-center mb-2">
                <FileText className="w-5 h-5 text-[var(--color-text-muted)]" />
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">Nenhuma proposta</p>
            </div>
          ) : (
            propostas.map((p) => <SortableCard key={p.id_proposta} proposta={p} onCardClick={onCardClick} />)
          )}
        </SortableContext>
      </div>
    </div>
  );
}

// ─── Modal Não Aprovado ──────────────────────────────────────────────────────

function NaoAprovadoModal({ proposta, onConfirm, onClose }: {
  proposta: Proposta;
  onConfirm: (motivo: string, data: string) => void;
  onClose: () => void;
}) {
  const [motivo, setMotivo] = useState("");
  const [data, setData] = useState("");
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-[var(--color-text)]">Registrar recusa — {proposta.emp_razao}</h2>
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
              Follow-up automático em: <strong>{formatDate(addDays(data, 30))}</strong> (+30 dias)
            </p>
          )}
        </div>
        <div className="flex gap-3 p-5 border-t">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button variant="danger" onClick={() => onConfirm(motivo, data)} disabled={!motivo.trim() || !data} className="flex-1">
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Crédito Liberado ──────────────────────────────────────────────────

function CreditoLiberadoModal({ proposta, onConfirm, onClose }: {
  proposta: Proposta;
  onConfirm: (dataLiberacao: string) => void;
  onClose: () => void;
}) {
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const comissao = calcComissao(proposta);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-[var(--color-text)]">Crédito Liberado — {proposta.emp_razao}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--color-surface-subtle)] rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="label-base mb-1">Data de liberação do crédito <span className="text-red-500">*</span></label>
            <input type="date" className="input-base" value={data} onChange={(e) => setData(e.target.value)} />
          </div>
          {data && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 space-y-2">
              <p className="text-xs font-semibold text-green-800 uppercase tracking-wide">Resumo do comissionamento</p>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Valor do crédito</span>
                <span className="font-money font-semibold text-green-800">{formatMoney(proposta.valor_solicitado ?? 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Comissão (1,35%)</span>
                <span className="font-money font-semibold text-green-800">{formatMoney(comissao)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-green-200 pt-2">
                <span className="text-green-700 font-medium">Processamento (M+1)</span>
                <span className="font-money font-semibold text-green-800">{formatDate(proxMes(data))}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 p-5 border-t">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button onClick={() => onConfirm(data)} disabled={!data} className="flex-1">
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Consulta completa da proposta ──────────────────────────────────────────

function PropostaFullView({ proposta, onClose }: { proposta: Proposta; onClose: () => void }) {
  const isBDMG = proposta.produto?.includes("BDMG") || proposta.produto?.includes("Capital de Giro");
  const isVeiculo = proposta.produto?.includes("Veículo") || proposta.produto?.includes("Veículos");
  const isImovel = proposta.produto?.includes("Imobiliário") || proposta.produto?.includes("Home Equity") || proposta.produto?.includes("Imóvel");
  const isPF = isVeiculo || isImovel || (!isBDMG && proposta.tipo_pessoa === "PF");

  const [pfData, setPfData] = useState<any>(null);
  const [loadingPF, setLoadingPF] = useState(isPF);

  useEffect(() => {
    if (!isPF) return;
    const endpoint = isVeiculo 
      ? `/api/propostas-veiculo/${proposta.id_proposta}` 
      : `/api/propostas-imovel/${proposta.id_proposta}`;
    fetch(endpoint)
      .then((r) => r.json())
      .then((data) => { setPfData(data); setLoadingPF(false); })
      .catch(() => setLoadingPF(false));
  }, [isPF, isVeiculo, proposta.id_proposta]);

  if (isPF) {
    const { label: prodLabel, variant: prodVariant } = getProdutoBadge(proposta);
    if (loadingPF) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      );
    }
    const etapaLabel = KANBAN_COLUMNS.find((c) => c.id === proposta.coluna_kanban)?.label;

    const sections = pfData
      ? (isVeiculo 
          ? buildVeiculoSections({ ...pfData, etapa_label: etapaLabel }) 
          : buildPFSections({ ...pfData, etapa_label: etapaLabel }))
      : [
          {
            title: "Dados do Lead",
            rows: [
              { label: "Nome", value: proposta.emp_razao },
              { label: "Contato", value: proposta.emp_cnpj },
              { label: "E-mail", value: proposta.emp_email },
              { label: "Telefone", value: proposta.emp_telefone },
              { label: "Produto", value: proposta.produto },
              { label: "Etapa", value: etapaLabel },
              ...(proposta.obs_finais ? [{ label: "Observações", value: proposta.obs_finais }] : []),
            ],
          },
        ];

    return (
      <DetailPanel
        title={proposta.emp_razao}
        subtitle={proposta.emp_cnpj}
        badge={<Badge variant={prodVariant} className="text-[10px]">{prodLabel}</Badge>}
        sections={sections}
        onClose={onClose}
      />
    );
  }

  const { label: prodLabel, variant: prodVariant } = getProdutoBadge(proposta);
  return (
    <DetailPanel
      title={proposta.emp_razao || formatCNPJ(proposta.emp_cnpj)}
      subtitle={formatCNPJ(proposta.emp_cnpj)}
      badge={<Badge variant={prodVariant} className="text-[10px]">{prodLabel}</Badge>}
      sections={buildPJSections(proposta)}
      onClose={onClose}
    />
  );
}

// ─── Drawer resumido do card ─────────────────────────────────────────────────

function PropostaDetailDrawer({ proposta, onClose, onUpdate, onConsultar, onMove }: {
  proposta: Proposta;
  onClose: () => void;
  onUpdate: (id: string, fields: Partial<Proposta>) => Promise<void>;
  onConsultar: () => void;
  onMove: (id: string, to: KanbanColumn) => void;
}) {
  const isPF = proposta.tipo_pessoa === "PF";
  const [saving, setSaving] = useState(false);
  const [editingCredito, setEditingCredito] = useState(false);
  const [creditoInput, setCreditoInput] = useState(
    proposta.valor_solicitado ? maskMoney(String(Math.round(proposta.valor_solicitado * 100))) : ""
  );
  const [editingComissao, setEditingComissao] = useState(false);
  const [comissaoInput, setComissaoInput] = useState(
    proposta.comissao_percentual != null && proposta.comissao_percentual > 0 
      ? String(proposta.comissao_percentual * 100).replace(".", ",") 
      : ""
  );
  const [editingObs, setEditingObs] = useState(false);
  const [novoObs, setNovoObs] = useState("");
  const [produto, setProduto] = useState(proposta.produto || "");

  const PRODUTOS = [
    "BDMG Capital de Giro",
    "Financiamento Imobiliário",
    "Home Equity (Crédito com Garantia de Imóvel)",
    "Financiamento de Veículos",
    "Crédito com Garantia de Veículo",
    "Consórcio",
    "Outros Serviços",
  ];

  async function saveProduto(novoProduto: string) {
    setProduto(novoProduto);
    setSaving(true);
    await onUpdate(proposta.id_proposta, { produto: novoProduto });
    setSaving(false);
  }

  async function saveCredito() {
    const valor = parseMoney(creditoInput);
    setSaving(true);
    await onUpdate(proposta.id_proposta, { valor_solicitado: valor || undefined });
    setSaving(false);
    setEditingCredito(false);
  }

  async function saveComissao() {
    const valStr = comissaoInput.replace(",", ".");
    const valor = parseFloat(valStr);
    setSaving(true);
    await onUpdate(proposta.id_proposta, { comissao_percentual: isNaN(valor) ? undefined : valor / 100 });
    setSaving(false);
    setEditingComissao(false);
  }

  async function saveObs() {
    if (!novoObs.trim()) {
      setEditingObs(false);
      return;
    }
    setSaving(true);
    const now = new Date();
    const ts = `[${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}]`;
    const finalStr = `${ts} ${novoObs.trim()}\n\n${proposta.obs_finais || ""}`.trim();
    
    await onUpdate(proposta.id_proposta, { obs_finais: finalStr });
    setSaving(false);
    setEditingObs(false);
    setNovoObs("");
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full overflow-y-auto shadow-xl flex flex-col">
        <div className="sticky top-0 bg-white border-b flex items-center justify-between px-5 py-4 z-10">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[var(--color-text)] truncate">{proposta.emp_razao || formatCNPJ(proposta.emp_cnpj)}</p>
            <p className="text-xs text-[var(--color-text-muted)] font-mono">
              {isPF ? proposta.emp_cnpj : formatCNPJ(proposta.emp_cnpj)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin text-[var(--color-text-muted)]" />}
            <button onClick={onClose} className="p-1.5 hover:bg-[var(--color-surface-subtle)] rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-5 space-y-4">
          {/* Consultar */}
          <button
            onClick={onConsultar}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-[var(--color-brand-primary)] text-white rounded-xl font-medium text-sm hover:bg-[var(--color-brand-primary-dark)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Consultar Proposta Completa
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>

          {/* Produto / Serviço */}
          <section className="border border-[var(--color-border)] rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Produto / Serviço</h3>
            <select
              value={produto}
              onChange={(e) => saveProduto(e.target.value)}
              disabled={saving}
              className="input-base w-full text-sm"
            >
              {PRODUTOS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </section>

          {/* Etapa no Kanban */}
          <section className="border border-[var(--color-border)] rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Etapa no Kanban</h3>
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
          </section>

          {/* Valor do crédito */}
          <section className="border border-[var(--color-border)] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Valor do Crédito</h3>
              {!editingCredito && (
                <button
                  onClick={() => setEditingCredito(true)}
                  className="p-1 hover:bg-[var(--color-surface-subtle)] rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {editingCredito ? (
              <div className="space-y-2">
                <input
                  type="text"
                  className="input-base font-money text-lg font-semibold"
                  placeholder="R$ 0,00"
                  value={creditoInput}
                  onChange={(e) => setCreditoInput(maskMoney(e.target.value))}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={() => setEditingCredito(false)} className="flex-1 py-1.5 text-xs border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-subtle)]">
                    Cancelar
                  </button>
                  <button onClick={saveCredito} className="flex-1 py-1.5 text-xs bg-[var(--color-brand-primary)] text-white rounded-lg hover:bg-[var(--color-brand-primary-dark)]">
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <p className={`font-money text-2xl font-bold ${proposta.valor_solicitado ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"}`}>
                {proposta.valor_solicitado ? formatMoney(proposta.valor_solicitado) : "—"}
              </p>
            )}
          </section>

          {/* Comissão Percentual */}
          <section className="border border-[var(--color-border)] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Taxa de Comissão (%)</h3>
              {!editingComissao && (
                <button
                  onClick={() => setEditingComissao(true)}
                  className="p-1 hover:bg-[var(--color-surface-subtle)] rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {editingComissao ? (
              <div className="space-y-2">
                <input
                  type="text"
                  className="input-base text-lg font-semibold"
                  placeholder="Ex: 1,5"
                  value={comissaoInput}
                  onChange={(e) => setComissaoInput(e.target.value.replace(/[^0-9,.]/g, ""))}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={() => setEditingComissao(false)} className="flex-1 py-1.5 text-xs border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-subtle)]">
                    Cancelar
                  </button>
                  <button onClick={saveComissao} className="flex-1 py-1.5 text-xs bg-[var(--color-brand-primary)] text-white rounded-lg hover:bg-[var(--color-brand-primary-dark)]">
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-lg font-semibold text-[var(--color-text)]">
                {proposta.comissao_percentual != null && proposta.comissao_percentual > 0 
                  ? `${(proposta.comissao_percentual * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`
                  : <span className="text-[var(--color-text-muted)] italic text-sm">Automático ({getComissaoRate(proposta) > 0 ? (getComissaoRate(proposta) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + "%" : "Não definida"})</span>
                }
              </p>
            )}
          </section>

          {/* Follow-up */}
          {proposta.followup_data && (
            <section className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-amber-800">Follow-up agendado</h3>
              </div>
              <p className="text-sm text-amber-700">
                Retomar contato em <strong>{formatDate(proposta.followup_data)}</strong>
              </p>
              {proposta.motivo_perda && (
                <p className="text-xs text-amber-600 mt-1">Motivo: {proposta.motivo_perda}</p>
              )}
            </section>
          )}

          {/* Observações */}
          <section className="border border-[var(--color-border)] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Observações</h3>
              {!editingObs && (
                <button
                  onClick={() => { setNovoObs(""); setEditingObs(true); }}
                  className="p-1 hover:bg-[var(--color-surface-subtle)] rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center gap-1 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar
                </button>
              )}
            </div>
            {editingObs && (
              <div className="space-y-2 mb-3">
                <textarea
                  className="input-base min-h-[80px] resize-none text-sm w-full"
                  placeholder="Escreva uma nova observação..."
                  value={novoObs}
                  onChange={(e) => setNovoObs(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={() => setEditingObs(false)} className="flex-1 py-1.5 text-xs border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-subtle)]">
                    Cancelar
                  </button>
                  <button onClick={saveObs} disabled={saving} className="flex-1 py-1.5 text-xs bg-[var(--color-brand-primary)] text-white rounded-lg hover:bg-[var(--color-brand-primary-dark)]">
                    {saving ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            )}
            <div className="text-sm text-[var(--color-text)] leading-relaxed whitespace-pre-wrap">
              {proposta.obs_finais
                ? proposta.obs_finais
                : <span className="text-[var(--color-text-muted)] italic">Nenhuma observação</span>}
            </div>
          </section>

          {/* Sócios */}
          {proposta.socios?.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">Sócios</h3>
              <div className="space-y-2">
                {proposta.socios.map((s, i) => (
                  <div key={i} className="bg-[var(--color-surface-subtle)] rounded-lg p-3 text-sm">
                    <p className="font-medium text-[var(--color-text)]">{s.nome}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.participacao}% — {s.estado_civil}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{s.email} · {s.telefone}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Board principal ─────────────────────────────────────────────────────────

export default function KanbanBoard({ propostas: initialPropostas, showComissoes, filtroStatus, onUpdate }: KanbanBoardProps) {
  const [propostas, setPropostas] = useState(initialPropostas);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pendingNaoAprovado, setPendingNaoAprovado] = useState<{ id: string } | null>(null);
  const [pendingLiberado, setPendingLiberado] = useState<{ id: string } | null>(null);
  const [selectedProposta, setSelectedProposta] = useState<Proposta | null>(null);
  const [consultandoProposta, setConsultandoProposta] = useState<Proposta | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  // Auto-move: Crédito Liberado → Finalizados (M+1) and auto-recebido (day 25)
  useEffect(() => {
    const now = new Date();
    const today = now.getDate();

    setPropostas((prev) => {
      const updates: { id: string; fields: Partial<Proposta> }[] = [];
      const next = prev.map((p) => {
        // Auto-move to Finalizados if data_liberacao is from a previous month
        if (p.coluna_kanban === "credito_liberado" && p.data_liberacao && isFromPreviousMonth(p.data_liberacao)) {
          const fields: Partial<Proposta> = { coluna_kanban: "finalizados" };
          updates.push({ id: p.id_proposta, fields });
          return { ...p, ...fields };
        }
        // Auto-mark as recebido on day >= 25 for proposals in Finalizados
        if (p.coluna_kanban === "finalizados" && p.status_repasse === "pendente" && p.data_liberacao && isFromPreviousMonth(p.data_liberacao) && today >= 25) {
          const fields: Partial<Proposta> = { status_repasse: "recebido" };
          updates.push({ id: p.id_proposta, fields });
          return { ...p, ...fields };
        }
        return p;
      });

      // Persist changes in background
      if (updates.length > 0) {
        Promise.all(updates.map((u) => onUpdate(u.id, u.fields))).catch(console.error);
      }

      return updates.length > 0 ? next : prev;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const propostasByColumn = useCallback(
    (col: KanbanColumn) => propostas.filter((p) => p.coluna_kanban === col),
    [propostas]
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const proposta = propostas.find((p) => p.id_proposta === activeId);
    if (!proposta) return;

    let targetColumn: KanbanColumn | null = null;
    for (const col of KANBAN_COLUMNS) {
      if (col.id === overId || propostasByColumn(col.id).some((p) => p.id_proposta === overId)) {
        targetColumn = col.id;
        break;
      }
    }

    if (!targetColumn || targetColumn === proposta.coluna_kanban) return;

    if (targetColumn === "nao_aprovado") {
      setPendingNaoAprovado({ id: activeId });
      return;
    }

    if (targetColumn === "credito_liberado") {
      setPendingLiberado({ id: activeId });
      return;
    }

    moveCard(activeId, targetColumn);
  }

  async function moveCard(id: string, to: KanbanColumn, extra?: Partial<Proposta>) {
    setUpdating(id);
    setPropostas((prev) => prev.map((p) => p.id_proposta === id ? { ...p, coluna_kanban: to, ...extra } : p));
    await onUpdate(id, { coluna_kanban: to, ...extra });
    setUpdating(null);
  }

  async function confirmNaoAprovado(motivo: string, data: string) {
    if (!pendingNaoAprovado) return;
    const followup = addDays(data, 30);
    await moveCard(pendingNaoAprovado.id, "nao_aprovado", { motivo_perda: motivo, data_recusa: data, followup_data: followup });
    setPendingNaoAprovado(null);
  }

  async function confirmLiberado(dataLiberacao: string) {
    if (!pendingLiberado) return;
    await moveCard(pendingLiberado.id, "credito_liberado", { data_liberacao: dataLiberacao });
    setPendingLiberado(null);
  }

  const activeCard = propostas.find((p) => p.id_proposta === activeId);
  const selectedCurrent = selectedProposta
    ? (propostas.find((p) => p.id_proposta === selectedProposta.id_proposta) ?? selectedProposta)
    : null;

  const columnsToRender = filtroStatus && filtroStatus !== "todos" 
    ? KANBAN_COLUMNS.filter(c => c.id === filtroStatus)
    : KANBAN_COLUMNS;

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="h-full flex overflow-x-auto p-4 gap-4 bg-[var(--color-surface)]">
          {columnsToRender.map((col) => (
            <KanbanColumnView
              key={col.id}
              column={col}
              propostas={propostasByColumn(col.id)}
              showComissoes={showComissoes}
              onCardClick={setSelectedProposta}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCard && <PropostaCard proposta={activeCard} isDragging />}
        </DragOverlay>
      </DndContext>

      {pendingNaoAprovado && (() => {
        const p = propostas.find((x) => x.id_proposta === pendingNaoAprovado.id);
        return p ? (
          <NaoAprovadoModal
            proposta={p}
            onConfirm={confirmNaoAprovado}
            onClose={() => setPendingNaoAprovado(null)}
          />
        ) : null;
      })()}

      {pendingLiberado && (() => {
        const p = propostas.find((x) => x.id_proposta === pendingLiberado.id);
        return p ? (
          <CreditoLiberadoModal
            proposta={p}
            onConfirm={confirmLiberado}
            onClose={() => setPendingLiberado(null)}
          />
        ) : null;
      })()}

      {selectedCurrent && (
        <PropostaDetailDrawer
          proposta={selectedCurrent}
          onClose={() => setSelectedProposta(null)}
          onConsultar={() => {
            setConsultandoProposta(selectedCurrent);
            setSelectedProposta(null);
          }}
          onUpdate={async (id, fields) => {
            await onUpdate(id, fields);
            setPropostas((prev) => prev.map((p) => p.id_proposta === id ? { ...p, ...fields } : p));
          }}
          onMove={(id, to) => {
            if (to === "nao_aprovado") {
              setPendingNaoAprovado({ id });
              setSelectedProposta(null);
              return;
            }
            if (to === "credito_liberado") {
              setPendingLiberado({ id });
              setSelectedProposta(null);
              return;
            }
            moveCard(id, to);
          }}
        />
      )}

      {consultandoProposta && (
        <PropostaFullView
          proposta={propostas.find((p) => p.id_proposta === consultandoProposta.id_proposta) ?? consultandoProposta}
          onClose={() => setConsultandoProposta(null)}
        />
      )}
    </>
  );
}
