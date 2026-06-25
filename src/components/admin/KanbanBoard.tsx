"use client";

import { useState, useCallback } from "react";
import {
  DndContext, DragEndEvent, DragStartEvent,
  PointerSensor, useSensor, useSensors, DragOverlay, useDroppable,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Proposta, type KanbanColumn, KANBAN_COLUMNS, COMISSAO_PERCENTUAL } from "@/types";
import { formatMoney, formatDate, formatCNPJ, addDays, maskMoney, parseMoney } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  Building2, Calendar, Clock, CheckCircle2,
  FileText, X, Loader2, Pencil, Eye, ExternalLink,
} from "lucide-react";

interface KanbanBoardProps {
  propostas: Proposta[];
  onUpdate: (id: string, fields: Partial<Proposta>) => Promise<void>;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function calcComissao(valor?: number) {
  return (valor ?? 0) * COMISSAO_PERCENTUAL;
}

function proxMes(dataISO: string): string {
  const d = new Date(dataISO + "T12:00:00");
  return new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString().split("T")[0];
}

// ─── Card visual ────────────────────────────────────────────────────────────

function PropostaCard({ proposta, isDragging }: { proposta: Proposta; isDragging?: boolean }) {
  const comissao = calcComissao(proposta.valor_solicitado);
  const hasFollowup = !!proposta.followup_data;

  return (
    <div className={`bg-white border border-[var(--color-border)] rounded-xl p-3.5 space-y-2.5 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${isDragging ? "opacity-50" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[var(--color-text)] truncate">{proposta.emp_razao || formatCNPJ(proposta.emp_cnpj)}</p>
          <p className="text-xs text-[var(--color-text-muted)] font-mono">{formatCNPJ(proposta.emp_cnpj)}</p>
        </div>
        <Badge variant="info" className="flex-shrink-0 text-[10px]">BDMG CG</Badge>
      </div>

      {proposta.valor_solicitado != null && (
        <div className="flex items-center justify-between text-xs bg-[var(--color-surface-subtle)] rounded-lg px-2.5 py-1.5">
          <span className="text-[var(--color-text-muted)]">Crédito</span>
          <span className="font-money font-semibold text-[var(--color-text)]">{formatMoney(proposta.valor_solicitado)}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 flex-wrap">
        {proposta.status_repasse === "recebido" ? (
          <Badge variant="success" className="text-[10px]">
            <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Comissão recebida
          </Badge>
        ) : (
          comissao > 0 && (
            <Badge variant="default" className="text-[10px]">
              Comissão: {formatMoney(comissao)}
            </Badge>
          )
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

      {proposta.coluna_kanban === "credito_liberado" && proposta.data_liberacao && (
        <div className="flex items-center gap-1.5 bg-green-50 rounded-lg px-2 py-1">
          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
          <span className="text-[10px] font-medium text-green-700">
            Liberado: {formatDate(proposta.data_liberacao)}
            {" · "}Comissão: {formatDate(proxMes(proposta.data_liberacao))}
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
  column, propostas, onCardClick
}: {
  column: typeof KANBAN_COLUMNS[number];
  propostas: Proposta[];
  onCardClick: (p: Proposta) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const totalComissao = propostas.reduce((sum, p) => sum + calcComissao(p.valor_solicitado), 0);
  const faseColors: Record<number, string> = {
    0: "bg-slate-100 text-slate-600",
    1: "bg-blue-100 text-blue-700",
    2: "bg-amber-100 text-amber-700",
    3: "bg-purple-100 text-purple-700",
    4: "bg-green-100 text-green-700",
    5: "bg-red-100 text-red-700",
    6: "bg-zinc-100 text-zinc-500",
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
        {totalComissao > 0 && (
          <p className="font-money text-[11px] text-green-600 font-medium">{formatMoney(totalComissao)}</p>
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
  const comissao = calcComissao(proposta.valor_solicitado);

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
  function Row({ label, value }: { label: string; value?: string | null }) {
    if (!value) return null;
    return (
      <div className="flex gap-2 text-sm py-1.5 border-b border-[var(--color-border)] last:border-0">
        <span className="text-[var(--color-text-muted)] w-40 flex-shrink-0 text-xs pt-0.5">{label}</span>
        <span className="text-[var(--color-text)] font-medium flex-1 break-words">{value}</span>
      </div>
    );
  }
  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <section>
        <h3 className="text-[10px] font-bold text-[var(--color-brand-primary)] uppercase tracking-widest mb-2 pb-1 border-b-2 border-[var(--color-brand-primary)]">{title}</h3>
        <div>{children}</div>
      </section>
    );
  }
  const kLabel = KANBAN_COLUMNS.find((c) => c.id === proposta.coluna_kanban)?.label ?? proposta.coluna_kanban;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-white border-b flex items-center justify-between px-5 py-4 z-10">
          <div>
            <p className="font-bold text-[var(--color-text)]">{proposta.emp_razao || formatCNPJ(proposta.emp_cnpj)}</p>
            <p className="text-xs text-[var(--color-text-muted)] font-mono">{formatCNPJ(proposta.emp_cnpj)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--color-surface-subtle)] rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-6">
          <Section title="Status da Proposta">
            <Row label="Etapa" value={kLabel} />
            <Row label="Valor do Crédito" value={proposta.valor_solicitado != null ? formatMoney(proposta.valor_solicitado) : undefined} />
            <Row label="Comissão (1,35%)" value={proposta.valor_solicitado != null ? formatMoney(calcComissao(proposta.valor_solicitado)) : undefined} />
            <Row label="Repasse" value={proposta.status_repasse === "recebido" ? "Comissão recebida" : "Pendente"} />
            <Row label="Data de Liberação" value={proposta.data_liberacao ? formatDate(proposta.data_liberacao) : undefined} />
            <Row label="Processamento M+1" value={proposta.data_liberacao ? formatDate(proxMes(proposta.data_liberacao)) : undefined} />
            <Row label="Follow-up" value={proposta.followup_data ? formatDate(proposta.followup_data) : undefined} />
            <Row label="Motivo de Recusa" value={proposta.motivo_perda} />
          </Section>

          <Section title="Dados da Empresa">
            <Row label="Razão Social" value={proposta.emp_razao} />
            <Row label="Nome Fantasia" value={proposta.emp_fantasia} />
            <Row label="CNPJ" value={formatCNPJ(proposta.emp_cnpj)} />
            <Row label="Nº Funcionários" value={String(proposta.emp_funcionarios || "")} />
          </Section>

          <Section title="Representante Legal">
            <Row label="Nome" value={proposta.emp_repr_nome} />
            <Row label="CPF" value={proposta.emp_repr_cpf} />
            <Row label="E-mail" value={proposta.emp_email} />
            <Row label="Telefone" value={proposta.emp_telefone} />
          </Section>

          <Section title="Endereço">
            <Row label="Logradouro" value={`${proposta.emp_logradouro}, ${proposta.emp_numero}`} />
            <Row label="Complemento" value={proposta.emp_complemento} />
            <Row label="Bairro" value={proposta.emp_bairro} />
            <Row label="Cidade / UF" value={`${proposta.emp_cidade} / ${proposta.emp_uf}`} />
            <Row label="CEP" value={proposta.emp_cep} />
          </Section>

          {proposta.socios?.map((s, i) => (
            <Section key={i} title={`Sócio ${i + 1} — ${s.nome}`}>
              <Row label="CPF" value={s.cpf} />
              <Row label="RG" value={s.rg} />
              <Row label="Nascimento" value={formatDate(s.nascimento)} />
              <Row label="Estado Civil" value={s.estado_civil} />
              {s.regime && <Row label="Regime" value={s.regime} />}
              <Row label="Participação" value={`${s.participacao}%`} />
              <Row label="Profissão" value={s.profissao} />
              <Row label="E-mail" value={s.email} />
              <Row label="Telefone" value={s.telefone} />
              <Row label="Renda Mensal" value={formatMoney(s.renda)} />
              <Row label="Endereço" value={`${s.logradouro}, ${s.numero} — ${s.cidade}/${s.uf}`} />
              {s.imovel_tipo && <Row label="Imóvel (comprov.)" value={s.imovel_tipo} />}
              {s.imovel_valor != null && <Row label="Imóvel (valor)" value={formatMoney(s.imovel_valor)} />}
              {(s.veiculo_placas?.length ?? 0) > 0 && <Row label="Veículos" value={s.veiculo_placas.join(", ")} />}
              {s.conjuge && (
                <>
                  <div className="mt-3 mb-1 text-[10px] font-bold text-purple-600 uppercase tracking-widest">Cônjuge — {s.conjuge.nome}</div>
                  <Row label="CPF" value={s.conjuge.cpf} />
                  <Row label="Nascimento" value={formatDate(s.conjuge.nascimento)} />
                  <Row label="Telefone" value={s.conjuge.telefone} />
                  <Row label="E-mail" value={s.conjuge.email} />
                  {s.conjuge.incluir_renda === "sim" && s.conjuge.renda != null && <Row label="Renda" value={formatMoney(s.conjuge.renda)} />}
                </>
              )}
            </Section>
          ))}

          <Section title="Dados Bancários">
            <Row label="Banco" value={`${proposta.banco_nome} — ${proposta.banco_numero}`} />
            <Row label="Agência" value={proposta.banco_agencia} />
            <Row label="Conta" value={`${proposta.banco_conta}-${proposta.banco_digito}`} />
          </Section>

          {proposta.obs_finais && (
            <Section title="Observações">
              <p className="text-sm text-[var(--color-text)] bg-[var(--color-surface-subtle)] rounded-lg p-3">{proposta.obs_finais}</p>
            </Section>
          )}
        </div>
      </div>
    </div>
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
  const [saving, setSaving] = useState(false);
  const [editingCredito, setEditingCredito] = useState(false);
  const [creditoInput, setCreditoInput] = useState(
    proposta.valor_solicitado ? maskMoney(String(Math.round(proposta.valor_solicitado * 100))) : ""
  );
  const [editingObs, setEditingObs] = useState(false);
  const [obsInput, setObsInput] = useState(proposta.obs_finais || "");

  async function saveCredito() {
    const valor = parseMoney(creditoInput);
    setSaving(true);
    await onUpdate(proposta.id_proposta, { valor_solicitado: valor || undefined });
    setSaving(false);
    setEditingCredito(false);
  }

  async function saveObs() {
    setSaving(true);
    await onUpdate(proposta.id_proposta, { obs_finais: obsInput || undefined });
    setSaving(false);
    setEditingObs(false);
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full overflow-y-auto shadow-xl flex flex-col">
        <div className="sticky top-0 bg-white border-b flex items-center justify-between px-5 py-4 z-10">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[var(--color-text)] truncate">{proposta.emp_razao || formatCNPJ(proposta.emp_cnpj)}</p>
            <p className="text-xs text-[var(--color-text-muted)] font-mono">{formatCNPJ(proposta.emp_cnpj)}</p>
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
                  onClick={() => { setObsInput(proposta.obs_finais || ""); setEditingObs(true); }}
                  className="p-1 hover:bg-[var(--color-surface-subtle)] rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {editingObs ? (
              <div className="space-y-2">
                <textarea
                  className="input-base min-h-[80px] resize-none text-sm w-full"
                  placeholder="Anotações sobre esta proposta..."
                  value={obsInput}
                  onChange={(e) => setObsInput(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={() => setEditingObs(false)} className="flex-1 py-1.5 text-xs border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-subtle)]">
                    Cancelar
                  </button>
                  <button onClick={saveObs} className="flex-1 py-1.5 text-xs bg-[var(--color-brand-primary)] text-white rounded-lg hover:bg-[var(--color-brand-primary-dark)]">
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text)] leading-relaxed">
                {proposta.obs_finais
                  ? proposta.obs_finais
                  : <span className="text-[var(--color-text-muted)] italic">Nenhuma observação</span>}
              </p>
            )}
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

export default function KanbanBoard({ propostas: initialPropostas, onUpdate }: KanbanBoardProps) {
  const [propostas, setPropostas] = useState(initialPropostas);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pendingNaoAprovado, setPendingNaoAprovado] = useState<{ id: string } | null>(null);
  const [pendingLiberado, setPendingLiberado] = useState<{ id: string } | null>(null);
  const [selectedProposta, setSelectedProposta] = useState<Proposta | null>(null);
  const [consultandoProposta, setConsultandoProposta] = useState<Proposta | null>(null);
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

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-4 overflow-x-auto h-full pb-4">
          {KANBAN_COLUMNS.map((col) => (
            <KanbanColumnView
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
