"use client";

import { useState, useEffect } from "react";
import { Plus, Building2, User, AlertCircle, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";

interface InitialEmpresaData {
  id: number;
  razao_social?: string;
  razaoSocial?: string;
  cnpj?: string;
  representante?: string;
  cpfRepresentante?: string;
  telefone?: string;
  email?: string;
  tipo?: "PJ" | "PF";
}

interface FormNovaOportunidadeProps {
  onSuccess: () => void;
  initialEmpresa?: InitialEmpresaData | null;
  triggerButton?: React.ReactNode;
}

const PIPELINE_LABELS: Record<string, string> = {
  prospect: "Prospect",
  em_preenchimento: "Em Preenchimento",
  em_analise: "Em Análise",
  aprovada: "Aprovada",
  aguardando_documentacao: "Aguardando Documentação",
  liberado: "Liberado"
};

const PIPELINE_COLORS: Record<string, string> = {
  prospect: "#64748b",
  em_preenchimento: "#3b82f6",
  em_analise: "#f59e0b",
  aprovada: "#10b981",
  aguardando_documentacao: "#8b5cf6",
  liberado: "#2563eb"
};

// Formatação de máscaras
function maskCnpj(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function maskCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export default function FormNovaOportunidade({
  onSuccess,
  initialEmpresa,
  triggerButton
}: FormNovaOportunidadeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState<"PJ" | "PF">("PJ");

  // Campos do formulário
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [representante, setRepresentante] = useState("");
  const [cpfRepresentante, setCpfRepresentante] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  // Campos específicos PF
  const [nomePf, setNomePf] = useState("");
  const [cpfPf, setCpfPf] = useState("");

  // Campos da Proposta
  const [valorSolicitado, setValorSolicitado] = useState("");
  const [canal, setCanal] = useState("Capital de Giro BDMG");

  // Estados de duplicidade e vínculo
  const [empresaExistente, setEmpresaExistente] = useState<any | null>(null);
  const [empresaIdVinculada, setEmpresaIdVinculada] = useState<number | null>(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset ou inicialização quando abre o modal
  const openModal = () => {
    setError("");
    setEmpresaExistente(null);

    if (initialEmpresa) {
      const isPf = initialEmpresa.tipo === "PF" || (initialEmpresa.cnpj && initialEmpresa.cnpj.length < 14);
      setTipoPessoa(isPf ? "PF" : "PJ");
      setEmpresaIdVinculada(initialEmpresa.id);

      if (isPf) {
        setNomePf(initialEmpresa.razao_social || initialEmpresa.razaoSocial || "");
        setCpfPf(maskCpf(initialEmpresa.cnpj || ""));
        setCanal("Consórcio");
      } else {
        setRazaoSocial(initialEmpresa.razao_social || initialEmpresa.razaoSocial || "");
        setCnpj(maskCnpj(initialEmpresa.cnpj || ""));
        setRepresentante(initialEmpresa.representante || "");
        setCpfRepresentante(initialEmpresa.cpfRepresentante ? maskCpf(initialEmpresa.cpfRepresentante) : "");
        setCanal("Capital de Giro BDMG");
      }

      setTelefone(initialEmpresa.telefone ? maskPhone(initialEmpresa.telefone) : "");
      setEmail(initialEmpresa.email || "");
      setValorSolicitado("");
    } else {
      setEmpresaIdVinculada(null);
      setRazaoSocial("");
      setCnpj("");
      setRepresentante("");
      setCpfRepresentante("");
      setNomePf("");
      setCpfPf("");
      setTelefone("");
      setEmail("");
      setValorSolicitado("");
      setCanal("Capital de Giro BDMG");
    }

    setIsOpen(true);
  };

  // Handler onBlur CNPJ
  const handleCnpjBlur = async () => {
    const clean = cnpj.replace(/\D/g, "");
    if (clean.length !== 14 || empresaIdVinculada) return;

    setCheckingDuplicate(true);
    try {
      const res = await fetch(`/api/empresas?cnpj=${clean}`);
      const data = await res.json();
      if (data && data.found && data.empresa) {
        setEmpresaExistente(data.empresa);
      } else {
        setEmpresaExistente(null);
      }
    } catch {
      // Ignora falha de rede silenciosa na checagem
    } finally {
      setCheckingDuplicate(false);
    }
  };

  // Handler onBlur CPF
  const handleCpfBlur = async () => {
    const clean = cpfPf.replace(/\D/g, "");
    if (clean.length !== 11 || empresaIdVinculada) return;

    setCheckingDuplicate(true);
    try {
      const res = await fetch(`/api/empresas?cpf=${clean}`);
      const data = await res.json();
      if (data && data.found && data.empresa) {
        setEmpresaExistente(data.empresa);
      } else {
        setEmpresaExistente(null);
      }
    } catch {
      // Ignora falha de rede silenciosa
    } finally {
      setCheckingDuplicate(false);
    }
  };

  // Ação: Criar nova proposta para este cliente encontrado
  const usarEmpresaExistente = () => {
    if (!empresaExistente) return;

    if (tipoPessoa === "PJ") {
      setRazaoSocial(empresaExistente.razaoSocial || empresaExistente.razao_social || "");
      setCnpj(maskCnpj(empresaExistente.cnpj || cnpj));
      setRepresentante(empresaExistente.representante || "");
      setCpfRepresentante(empresaExistente.cpfRepresentante ? maskCpf(empresaExistente.cpfRepresentante) : "");
    } else {
      setNomePf(empresaExistente.razaoSocial || empresaExistente.razao_social || "");
      setCpfPf(maskCpf(empresaExistente.cnpj || cpfPf));
    }

    setTelefone(empresaExistente.telefone ? maskPhone(empresaExistente.telefone) : telefone);
    setEmail(empresaExistente.email || email);
    setEmpresaIdVinculada(empresaExistente.id);
    setEmpresaExistente(null); // fecha o banner inline
  };

  // Ação: Cadastrar como novo lead
  const ignorarDuplicata = () => {
    setEmpresaExistente(null);
    setEmpresaIdVinculada(null);
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const valorNum = parseFloat(valorSolicitado.replace(/[^\d,\.]/g, "").replace(",", "."));
    if (!valorNum || isNaN(valorNum) || valorNum <= 0) {
      setError("Informe um valor solicitado válido.");
      return;
    }

    if (tipoPessoa === "PJ" && !razaoSocial.trim()) {
      setError("Razão Social é obrigatória.");
      return;
    }
    if (tipoPessoa === "PF" && !nomePf.trim()) {
      setError("Nome Completo é obrigatório.");
      return;
    }

    setLoading(true);

    try {
      let targetEmpresaId = empresaIdVinculada;

      // Se NÃO for vinculada a empresa existente, cadastra nova empresa primeiro
      if (!targetEmpresaId) {
        const empPayload: any = {
          razao_social: tipoPessoa === "PJ" ? razaoSocial.trim() : nomePf.trim(),
          cnpj: tipoPessoa === "PJ" ? cnpj : cpfPf,
          faturamento: 0,
          contatos: []
        };

        const nomeContato = tipoPessoa === "PJ" ? (representante || razaoSocial) : nomePf;
        if (nomeContato || telefone) {
          empPayload.contatos.push({
            nome: nomeContato.trim(),
            whatsapp: telefone.replace(/\D/g, ""),
            cargo: tipoPessoa === "PJ" ? "Representante Legal" : "Cliente PF"
          });
        }

        const resEmp = await fetch("/api/empresas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(empPayload)
        });

        const dataEmp = await resEmp.json();
        if (!resEmp.ok || !dataEmp.id) {
          throw new Error(dataEmp.error || "Erro ao cadastrar novo lead/empresa.");
        }
        targetEmpresaId = dataEmp.id;
      }

      // Cria a proposta (oportunidade) vinculada ao targetEmpresaId
      const resOp = await fetch("/api/oportunidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa_id: targetEmpresaId,
          valor_solicitado: valorNum,
          canal: canal || (tipoPessoa === "PJ" ? "Capital de Giro BDMG" : "Consórcio")
        })
      });

      const dataOp = await resOp.json();
      if (!resOp.ok) {
        throw new Error(dataOp.error || "Erro ao criar oportunidade.");
      }

      if (empresaIdVinculada) {
        toast.success("Nova proposta vinculada com sucesso ao cliente existente!");
      } else {
        toast.success("Novo lead e oportunidade criados com sucesso!");
      }

      setIsOpen(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Erro técnico ao salvar proposta.");
      toast.error(err.message || "Erro ao processar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {triggerButton ? (
        <div onClick={openModal} style={{ display: "inline-block" }}>
          {triggerButton}
        </div>
      ) : (
        <button className="crm-btn crm-btn-primary" onClick={openModal}>
          <Plus size={16} /> Novo Lead / Proposta
        </button>
      )}

      {isOpen && (
        <div className="crm-modal-overlay">
          <div className="crm-modal" style={{ maxWidth: "600px", width: "95%" }}>
            
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
              <div>
                <h3 className="crm-modal-title" style={{ margin: 0 }}>
                  {empresaIdVinculada ? "Nova Proposta para Cliente Cadastrado" : "Novo Lead / Oportunidade"}
                </h3>
                <p style={{ color: "var(--crm-muted)", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>
                  {empresaIdVinculada
                    ? "Esta proposta será vinculada ao cadastro existente, mantendo o histórico unificado."
                    : "Cadastre uma nova solicitação de crédito ou vincule a um cliente já existente."}
                </p>
              </div>
              <button
                type="button"
                className="crm-btn-ghost"
                onClick={() => setIsOpen(false)}
                style={{ padding: "0.3rem", color: "var(--crm-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Toggle PJ / PF (desabilitado se já veio empresa vinculada) */}
            {!empresaIdVinculada && (
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", borderBottom: "1px solid var(--crm-border)", paddingBottom: "1rem" }}>
                <button
                  type="button"
                  onClick={() => { setTipoPessoa("PJ"); setCanal("Capital de Giro BDMG"); setEmpresaExistente(null); }}
                  className={`crm-btn ${tipoPessoa === "PJ" ? "crm-btn-primary" : "crm-btn-secondary"}`}
                  style={{ flex: 1, padding: "0.6rem" }}
                >
                  <Building2 size={16} /> Pessoa Jurídica – BDMG
                </button>
                <button
                  type="button"
                  onClick={() => { setTipoPessoa("PF"); setCanal("Consórcio"); setEmpresaExistente(null); }}
                  className={`crm-btn ${tipoPessoa === "PF" ? "crm-btn-primary" : "crm-btn-secondary"}`}
                  style={{ flex: 1, padding: "0.6rem" }}
                >
                  <User size={16} /> Pessoa Física
                </button>
              </div>
            )}

            {/* Banner de Vinculação Confirmada */}
            {empresaIdVinculada && (
              <div style={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--crm-text)" }}>
                  <CheckCircle2 size={18} style={{ color: "#10b981", flexShrink: 0 }} />
                  <span>
                    Proposta vinculada a: <strong>{tipoPessoa === "PJ" ? razaoSocial : nomePf}</strong>
                  </span>
                </div>
                {!initialEmpresa && (
                  <button
                    type="button"
                    onClick={() => setEmpresaIdVinculada(null)}
                    style={{ background: "transparent", border: "none", color: "var(--crm-muted)", fontSize: "0.75rem", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Desvincular
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* CAMPOS PJ */}
              {tipoPessoa === "PJ" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className="crm-form-group" style={{ margin: 0 }}>
                      <label className="crm-label">
                        CNPJ * {checkingDuplicate && <span style={{ fontSize: "0.75rem", color: "var(--crm-blue)" }}>(verificando...)</span>}
                      </label>
                      <input
                        type="text"
                        className="crm-input"
                        placeholder="00.000.000/0000-00"
                        value={cnpj}
                        onChange={(e) => setCnpj(maskCnpj(e.target.value))}
                        onBlur={handleCnpjBlur}
                        required
                        disabled={!!empresaIdVinculada && !!initialEmpresa}
                      />
                    </div>
                    <div className="crm-form-group" style={{ margin: 0 }}>
                      <label className="crm-label">Razão Social *</label>
                      <input
                        type="text"
                        className="crm-input"
                        placeholder="Nome da empresa"
                        value={razaoSocial}
                        onChange={(e) => setRazaoSocial(e.target.value)}
                        required
                        disabled={!!empresaIdVinculada && !!initialEmpresa}
                      />
                    </div>
                  </div>

                  {/* BANNER INLINE DE CLIENTE EXISTENTE (PJ) */}
                  {empresaExistente && (
                    <div style={{
                      backgroundColor: "#fffbeb",
                      border: "1px solid #f59e0b",
                      borderRadius: "8px",
                      padding: "1rem",
                      animation: "fadeIn 0.2s ease"
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <AlertCircle size={20} style={{ color: "#d97706", flexShrink: 0, marginTop: "2px" }} />
                        <div>
                          <strong style={{ color: "#92400e", fontSize: "0.9rem", display: "block" }}>
                            Cliente já cadastrado no CRM!
                          </strong>
                          <div style={{ fontSize: "0.85rem", color: "#78350f", marginTop: "0.2rem" }}>
                            <span><strong>Empresa:</strong> {empresaExistente.razaoSocial || empresaExistente.razao_social}</span>
                            <span style={{ margin: "0 0.5rem" }}>•</span>
                            <span><strong>CNPJ:</strong> {empresaExistente.cnpj}</span>
                          </div>
                          {empresaExistente.ultima_etapa && (
                            <div style={{ marginTop: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span style={{ fontSize: "0.8rem", color: "#92400e" }}>Última proposta:</span>
                              <span
                                className="crm-badge"
                                style={{
                                  backgroundColor: PIPELINE_COLORS[empresaExistente.ultima_etapa] || "#64748b",
                                  color: "#fff",
                                  fontSize: "0.7rem",
                                  padding: "0.15rem 0.5rem"
                                }}
                              >
                                {PIPELINE_LABELS[empresaExistente.ultima_etapa] || empresaExistente.ultima_etapa}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
                        <button
                          type="button"
                          className="crm-btn crm-btn-primary"
                          onClick={usarEmpresaExistente}
                          style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}
                        >
                          ✓ Criar nova proposta para este cliente
                        </button>
                        <button
                          type="button"
                          className="crm-btn crm-btn-secondary"
                          onClick={ignorarDuplicata}
                          style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}
                        >
                          Cadastrar como novo lead
                        </button>
                      </div>
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className="crm-form-group" style={{ margin: 0 }}>
                      <label className="crm-label">Representante Legal</label>
                      <input
                        type="text"
                        className="crm-input"
                        placeholder="Nome do representante"
                        value={representante}
                        onChange={(e) => setRepresentante(e.target.value)}
                      />
                    </div>
                    <div className="crm-form-group" style={{ margin: 0 }}>
                      <label className="crm-label">CPF do Representante</label>
                      <input
                        type="text"
                        className="crm-input"
                        placeholder="000.000.000-00"
                        value={cpfRepresentante}
                        onChange={(e) => setCpfRepresentante(maskCpf(e.target.value))}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* CAMPOS PF */}
              {tipoPessoa === "PF" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className="crm-form-group" style={{ margin: 0 }}>
                      <label className="crm-label">
                        CPF * {checkingDuplicate && <span style={{ fontSize: "0.75rem", color: "var(--crm-blue)" }}>(verificando...)</span>}
                      </label>
                      <input
                        type="text"
                        className="crm-input"
                        placeholder="000.000.000-00"
                        value={cpfPf}
                        onChange={(e) => setCpfPf(maskCpf(e.target.value))}
                        onBlur={handleCpfBlur}
                        required
                        disabled={!!empresaIdVinculada && !!initialEmpresa}
                      />
                    </div>
                    <div className="crm-form-group" style={{ margin: 0 }}>
                      <label className="crm-label">Nome Completo *</label>
                      <input
                        type="text"
                        className="crm-input"
                        placeholder="Nome do cliente"
                        value={nomePf}
                        onChange={(e) => setNomePf(e.target.value)}
                        required
                        disabled={!!empresaIdVinculada && !!initialEmpresa}
                      />
                    </div>
                  </div>

                  {/* BANNER INLINE DE CLIENTE EXISTENTE (PF) */}
                  {empresaExistente && (
                    <div style={{
                      backgroundColor: "#fffbeb",
                      border: "1px solid #f59e0b",
                      borderRadius: "8px",
                      padding: "1rem",
                      animation: "fadeIn 0.2s ease"
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <AlertCircle size={20} style={{ color: "#d97706", flexShrink: 0, marginTop: "2px" }} />
                        <div>
                          <strong style={{ color: "#92400e", fontSize: "0.9rem", display: "block" }}>
                            Cliente já cadastrado no CRM!
                          </strong>
                          <div style={{ fontSize: "0.85rem", color: "#78350f", marginTop: "0.2rem" }}>
                            <span><strong>Nome:</strong> {empresaExistente.razaoSocial || empresaExistente.razao_social}</span>
                            <span style={{ margin: "0 0.5rem" }}>•</span>
                            <span><strong>Documento:</strong> {empresaExistente.cnpj}</span>
                          </div>
                          {empresaExistente.ultima_etapa && (
                            <div style={{ marginTop: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span style={{ fontSize: "0.8rem", color: "#92400e" }}>Última proposta:</span>
                              <span
                                className="crm-badge"
                                style={{
                                  backgroundColor: PIPELINE_COLORS[empresaExistente.ultima_etapa] || "#64748b",
                                  color: "#fff",
                                  fontSize: "0.7rem",
                                  padding: "0.15rem 0.5rem"
                                }}
                              >
                                {PIPELINE_LABELS[empresaExistente.ultima_etapa] || empresaExistente.ultima_etapa}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
                        <button
                          type="button"
                          className="crm-btn crm-btn-primary"
                          onClick={usarEmpresaExistente}
                          style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}
                        >
                          ✓ Criar nova proposta para este cliente
                        </button>
                        <button
                          type="button"
                          className="crm-btn crm-btn-secondary"
                          onClick={ignorarDuplicata}
                          style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}
                        >
                          Cadastrar como novo lead
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* CONTATOS */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="crm-form-group" style={{ margin: 0 }}>
                  <label className="crm-label">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    className="crm-input"
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(maskPhone(e.target.value))}
                  />
                </div>
                <div className="crm-form-group" style={{ margin: 0 }}>
                  <label className="crm-label">E-mail</label>
                  <input
                    type="email"
                    className="crm-input"
                    placeholder="email@cliente.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* DETALHES DA NOVA PROPOSTA */}
              <div style={{
                borderTop: "1px dashed var(--crm-border)",
                paddingTop: "1rem",
                marginTop: "0.5rem",
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                gap: "1rem"
              }}>
                <div className="crm-form-group" style={{ margin: 0 }}>
                  <label className="crm-label">Valor Solicitado (R$) *</label>
                  <input
                    type="text"
                    className="crm-input"
                    placeholder="Ex: 150.000,00"
                    value={valorSolicitado}
                    onChange={(e) => setValorSolicitado(e.target.value)}
                    required
                  />
                </div>

                <div className="crm-form-group" style={{ margin: 0 }}>
                  <label className="crm-label">Tipo de Operação / Produto</label>
                  <select
                    className="crm-select"
                    value={canal}
                    onChange={(e) => setCanal(e.target.value)}
                  >
                    <option value="Capital de Giro BDMG">Capital de Giro BDMG</option>
                    <option value="Home Equity">Home Equity (Garantia Imóvel)</option>
                    <option value="Financiamento Imobiliário">Financiamento Imobiliário</option>
                    <option value="Consórcio">Consórcio</option>
                    <option value="Crédito Veicular">Crédito Veicular</option>
                    <option value="Pronampe">Pronampe</option>
                    <option value="Procred 360">Procred 360</option>
                  </select>
                </div>
              </div>

              {error && (
                <div style={{ color: "var(--crm-red)", fontSize: "0.85rem", fontWeight: "600", marginTop: "0.25rem" }}>
                  {error}
                </div>
              )}

              {/* Botões de Ação */}
              <div className="crm-modal-actions" style={{ marginTop: "1rem" }}>
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
                  disabled={loading}
                >
                  {loading
                    ? "Salvando..."
                    : empresaIdVinculada
                    ? "Criar Nova Proposta"
                    : "Cadastrar Lead"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
