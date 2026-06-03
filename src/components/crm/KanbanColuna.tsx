import { useState } from "react";
import { Oportunidade } from "@/types";

interface KanbanColunaProps {
  id: string;
  label: string;
  color: string;
  oportunidades: Oportunidade[];
  onDropCard: (oportunidadeId: number, targetCol: string) => void;
  onCardClick: (oportunidade: Oportunidade) => void;
}

export default function KanbanColuna({
  id,
  label,
  color,
  oportunidades,
  onDropCard,
  onCardClick
}: KanbanColunaProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const opIdStr = e.dataTransfer.getData("oportunidadeId");
    if (opIdStr) {
      onDropCard(parseInt(opIdStr, 10), id);
    }
  };

  const totalSolicitado = oportunidades.reduce((sum, op) => sum + op.valor_solicitado, 0);

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  return (
    <div
      className={`kanban-col ${isDragOver ? "drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ "--border-color": color } as React.CSSProperties}
    >
      <div className="kanban-col-header">
        <div className="kanban-col-title-area">
          <span className="kanban-col-title">{label}</span>
          <span className="kanban-col-count">{oportunidades.length}</span>
        </div>
        <div className="kanban-col-total">{formatBRL(totalSolicitado)}</div>
      </div>

      <div className="kanban-col-list">
        {oportunidades.map((op) => (
          <div key={op.id} onClick={() => onCardClick(op)}>
            {/* We render card inside the container to trigger action */}
            <div style={{ pointerEvents: "none" }}>
              <KanbanCard opportunity={op} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Internal small card proxy to avoid cyclical import dependencies
import { AlertTriangle, Calendar, CheckCircle } from "lucide-react";
import { GarantiaItem } from "@/types";

function KanbanCard({ opportunity }: { opportunity: Oportunidade }) {
  let hasPendingGarantia = false;
  try {
    const checklist: GarantiaItem[] = JSON.parse(opportunity.checklist_garantias || "[]");
    hasPendingGarantia = checklist.some(item => !item.validado);
  } catch {
    hasPendingGarantia = true;
  }

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  const formatDate = (isoStr: string) => {
    if (!isoStr) return "";
    const [year, month, day] = isoStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="kanban-card">
      <div className="kanban-card-title">{opportunity.razao_social}</div>
      <div className="kanban-card-value">{formatBRL(opportunity.valor_solicitado)}</div>
      
      <div className="kanban-card-badges">
        {hasPendingGarantia && (
          <span className="crm-badge crm-badge-red" title="Garantias pendentes de validação">
            <AlertTriangle size={12} /> Garantias
          </span>
        )}
        
        {opportunity.status_repasse === "recebido" && (
          <span className="crm-badge crm-badge-green" title="Repasse de comissão recebido">
            <CheckCircle size={12} /> Repasse OK
          </span>
        )}

        {opportunity.followup_data && (
          <span className="crm-badge crm-badge-amber" title={`Retentativa após: ${formatDate(opportunity.followup_data)}`}>
            <Calendar size={12} /> {formatDate(opportunity.followup_data)}
          </span>
        )}
      </div>
    </div>
  );
}
