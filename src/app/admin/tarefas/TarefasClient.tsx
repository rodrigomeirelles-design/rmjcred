"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Gift,
  X,
  Clock,
  Bell,
  Edit3,
} from "lucide-react";

interface Aniversario {
  nome: string;
  documento: string;
  dia: number;
  mes: number;
  anoNascimento: number;
}

type EventCategory =
  | "feriado"
  | "reuniao"
  | "tarefa"
  | "aniversario"
  | "followup"
  | "credito_liberado";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  category: EventCategory;
  description?: string;
}

interface NewEventForm {
  title: string;
  category: EventCategory;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
}

const CAT: Record<EventCategory, { label: string; color: string; bg: string }> = {
  feriado:          { label: "Feriado",         color: "#dc2626", bg: "rgb(239 68 68 / 0.10)" },
  reuniao:          { label: "Reunião",          color: "#1d4ed8", bg: "rgb(59 130 246 / 0.10)" },
  tarefa:           { label: "Tarefa",           color: "#15803d", bg: "rgb(34 197 94 / 0.10)" },
  aniversario:      { label: "Aniversário",      color: "#7e22ce", bg: "rgb(168 85 247 / 0.10)" },
  followup:         { label: "Follow-up CRM",    color: "#b45309", bg: "rgb(245 158 11 / 0.10)" },
  credito_liberado: { label: "Crédito Liberado", color: "#0e7490", bg: "rgb(6 182 212 / 0.10)" },
};

const CREATABLE_CATEGORIES: EventCategory[] = [
  "reuniao",
  "tarefa",
  "followup",
  "credito_liberado",
];

const DRAGGABLE_CATEGORIES: EventCategory[] = [
  "reuniao",
  "tarefa",
  "followup",
  "credito_liberado",
];

const MONTH_NAMES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

// ── Sub-components ───────────────────────────────────────────────────────────

function EventChip({ event }: { event: CalendarEvent }) {
  const draggable = DRAGGABLE_CATEGORIES.includes(event.category);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: event.id,
    disabled: !draggable,
    data: { event },
  });

  const cfg = CAT[event.category];
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold truncate select-none"
      style={{
        background: cfg.bg,
        color: cfg.color,
        cursor: draggable ? "grab" : "default",
        opacity: isDragging ? 0.35 : 1,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: cfg.color }}
      />
      <span className="truncate">{event.title}</span>
    </div>
  );
}

function DayCell({
  date,
  events,
  aniversarios,
  isSelected,
  isToday,
  onClick,
}: {
  date: string;
  events: CalendarEvent[];
  aniversarios: Aniversario[];
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: date });
  const day = parseInt(date.split("-")[2], 10);

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className="relative flex flex-col bg-white h-24 sm:h-28 cursor-pointer transition-colors border-t border-[var(--color-border)]"
      style={{
        outline: isSelected ? "2px solid #234469" : undefined,
        outlineOffset: isSelected ? "-2px" : undefined,
        background: isOver ? "rgb(35 68 105 / 0.06)" : undefined,
      }}
    >
      <span
        className="text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full m-1.5 flex-shrink-0"
        style={
          isToday
            ? { background: "#234469", color: "#fff" }
            : { color: "var(--color-text)" }
        }
      >
        {day}
      </span>

      <div className="px-1 pb-1 flex flex-col gap-0.5 overflow-hidden">
        {aniversarios.length > 0 && (
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold truncate"
            style={{ background: "rgb(168 85 247 / 0.10)", color: "#7e22ce" }}
          >
            <Gift className="w-2.5 h-2.5 flex-shrink-0" />
            <span className="truncate">
              {aniversarios.length === 1
                ? aniversarios[0].nome.split(" ")[0]
                : `${aniversarios.length} aniv.`}
            </span>
          </div>
        )}
        {events.slice(0, 2).map((e) => (
          <EventChip key={e.id} event={e} />
        ))}
        {events.length > 2 && (
          <span className="text-[9px] text-[var(--color-text-muted)] px-1.5">
            +{events.length - 2} mais
          </span>
        )}
      </div>
    </div>
  );
}

