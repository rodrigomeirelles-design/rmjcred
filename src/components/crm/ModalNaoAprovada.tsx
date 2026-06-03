import { useState } from "react";

interface ModalNaoAprovadaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string, dataRecusa: string) => void;
}

export default function ModalNaoAprovada({ isOpen, onClose, onConfirm }: ModalNaoAprovadaProps) {
  const [motivo, setMotivo] = useState("");
  const [dataRecusa, setDataRecusa] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (motivo.trim().length < 5) {
      setError("O motivo da perda deve ter no mínimo 5 caracteres.");
      return;
    }
    if (!dataRecusa) {
      setError("A data de recusa é obrigatória.");
      return;
    }
    setError("");
    onConfirm(motivo, dataRecusa);
    setMotivo("");
  };

  return (
    <div className="crm-modal-overlay">
      <div className="crm-modal" style={{ maxWidth: "450px" }}>
        <h3 className="crm-modal-title">Registrar Recusa BDMG</h3>
        
        <div style={{
          backgroundColor: "rgba(251, 191, 36, 0.1)",
          border: "1px solid rgba(251, 191, 36, 0.3)",
          color: "var(--crm-amber)",
          padding: "0.75rem",
          borderRadius: "6px",
          fontSize: "0.85rem",
          marginBottom: "1.25rem",
          lineHeight: "1.4"
        }}>
          <strong>Aviso:</strong> Ao registrar a recusa, um lembrete automático de follow-up (Regra dos 30 dias BDMG) será agendado para o cliente.
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="crm-form-group">
            <label className="crm-label">Motivo da Recusa (Mínimo 5 caracteres)</label>
            <textarea
              className="crm-textarea"
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Descreva detalhadamente o motivo da recusa ou enquadramento inadequado..."
              required
            />
          </div>

          <div className="crm-form-group">
            <label className="crm-label">Data da Recusa</label>
            <input
              type="date"
              className="crm-input"
              value={dataRecusa}
              onChange={(e) => setDataRecusa(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ color: "var(--crm-red)", fontSize: "0.85rem", fontWeight: "600" }}>
              {error}
            </div>
          )}

          <div className="crm-modal-actions">
            <button type="button" className="crm-btn crm-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="crm-btn crm-btn-primary" style={{ backgroundColor: "var(--crm-red)" }}>
              Confirmar Recusa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
