"use client";

import { useState, useCallback } from "react";
import {
  DndContext, DragEndEvent, DragOverEvent, DragStartEvent,
  PointerSensor, useSensor, useSensors, DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Proposta, type KanbanColumn, KANBAN_COLUMNS, DEFAULT_GARANTIAS, GarantiaItem } from "@/types";
import { formatMoney, formatDate, formatCNPJ, addDays } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  Building2, Calendar, CircleDollarSign, AlertTriangle, Clock, CheckCircle2,
  FileText, ChevronRight, X, Loader2,
} from "lucide-react";

interface KanbanBoardProps {
  propostas: Proposta[];
  onUpdate: (id: string, fields: Partial<Proposta>) => Promise<void>;
}

function PropostaCard({ proposta, isDragging }: { proposta: Proposta; isDragging?: boolean }) {
  const garantiasPendentes = proposta.checklist_garantias?.filter((g) => !g.validado).length ?? 5;
  const hasFollowup = !!proposta.followup_data;

  return (
    <div className={`bg-white border border-[var(--color-border)] rounded-xl p-3.5 space-y-2.5 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${isDragging ? "opacity-50" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[var(--color-text)] truncate">{proposta.emp_razao}</p>
          <p className="text-xs text-[var(--color-text-muted)] font-mono">{formatCNPJ(proposta.emp_cnpj)}</p>
        </div>
        <Badge variant="info" className="flex-shrink-0 text-[10px]">BDMG CG</Badge>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {proposta.status_repasse === "recebido" ? (
          <Badge variant="success" className="text-[10px]">
            <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Comissão recebida
          </Badge>
        ) : (
          <Badge variant="default" className="text-[10px]">
            Comissão pendente
          </Badge>
        )}
        {garantiasPendentes > 0 && proposta.coluna_kanban !== "nao_aprovada" && (
          <Badge variant="danger" className="text-[10px]">
            <AlertTriangle className="w-2.5 h-2.5 mr-0.5" /> {garantiasPendentes} garantia{garantiasPendentes > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {hasFollowup && (
        <div className="flex items-center gap-1.5 bg-amber-50 rounded-lg px-2 py-1">
          <Clock className="w-3 h-3 text-amber-500 flex-shrink-0" />
          <span className="text-[10px] font-medium text-amber-700">
            Follow-up: {formatDate(proposta.followup_data!)}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border)]">
        <span className="font-money text-xs font-medium text-green-600">
          {formatMoney(proposta.emp_faturamento)}
        </span>
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

function KanbanColumn({
  column, propostas, onCardClick
}: {
  column: typeof KANBAN_COLUMNS[number];
  propostas: Proposta[];
  onCardClick: (p: Proposta) => void;
}) {
  const totalFaturamento = propostas.reduce((sum, p) => sum + (p.emp_faturamento || 0), 0);
  const faseColors: Record<number, string> = {
    0: "bg-slate-100 text-slate-600",
    1: "bg-blue-100 text-blue-700",
    2: "bg-amber-100 text-amber-700",
    3: "bg-purple-100 text-purple-700",
    4: "bg-green-100 text-green-700",
    5: "bg-red-100 text-red-700",
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
        <p className="font-money text-[11px] text-green-600 font-medium">{formatMoney(totalFaturamento)}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px]">
        <SortableContext items={propostas.map((p) => p.id_proposta)} strategy={verticalListSortingStrategy}>
          {propostas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-10 h-10 bg-[var(--color-border)] rounded-full flex items-center justify-center mb-2">
                <FileText className="w-5 h-5 text-[var(--color-text-muted)]" />
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">Nenhuma proposta nesta etapa</p>
            </div>
          ) : (
            propostas.map((p) => <SortableCard key={p.id_proposta} proposta={p} onCardClick={onCardClick} />)
          )}
        </SortableContext>
      </div>
    </div>
  );
}

function NaoAprovadaModal({ proposta, onConfirm, onClose }: {
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
          <Button
            variant="danger"
            onClick={() => onConfirm(motivo, data)}
            disabled={!motivo.trim() || !data}
            className="flex-1"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
}

function PropostaDetailDrawer({ proposta, onClose, onUpdate }: {
  proposta: Proposta;
  onClose: () => void;
  onUpdate: (id: string, fields: Partial<Proposta>) => Promise<void>;
}) {
  const [garantias, setGarantias] = useState<GarantiaItem[]>(
    proposta.checklist_garantias?.length ? proposta.checklist_garantias : DEFAULT_GARANTIAS
  );
  const [saving, setSaving] = useState(false);

  async function toggleGarantia(index: number) {
    const updated = garantias.map((g, i) => i === index ? { ...g, validado: !g.validado } : g);
    setGarantias(updated);
    setSaving(true);
    await onUpdate(proposta.id_proposta, { checklist_garantias: updated });
    setSaving(false);
  }

  async function toggleRepasse() {
    const next = proposta.status_repasse === "recebido" ? "pendente" : "recebido";
    setSaving(true);
    await onUpdate(proposta.id_proposta, { status_repasse: next });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md h-full overflow-y-auto shadow-xl flex flex-col">
        <div className="sticky top-0 bg-white border-b flex items-center justify-between px-5 py-4 z-10">
          <div>
            <p className="font-semibold text-[var(--color-text)]">{proposta.emp_razao}</p>
            <p className="text-xs text-[var(--color-text-muted)] font-mono">{formatCNPJ(proposta.emp_cnpj)}</p>
          </div>
          <div className="flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin text-[var(--color-text-muted)]" />}
            <button onClick={onClose} className="p-1.5 hover:bg-[var(--color-surface-subtle)] rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-5 space-y-6">
          <section>
            <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">Dados da Empresa</h3>
            <div className="space-y-2 text-sm">
              {[
                ["Representante", proposta.emp_repr_nome],
                ["E-mail", proposta.emp_email],
                ["Telefone", proposta.emp_telefone],
                ["Funcionários", String(proposta.emp_funcionarios)],
                ["Faturamento Mensal", formatMoney(proposta.emp_faturamento)],
                ["Endereço", `${proposta.emp_logradouro}, ${proposta.emp_numero} — ${proposta.emp_cidade}/${proposta.emp_uf}`],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <span className="text-[var(--color-text-muted)] w-32 flex-shrink-0">{label}</span>
                  <span className="text-[var(--color-text)] font-medium">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">Comissão</h3>
            <button
              onClick={toggleRepasse}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                proposta.status_repasse === "recebido"
                  ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {proposta.status_repasse === "recebido"
                ? <><CheckCircle2 className="w-4 h-4" /> Comissão recebida — clique para reverter</>
                : <><CircleDollarSign className="w-4 h-4" /> Marcar comissão como recebida</>
              }
            </button>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">Checklist de Garantias</h3>
            <div className="space-y-2">
              {garantias.map((g, i) => (
                <label key={g.item} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={g.validado}
                    onChange={() => toggleGarantia(i)}
                    className="w-4 h-4 accent-[var(--color-brand-primary)] rounded"
                  />
                  <span className={`text-sm transition-colors ${g.validado ? "text-[var(--color-text)] line-through opacity-60" : "text-[var(--color-text)]"}`}>
                    {g.item}
                  </span>
                  {g.validado && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 ml-auto" />}
                </label>
              ))}
            </div>
          </section>

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

          {proposta.socios?.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">Sócios</h3>
              <div className="space-y-3">
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

const FASE3_COLUMNS: KanbanColumn[] = ["aguardando_aprovacao_comite", "aprovada_sob_novas_condicoes"];

export default function KanbanBoard({ propostas: initialPropostas, onUpdate }: KanbanBoardProps) {
  const [propostas, setPropostas] = useState(initialPropostas);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pendingMove, setPendingMove] = useState<{ id: string; to: KanbanColumn } | null>(null);
  const [selectedProposta, setSelectedProposta] = useState<Proposta | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

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

    if (targetColumn === "nao_aprovada") {
      setPendingMove({ id: activeId, to: targetColumn });
      return;
    }

    if (FASE3_COLUMNS.includes(targetColumn)) {
      const garantias = proposta.checklist_garantias ?? DEFAULT_GARANTIAS;
      const pendentes = garantias.filter((g) => !g.validado);
      if (pendentes.length > 0) {
        alert(`Bloqueado: ${pendentes.map((g) => g.item).join(", ")} ainda não ${pendentes.length > 1 ? "foram validados" : "foi validado"}.`);
        return;
      }
    }

    moveCard(activeId, targetColumn);
  }

  async function moveCard(id: string, to: KanbanColumn, extra?: Partial<Proposta>) {
    setUpdating(id);
    setPropostas((prev) => prev.map((p) => p.id_proposta === id ? { ...p, coluna_kanban: to, ...extra } : p));
    await onUpdate(id, { coluna_kanban: to, ...extra });
    setUpdating(null);
  }

  async function confirmNaoAprovada(motivo: string, data: string) {
    if (!pendingMove) return;
    const followup = addDays(data, 30);
    await moveCard(pendingMove.id, "nao_aprovada", { motivo_perda: motivo, data_recusa: data, followup_data: followup });
    setPropostas((prev) => prev.map((p) => p.id_proposta === pendingMove.id
      ? { ...p, motivo_perda: motivo, data_recusa: data, followup_data: followup }
      : p));
    setPendingMove(null);
  }

  const activeCard = propostas.find((p) => p.id_proposta === activeId);

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-4 overflow-x-auto h-full pb-4">
          {KANBAN_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              propostas={propostasByColumn(col.id)}
              onCardClick={setSelectedProposta}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCard && <PropostaCard proposta={activeCard} isDragging />}
        </DragOverlay>
      </DndContext>

      {pendingMove && propostas.find((p) => p.id_proposta === pendingMove.id) && (
        <NaoAprovadaModal
          proposta={propostas.find((p) => p.id_proposta === pendingMove.id)!}
          onConfirm={confirmNaoAprovada}
          onClose={() => setPendingMove(null)}
        />
      )}

      {selectedProposta && (
        <PropostaDetailDrawer
          proposta={propostas.find((p) => p.id_proposta === selectedProposta.id_proposta) || selectedProposta}
          onClose={() => setSelectedProposta(null)}
          onUpdate={async (id, fields) => {
            await onUpdate(id, fields);
            setPropostas((prev) => prev.map((p) => p.id_proposta === id ? { ...p, ...fields } : p));
          }}
        />
      )}
    </>
  );
}
