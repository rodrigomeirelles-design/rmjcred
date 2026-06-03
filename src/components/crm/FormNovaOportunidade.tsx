import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Empresa } from "@/types";

interface FormNovaOportunidadeProps {
  onSuccess: () => void;
}

export default function FormNovaOportunidade({ onSuccess }: FormNovaOportunidadeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaId, setEmpresaId] = useState<string>("");
  const [valorSolicitado, setValorSolicitado] = useState<string>("");
  const [comissaoEsperada, setComissaoEsperada] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load companies
      fetch("/api/empresas")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setEmpresas(data);
            if (data.length > 0) {
              setEmpresaId(data[0].id.toString());
            }
          }
        })
        .catch(() => setError("Erro ao carregar lista de empresas."));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresaId || !valorSolicitado || !comissaoEsperada) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/oportunidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa_id: parseInt(empresaId, 10),
          valor_solicitado: parseFloat(valorSolicitado),
          comissao_esperada: parseFloat(comissaoEsperada)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setIsOpen(false);
        setValorSolicitado("");
        setComissaoEsperada("");
        onSuccess();
      } else {
        setError(data.error || "Erro ao criar oportunidade.");
      }
    } catch {
      setError("Ocorreu um erro técnico ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="crm-btn crm-btn-primary" onClick={() => setIsOpen(true)}>
        <Plus size={16} /> Nova Oportunidade
      </button>

      {isOpen && (
        <div className="crm-modal-overlay">
          <div className="crm-modal">
            <h3 className="crm-modal-title">Nova Oportunidade BDMG</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              
              <div className="crm-form-group">
                <label className="crm-label">Selecione a Empresa</label>
                {empresas.length === 0 ? (
                  <div style={{ fontSize: "0.9rem", color: "var(--crm-red)" }}>
                    Nenhuma empresa cadastrada. Cadastre uma empresa primeiro.
                  </div>
                ) : (
                  <select
                    className="crm-select"
                    value={empresaId}
                    onChange={(e) => setEmpresaId(e.target.value)}
                    required
                  >
                    {empresas.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.razao_social} ({emp.cnpj})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Valor Solicitado (R$)</label>
                <input
                  type="number"
                  className="crm-input"
                  placeholder="Ex: 150000"
                  value={valorSolicitado}
                  onChange={(e) => setValorSolicitado(e.target.value)}
                  required
                />
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Comissão Esperada (R$)</label>
                <input
                  type="number"
                  className="crm-input"
                  placeholder="Ex: 6000"
                  value={comissaoEsperada}
                  onChange={(e) => setComissaoEsperada(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div style={{ color: "var(--crm-red)", fontSize: "0.85rem", fontWeight: "600" }}>
                  {error}
                </div>
              )}

              <div className="crm-modal-actions">
                <button
                  type="button"
                  className="crm-btn crm-btn-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="crm-btn crm-btn-primary"
                  disabled={loading || empresas.length === 0}
                >
                  {loading ? "Salvando..." : "Criar Oportunidade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