function EventModal({
  defaultDate,
  initialEvent,
  onClose,
  onSaved,
}: {
  defaultDate: string;
  initialEvent?: CalendarEvent;
  onClose: () => void;
  onSaved: (event: CalendarEvent, isEdit?: boolean) => void;
}) {
  const [form, setForm] = useState<NewEventForm>({
    title: initialEvent?.title || "",
    category: initialEvent?.category || "tarefa",
    date: initialEvent?.date || defaultDate,
    startTime: initialEvent?.startTime || "",
    endTime: initialEvent?.endTime || "",
    description: initialEvent?.description || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!form.title.trim()) {
      setError("Título é obrigatório.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const method = initialEvent ? "PATCH" : "POST";
      const payload: any = {
        title: form.title.trim(),
        category: form.category,
        date: form.date,
        startTime: form.startTime || undefined,
        endTime: form.endTime || undefined,
        description: form.description || undefined,
      };
      if (initialEvent) payload.id = initialEvent.id;

      const res = await fetch("/api/calendar/events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        onSaved(
          {
            id: initialEvent ? initialEvent.id : data.id,
            ...payload,
          },
          !!initialEvent
        );
      } else {
        const msg: string = data.error || "";
        if (msg.includes("GOOGLE_CALENDAR_ID")) {
          setError("Calendário não configurado. Acesse Configurações > Google Calendar para ativar.");
        } else {
          setError("Erro ao salvar evento: " + (data.error || "tente novamente."));
        }
      }
    } catch {
      setError("Erro de rede ao salvar. Verifique sua conexão e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ color: "#234469" }}>
            {initialEvent ? "Editar Evento" : "Novo Evento"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">
              Título *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Ex: Reunião com cliente"
              className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#234469]/30"
              style={{ borderColor: "#D8E2EE", color: "#234469" }}
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">
              Categoria
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CREATABLE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-all"
                  style={{
                    borderColor:
                      form.category === cat ? CAT[cat].color : "#D8E2EE",
                    background:
                      form.category === cat ? CAT[cat].bg : "#fff",
                    color:
                      form.category === cat ? CAT[cat].color : "#5A6E88",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: CAT[cat].color }}
                  />
                  {CAT[cat].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">
              Data
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none"
              style={{ borderColor: "#D8E2EE", color: "#234469" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Início (opcional)
              </label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none"
                style={{ borderColor: "#D8E2EE", color: "#234469" }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Fim (opcional)
              </label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none"
                style={{ borderColor: "#D8E2EE", color: "#234469" }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">
              Descrição (opcional)
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              placeholder="Observações..."
              className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none resize-none"
              style={{ borderColor: "#D8E2EE", color: "#234469" }}
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors hover:bg-gray-50"
              style={{ borderColor: "#D8E2EE", color: "#234469" }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "#234469" }}
            >
              {submitting ? "Salvando..." : "Salvar Evento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function TarefasClient({
  aniversarios,
}: {
  aniversarios: Aniversario[];
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>("default");
  const notifTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const yearMonth = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}`;

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/calendar/events?month=${yearMonth}`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [yearMonth]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPerm(Notification.permission);
    }
  }, []);

  useEffect(() => {
    notifTimers.current.forEach(clearTimeout);
    notifTimers.current = [];
    if (notifPerm !== "granted") return;

    const now = Date.now();
    events.forEach((event) => {
      if (!event.startTime) return;
      const eventTime = new Date(`${event.date}T${event.startTime}:00`).getTime();
      const delay = eventTime - 60 * 60 * 1000 - now;
      if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
        notifTimers.current.push(
          setTimeout(() => {
            new Notification(`RMJ — ${event.title}`, {
              body: `Começa em 1 hora: ${event.startTime}`,
              icon: "/logo.png",
              tag: event.id,
            });
          }, delay)
        );
      }
    });

    return () => { notifTimers.current.forEach(clearTimeout); };
  }, [events, notifPerm]);

  async function requestNotifPermission() {
    const perm = await Notification.requestPermission();
    setNotifPerm(perm);
  }

  async function handleDeleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    await fetch("/api/calendar/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  async function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    if (!e.over) return;
    const eventId = e.active.id as string;
    const newDate = e.over.id as string;
    const event = events.find((ev) => ev.id === eventId);
    if (!event || event.date === newDate) return;

    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, date: newDate } : ev))
    );
    await fetch("/api/calendar/events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: eventId, date: newDate }),
    });
  }

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const today = new Date().toISOString().split("T")[0];

  const selDateObj = new Date(selectedDate + "T12:00:00");
  const selDay = selDateObj.getDate();
  const selMonth = selDateObj.getMonth() + 1;

  const anivsDoDia = aniversarios.filter(
    (a) => a.dia === selDay && a.mes === selMonth
  );
  const eventsDoDia = events
    .filter((e) => e.date === selectedDate)
    .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
  const activeEvent = events.find((e) => e.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(e.active.id as string)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* ── Calendar column ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-[var(--color-border)]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-[var(--color-text)]">
                Meu Painel
              </h1>
              <p className="text-sm text-[var(--color-text-muted)]">
                Gestão de compromissos e tarefas.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {notifPerm === "default" && typeof window !== "undefined" && "Notification" in window && (
                <button
                  onClick={requestNotifPermission}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors hover:opacity-80"
                  style={{
                    borderColor: "#f59e0b",
                    color: "#b45309",
                    background: "rgb(245 158 11 / 0.08)",
                  }}
                >
                  <Bell className="w-3.5 h-3.5" />
                  Ativar alertas
                </button>
              )}

              <div
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--color-border)]"
                style={{ background: "var(--color-surface-subtle)" }}
              >
                <button
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() - 1,
                        1
                      )
                    )
                  }
                  className="p-0.5 hover:opacity-70 rounded"
                >
                  <ChevronLeft className="w-4 h-4 text-[var(--color-text)]" />
                </button>
                <span className="font-semibold text-sm w-36 text-center text-[var(--color-text)]">
                  {MONTH_NAMES[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
                </span>
                <button
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1,
                        1
                      )
                    )
                  }
                  className="p-0.5 hover:opacity-70 rounded"
                >
                  <ChevronRight className="w-4 h-4 text-[var(--color-text)]" />
                </button>
              </div>

              <button
                onClick={() => {
                  setEditingEvent(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "#234469" }}
              >
                <Plus className="w-4 h-4" />
                Novo Evento
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="px-6 py-2 border-b border-[var(--color-border)] flex items-center gap-4 flex-wrap">
            {(
              Object.entries(CAT) as [
                EventCategory,
                (typeof CAT)[EventCategory]
              ][]
            ).map(([key, cfg]) => (
              <span
                key={key}
                className="flex items-center gap-1.5 text-[11px] font-semibold"
                style={{ color: cfg.color }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: cfg.color }}
                />
                {cfg.label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-sm text-[var(--color-text-muted)]">
                Carregando...
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-px bg-[var(--color-border)] rounded-xl overflow-hidden border border-[var(--color-border)]">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                  (d) => (
                    <div
                      key={d}
                      className="py-2 text-center text-[11px] font-semibold text-[var(--color-text-muted)]"
                      style={{ background: "var(--color-surface-subtle)" }}
                    >
                      {d}
                    </div>
                  )
                )}

                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="h-24 sm:h-28 border-t border-[var(--color-border)]"
                    style={{ background: "var(--color-surface)" }}
                  />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1;
                  const dateStr = `${currentDate.getFullYear()}-${String(
                    currentDate.getMonth() + 1
                  ).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                  const dayEvents = events.filter((e) => e.date === dateStr);
                  const dayAnivs = aniversarios.filter(
                    (a) =>
                      a.dia === d && a.mes === currentDate.getMonth() + 1
                  );

                  return (
                    <DayCell
                      key={d}
                      date={dateStr}
                      events={dayEvents}
                      aniversarios={dayAnivs}
                      isSelected={selectedDate === dateStr}
                      isToday={today === dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Side panel ──────────────────────────────────────────────── */}
        <div
          className="w-full md:w-80 flex flex-col border-l border-[var(--color-border)]"
          style={{ background: "var(--color-surface-subtle)" }}
        >
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h2 className="font-bold text-[var(--color-text)] text-sm capitalize">
              {selDateObj.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h2>
            <button
              onClick={() => {
                setEditingEvent(null);
                setShowModal(true);
              }}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl border-2 border-dashed text-sm font-semibold transition-colors hover:opacity-70"
              style={{ borderColor: "#234469", color: "#234469" }}
            >
              <Plus className="w-4 h-4" />
              Adicionar evento
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {anivsDoDia.length > 0 && (
              <section>
                <h3
                  className="text-[10px] font-bold uppercase tracking-widest mb-2.5"
                  style={{ color: "#7e22ce" }}
                >
                  Aniversariantes
                </h3>
                <div className="space-y-2">
                  {anivsDoDia.map((a, i) => (
                    <div
                      key={i}
                      className="rounded-xl border p-3"
                      style={{
                        borderColor: "rgb(168 85 247 / 0.2)",
                        background: "rgb(168 85 247 / 0.05)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Gift
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: "#a855f7" }}
                        />
                        <span className="font-bold text-sm text-[var(--color-text)] truncate">
                          {a.nome}
                        </span>
                      </div>
                      <p
                        className="text-xs mt-0.5 ml-6 font-semibold"
                        style={{ color: "#7e22ce" }}
                      >
                        {new Date().getFullYear() - a.anoNascimento} anos
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {eventsDoDia.length > 0 && (
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2.5 text-[var(--color-text-muted)]">
                  Eventos
                </h3>
                <div className="space-y-2">
                  {eventsDoDia.map((event) => {
                    const cfg = CAT[event.category];
                    return (
                      <div
                        key={event.id}
                        className="rounded-xl border p-3 flex items-start justify-between gap-2"
                        style={{
                          borderColor: `${cfg.color}33`,
                          background: cfg.bg,
                        }}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: cfg.color }}
                            />
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider"
                              style={{ color: cfg.color }}
                            >
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                            {event.title}
                          </p>
                          {event.startTime && (
                            <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {event.startTime}
                              {event.endTime ? ` — ${event.endTime}` : ""}
                            </p>
                          )}
                          {event.description && (
                            <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <button
                            onClick={() => {
                              setEditingEvent(event);
                              setShowModal(true);
                            }}
                            className="text-slate-400 hover:text-slate-700 p-1 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-400 hover:text-red-600 p-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {eventsDoDia.length === 0 && anivsDoDia.length === 0 && (
              <p className="text-sm text-[var(--color-text-muted)] italic text-center pt-10">
                Nenhum evento para este dia.
              </p>
            )}
          </div>
        </div>

        {/* DragOverlay */}
        <DragOverlay>
          {activeEvent && (
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xl"
              style={{
                background: CAT[activeEvent.category].bg,
                color: CAT[activeEvent.category].color,
                outline: `2px solid ${CAT[activeEvent.category].color}`,
              }}
            >
              {activeEvent.title}
            </div>
          )}
        </DragOverlay>
      </div>

      {/* Event modal */}
      {showModal && (
        <EventModal
          defaultDate={selectedDate}
          initialEvent={editingEvent || undefined}
          onClose={() => {
            setShowModal(false);
            setEditingEvent(null);
          }}
          onSaved={(event, isEdit) => {
            if (isEdit) {
              setEvents((prev) => prev.map((e) => e.id === event.id ? event : e));
            } else {
              setEvents((prev) => [...prev, event]);
            }
            setSelectedDate(event.date);
            setShowModal(false);
            setEditingEvent(null);
          }}
        />
      )}
    </DndContext>
  );
}
