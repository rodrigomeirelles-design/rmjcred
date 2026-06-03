import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Oportunidade, GarantiaItem } from "@/types";
import KanbanColuna from "./KanbanColuna";
import DrawerOportunidade from "./DrawerOportunidade";
import ModalNaoAprovada from "./ModalNaoAprovada";

// 6 Columns shared pipeline
const COLUNAS = [
  { id: "prospect", label: "Prospect", color: "#64748b" },
  { id: "em_preenchimento", label: "Em Preenchimento", color: "#0ea5e9" },
  { id: "em_analise", label: "Em Análise", color: "#f59e0b" },
  { id: "aprovada", label: "Aprovada", color: "#10b981" },
  { id: "aguardando_documentacao", label: "Aguardando Documentação", color: "#8b5cf6" },
  { id: "liberado", label: "Liberado", color: "#1e40af" }
];

interface KanbanBoardProps {
  opportunities: Oportunidade[];
  onRefresh: () => void;
}

export default function KanbanBoard({ opportunities, onRefresh }: KanbanBoardProps) {
  const [localOpportunities, setLocalOpportunities] = useState<Oportunidade[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Oportunidade | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ id: number; targetCol: string } | null>(null);

  useEffect(() => {
    setLocalOpportunities(opportunities);
  }, [opportunities]);

  const handleCardClick = (op: Oportunidade) => {
    setSelectedOpportunity(op);
    setIsDrawerOpen(true);
  };

  const handleSaveOpportunity = async (id: number, updatedData: Partial<Oportunidade>) => {
    try {
      const res = await fetch(`/api/oportunidades/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        toast.success("Oportunidade atualizada com sucesso.");
        setIsDrawerOpen(false);
        onRefresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Erro ao salvar alterações.");
      }
    } catch {
      toast.error("Erro de conexão ao salvar.");
    }
  };

  const handleDeleteOpportunity = async (id: number) => {
    try {
      const res = await fetch(`/api/oportunidades/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        toast.success("Oportunidade removida.");
        setIsDrawerOpen(false);
        onRefresh();
      } else {
        toast.error("Erro ao remover oportunidade.");
      }
    } catch {
      toast.error("Erro de rede.");
    }
  };

  const handleDropCard = async (oportunidadeId: number, targetCol: string) => {
    const opportunity = localOpportunities.find(op => op.id === oportunidadeId);
    if (!opportunity) return;
    if (opportunity.coluna_kanban === targetCol) return;

    // Regra 1: Bloqueio de Aprovação por garantias
    if (targetCol === "aprovada") {
      try {
        const checklist: GarantiaItem[] = JSON.parse(opportunity.checklist_garantias || "[]");
        const pendentes = checklist.filter(item => !item.validado).map(item => item.item);
        if (pendentes.length > 0) {
          toast.error(`Valide o checklist de garantias antes de avançar para Aprovada. Pendentes: ${pendentes.join(", ")}`);
          return;
        }
      } catch {
        toast.error("Erro ao processar as garantias.");
        return;
      }
    }

    // Standard move
    await executeMove(oportunidadeId, targetCol);
  };

  const executeMove = async (oportunidadeId: number, targetCol: string, motivoPerda?: string, dataRecusa?: string) => {
    const original = [...localOpportunities];
    
    // Optimistic Update
    setLocalOpportunities(prev =>
      prev.map(op =>
        op.id === oportunidadeId ? { ...op, coluna_kanban: targetCol } : op
      )
    );

    try {
      const res = await fetch(`/api/oportunidades/${oportunidadeId}/mover`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coluna_kanban: targetCol,
          motivo_perda: motivoPerda,
          data_recusa: dataRecusa
        })
      });

      if (res.ok) {
        toast.success("Card movido com sucesso!");
        onRefresh();
      } else {
        const err = await res.json();
        toast.error(err.message || err.error || "Erro ao mover card.");
        setLocalOpportunities(original); // Revert
      }
    } catch {
      toast.error("Erro ao persistir movimentação.");
      setLocalOpportunities(original); // Revert
    }
  };

  const handleConfirmRecusa = async (motivo: string, dataRecusa: string) => {
    if (!pendingMove) return;
    setIsModalOpen(false);
    await executeMove(pendingMove.id, pendingMove.targetCol, motivo, dataRecusa);
    setPendingMove(null);
  };

  return (
    <div className="kanban-board">
      {COLUNAS.map(col => {
        const opsInCol = localOpportunities.filter(op => op.coluna_kanban === col.id);
        return (
          <KanbanColuna
            key={col.id}
            id={col.id}
            label={col.label}
            color={col.color}
            oportunidades={opsInCol}
            onDropCard={handleDropCard}
            onCardClick={handleCardClick}
          />
        );
      })}

      <DrawerOportunidade
        oportunidade={selectedOpportunity}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveOpportunity}
        onDelete={handleDeleteOpportunity}
      />

      <ModalNaoAprovada
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPendingMove(null);
        }}
        onConfirm={handleConfirmRecusa}
      />
    </div>
  );
}
