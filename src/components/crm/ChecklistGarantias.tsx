import { GarantiaItem } from "@/types";

interface ChecklistProps {
  checklist: GarantiaItem[];
  onChange?: (checklist: GarantiaItem[]) => void;
  readOnly?: boolean;
}

export default function ChecklistGarantias({ checklist, onChange, readOnly = false }: ChecklistProps) {
  const allValidated = checklist.every(item => item.validado);

  const handleToggle = (index: number) => {
    if (readOnly || !onChange) return;
    const updated = [...checklist];
    updated[index].validado = !updated[index].validado;
    onChange(updated);
  };

  return (
    <div style={{ padding: "1rem", backgroundColor: "var(--crm-surface)", borderRadius: "6px", border: "1px solid var(--crm-border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <span className="crm-label">Garantias BDMG</span>
        {allValidated ? (
          <span style={{ color: "var(--crm-green)", fontSize: "0.8rem", fontWeight: "700" }}>
            ✓ Todas as garantias validadas
          </span>
        ) : (
          <span style={{ color: "var(--crm-red)", fontSize: "0.8rem", fontWeight: "700" }}>
            ⚠ Garantias pendentes
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {checklist.map((item, idx) => (
          <label
            key={item.item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.9rem",
              cursor: readOnly ? "default" : "pointer",
              color: item.validado ? "var(--crm-text)" : "var(--crm-muted)"
            }}
          >
            <input
              type="checkbox"
              checked={item.validado}
              disabled={readOnly}
              onChange={() => handleToggle(idx)}
              style={{ width: "16px", height: "16px", cursor: readOnly ? "default" : "pointer" }}
            />
            {item.item}
          </label>
        ))}
      </div>
    </div>
  );
}
