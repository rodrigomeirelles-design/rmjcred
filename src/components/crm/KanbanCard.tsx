import { AlertTriangle, Calendar, CheckCircle } from "lucide-react";
import { Oportunidade, GarantiaItem } from "@/types";

interface KanbanCardProps {
  oportunidade: Oportunidade;
  onClick: () => void;
}

export default function KanbanCard({ oportunidade, onClick }: KanbanCardProps) {
  let hasPendingGarantia = false;
  try {
    const checklist: GarantiaItem[] = JSON.parse(oportunidade.checklist_garantias || "[]");
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

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("oportunidadeId", oportunidade.id.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="kanban-card"
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
    >
      <div className="kanban-card-title">{oportunidade.razao_social}</div>
      <div className="kanban-card-value">{formatBRL(oportunidade.valor_solicitado)}</div>
      
      <div className="kanban-card-badges">
        {hasPendingGarantia && (
          <span className="crm-badge crm-badge-red" title="Garantias pendentes de validação">
            <AlertTriangle size={12} /> Garantias
          </span>
        )}
        
        {oportunidade.status_repasse === "recebido" && (
          <span className="crm-badge crm-badge-green" title="Repasse de comissão recebido">
            <CheckCircle size={12} /> Repasse OK
          </span>
        )}

        {oportunidade.followup_data && (
          <span className="crm-badge crm-badge-amber" title={`Retentativa após: ${formatDate(oportunidade.followup_data)}`}>
            <Calendar size={12} /> {formatDate(oportunidade.followup_data)}
          </span>
        )}
      </div>
    </div>
  );
}
