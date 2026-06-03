import { useState, useEffect } from "react";
import { X, Trash2, Calendar, CheckCircle2, AlertTriangle } from "lucide-react";
import { Oportunidade, GarantiaItem } from "@/types";
import ChecklistGarantias from "./ChecklistGarantias";

interface DrawerOportunidadeProps {
  oportunidade: Oportunidade | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: Partial<Oportunidade>) => void;
  onDelete: (id: number) => void;
}

export default function DrawerOportunidade({
  oportunidade,
  isOpen,
  onClose,
  onSave,
  onDelete
}: DrawerOportunidadeProps) {
  const [valSolicitado, setValSolicitado] = useState<number>(0);
  const [valAprovado, setValAprovado] = useState<string>("");
  const [comissao, setComissao] = useState<number>(0);
  const [repasse, setRepasse] = useState<"pendente" | "recebido">("pendente");
  const [checklist, setChecklist] = useState<GarantiaItem[]>([]);

  useEffect(() => {
    if (oportunidade) {
      setValSolicitado(oportunidade.valor_solicitado);
      setValAprovado(oportunidade.valor_aprovado !== null ? oportunidade.valor_aprovado.toString() : "");
      setComissao(oportunidade.comissao_esperada);
      setRepasse(oportunidade.status_repasse);
      try {
        setChecklist(JSON.parse(oportunidade.checklist_garantias || "[]"));
      } catch {
        setChecklist([]);
      }
    }
  }, [oportunidade]);

  if (!isOpen || !oportunidade) return null;

  const handleSave = () => {
    const updatedData: Partial<Oportunidade> = {
      valor_solicitado: valSolicitado,
      valor_aprovado: valAprovado !== "" ? parseFloat(valAprovado) : null,
      comissao_esperada: comissao,
      status_repasse: repasse,
      checklist_garantias: JSON.stringify(checklist)
    };
    onSave(oportunidade.id, updatedData);
  };

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  const formatDate = (isoStr: string) => {
    if (!isoStr) return "";
    const [year, month, day] = isoStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <div className="crm-drawer-overlay" onClick={onClose} />
      <div className="crm-drawer">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--crm-text)", margin: 0 }}>
              Detalhes da Oportunidade
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--crm-muted)", margin: "0.2rem 0 0 0" }}>
              {oportunidade.razao_social}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--crm-muted)", cursor: "pointer" }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", flexGrow: 1 }}>
          {/* Valor Solicitado */}
          <div className="crm-form-group">
            <label className="crm-label">Valor Solicitado (R$)</label>
            <input
              type="number"
              className="crm-input"
              value={valSolicitado}
              onChange={(e) => setValSolicitado(parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* Valor Aprovado */}
          <div className="crm-form-group">
            <label className="crm-label">Valor Aprovado (R$)</label>
            <input
              type="number"
              className="crm-input"
              placeholder="Não avaliado/aprovado ainda"
              value={valAprovado}
              onChange={(e) => setValAprovado(e.target.value)}
            />
          </div>

          {/* Comissão Esperada */}
          <div className="crm-form-group">
            <label className="crm-label">Comissão Esperada (R$)</label>
            <input
              type="number"
              className="crm-input"
              value={comissao}
              onChange={(e) => setComissao(parseFloat(e.target.value) || 0)}
            />
            <span style={{ fontSize: "0.8rem", color: "var(--crm-green)", fontWeight: "600", marginTop: "0.25rem" }}>
              Comissão Prevista: {formatBRL(comissao)}
            </span>
          </div>

          {/* Status de Repasse */}
          <div className="crm-form-group">
            <label className="crm-label">Status do Repasse</label>
            <select
              className="crm-select"
              value={repasse}
              onChange={(e: any) => setRepasse(e.target.value)}
            >
              <option value="pendente">Pendente</option>
              <option value="recebido">Recebido (Comissão em Caixa)</option>
            </select>
          </div>

          {/* Checklist de Garantias */}
          <ChecklistGarantias checklist={checklist} onChange={setChecklist} />

          {/* Follow-up info if present */}
          {oportunidade.followup_data && (
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              backgroundColor: "rgba(251, 191, 36, 0.1)",
              border: "1px solid rgba(251, 191, 36, 0.2)",
              borderRadius: "6px",
              padding: "1rem",
              color: "var(--crm-amber)"
            }}>
              <Calendar size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ fontSize: "0.85rem", display: "block" }}>Follow-up Agendado (Regra 30 Dias)</strong>
                <p style={{ fontSize: "0.8rem", margin: "0.25rem 0 0 0", lineHeight: "1.4" }}>
                  Nova tentativa permitida a partir de: <strong>{formatDate(oportunidade.followup_data)}</strong>
                </p>
              </div>
            </div>
          )}

          {/* Motivo Perda / Recusa info if present */}
          {oportunidade.coluna_kanban === "nao_aprovada" && oportunidade.motivo_perda && (
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "6px",
              padding: "1rem",
              color: "var(--crm-red)"
            }}>
              <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ fontSize: "0.85rem", display: "block" }}>Histórico de Recusa BDMG</strong>
                <p style={{ fontSize: "0.8rem", margin: "0.25rem 0 0 0", lineHeight: "1.4" }}>
                  <strong>Motivo:</strong> {oportunidade.motivo_perda}
                </p>
                {oportunidade.data_recusa && (
                  <p style={{ fontSize: "0.75rem", margin: "0.25rem 0 0 0", opacity: 0.8 }}>
                    Registrado em: {formatDate(oportunidade.data_recusa)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid var(--crm-border)",
          paddingTop: "1.5rem",
          marginTop: "2rem"
        }}>
          <button 
            type="button" 
            className="crm-btn crm-btn-danger"
            onClick={() => {
              if (confirm("Tem certeza que deseja excluir esta oportunidade? Esta ação é irreversível.")) {
                onDelete(oportunidade.id);
              }
            }}
          >
            <Trash2 size={16} /> Excluir
          </button>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="button" className="crm-btn crm-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="crm-btn crm-btn-primary" onClick={handleSave}>
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
