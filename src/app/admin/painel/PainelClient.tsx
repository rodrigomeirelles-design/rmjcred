"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar as CalendarIcon, Gift } from "lucide-react";
import { formatCNPJ } from "@/lib/utils";

interface Aniversario {
  nome: string;
  documento: string;
  dia: number;
  mes: number;
  anoNascimento: number;
}

interface Tarefa {
  id: string;
  data: string; // YYYY-MM-DD
  texto: string;
  concluida: boolean;
}

export default function PainelClient({ aniversarios }: { aniversarios: Aniversario[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const saved = localStorage.getItem("rmj_tarefas");
    if (saved) {
      try {
        setTarefas(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("rmj_tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const handleAddTarefa = () => {
    if (!novaTarefa.trim()) return;
    setTarefas([...tarefas, {
      id: Math.random().toString(36).substr(2, 9),
      data: selectedDate,
      texto: novaTarefa.trim(),
      concluida: false
    }]);
    setNovaTarefa("");
  };

  const toggleTarefa = (id: string) => {
    setTarefas(tarefas.map(t => t.id === id ? { ...t, concluida: !t.concluida } : t));
  };

  const deleteTarefa = (id: string) => {
    setTarefas(tarefas.filter(t => t.id !== id));
  };

  // Get data for selected date
  const selDateObj = new Date(selectedDate + "T12:00:00");
  const selDay = selDateObj.getDate();
  const selMonth = selDateObj.getMonth() + 1; // 1-indexed

  const aniversariosDoDia = aniversarios.filter(a => a.dia === selDay && a.mes === selMonth);
  const tarefasDoDia = tarefas.filter(t => t.data === selectedDate);

  const getDayStatus = (d: number) => {
    const dataStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const hasAniversario = aniversarios.some(a => a.dia === d && a.mes === (currentDate.getMonth() + 1));
    const hasTarefa = tarefas.some(t => t.data === dataStr && !t.concluida);
    return { hasAniversario, hasTarefa, dataStr };
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-[var(--color-surface)]">
      {/* Calendar Area */}
      <div className="flex-1 border-r border-[var(--color-border)] flex flex-col">
        <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)] tracking-tight">Meu Painel</h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Gestão de compromissos e tarefas.</p>
          </div>
          <div className="flex items-center gap-4 bg-[var(--color-surface-subtle)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
            <button onClick={prevMonth} className="p-1 hover:bg-white rounded"><ChevronLeft className="w-4 h-4" /></button>
            <span className="font-semibold text-sm w-32 text-center">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
            <button onClick={nextMonth} className="p-1 hover:bg-white rounded"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-7 gap-px bg-[var(--color-border)] rounded-xl overflow-hidden border border-[var(--color-border)]">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
              <div key={day} className="bg-[var(--color-surface-subtle)] p-2 text-center text-xs font-semibold text-[var(--color-text-muted)]">
                {day}
              </div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-[var(--color-surface)] p-2 h-24" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const { hasAniversario, hasTarefa, dataStr } = getDayStatus(d);
              const isSelected = selectedDate === dataStr;
              const isToday = dataStr === new Date().toISOString().split("T")[0];

              return (
                <div 
                  key={d} 
                  onClick={() => setSelectedDate(dataStr)}
                  className={`bg-white p-2 h-24 sm:h-32 border-t border-[var(--color-border)] cursor-pointer hover:bg-slate-50 transition-colors relative flex flex-col ${isSelected ? 'ring-2 ring-inset ring-[var(--color-brand-primary)]' : ''}`}
                >
                  <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-[var(--color-brand-primary)] text-white' : 'text-[var(--color-text)]'}`}>
                    {d}
                  </span>
                  
                  <div className="mt-auto flex flex-col gap-1">
                    {hasAniversario && (
                      <div className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded truncate font-medium flex items-center gap-1">
                        <Gift className="w-3 h-3 flex-shrink-0" /> Aniversário
                      </div>
                    )}
                    {hasTarefa && (
                      <div className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded truncate font-medium flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3 flex-shrink-0" /> Tarefas
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side Panel Area */}
      <div className="w-full md:w-80 flex flex-col bg-[var(--color-surface-subtle)]">
        <div className="px-6 py-5 border-b border-[var(--color-border)]">
          <h2 className="font-bold text-[var(--color-text)]">
            {selDateObj.toLocaleDateString("pt-BR", { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Aniversarios */}
          {aniversariosDoDia.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Gift className="w-4 h-4" /> Aniversariantes
              </h3>
              <div className="space-y-2">
                {aniversariosDoDia.map((a, i) => (
                  <div key={i} className="bg-white border border-[var(--color-border)] p-3 rounded-lg shadow-sm">
                    <p className="font-bold text-sm text-[var(--color-text)]">{a.nome}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{formatCNPJ(a.documento)}</p>
                    <p className="text-xs text-amber-600 font-medium mt-1">
                      Faz {new Date().getFullYear() - a.anoNascimento} anos hoje! 🎉
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tarefas */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" /> Tarefas / Compromissos
            </h3>
            
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={novaTarefa}
                onChange={e => setNovaTarefa(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTarefa()}
                placeholder="Nova tarefa..." 
                className="input-base flex-1 text-sm py-1.5"
              />
              <button onClick={handleAddTarefa} className="bg-[var(--color-brand-primary)] text-white p-1.5 rounded-lg hover:bg-[var(--color-brand-primary-dark)]">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {tarefasDoDia.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)] italic">Nenhuma tarefa para este dia.</p>
              ) : (
                tarefasDoDia.map(t => (
                  <div key={t.id} className={`flex items-start justify-between gap-2 p-3 rounded-lg border bg-white ${t.concluida ? 'opacity-50 border-transparent' : 'border-[var(--color-border)] shadow-sm'}`}>
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <input 
                        type="checkbox" 
                        checked={t.concluida} 
                        onChange={() => toggleTarefa(t.id)}
                        className="mt-1 flex-shrink-0"
                      />
                      <p className={`text-sm break-words ${t.concluida ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text)]'}`}>
                        {t.texto}
                      </p>
                    </div>
                    <button onClick={() => deleteTarefa(t.id)} className="text-red-400 hover:text-red-600 flex-shrink-0 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
