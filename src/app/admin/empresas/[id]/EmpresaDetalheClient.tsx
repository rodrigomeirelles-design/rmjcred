"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { ArrowLeft, Building2, UserPlus, PhoneCall, Calendar, ShieldAlert } from "lucide-react";
import "../../crm.css";

interface DetailProps {
  id: string;
}

export default function EmpresaDetalheClient({ id }: DetailProps) {
  const [empresa, setEmpresa] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // New contact fields
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cargo, setCargo] = useState("");
  const [contLoading, setContLoading] = useState(false);

  const fetchDetails = () => {
    fetch(`/api/empresas/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setEmpresa(data);
        } else {
          toast.error("Empresa não encontrada.");
        }
      })
      .catch(() => toast.error("Erro ao carregar dados da empresa."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !whatsapp || !cargo) {
      toast.error("Preencha todos os campos do contato.");
      return;
    }

    setContLoading(true);

    try {
      const res = await fetch("/api/contatos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa_id: parseInt(id, 10),
          nome,
          whatsapp,
          cargo
        })
      });

      if (res.ok) {
        toast.success("Contato adicionado!");
        setNome("");
        setWhatsapp("");
        setCargo("");
        fetchDetails();
      } else {
        const err = await res.json();
        toast.error(err.error || "Erro ao adicionar contato.");
      }
    } catch {
      toast.error("Erro técnico ao salvar.");
    } finally {
      setContLoading(false);
    }
  };

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  const translateStatus = (col: string) => {
    const statuses: Record<string, string> = {
      prospect: "Prospect",
      em_preenchimento: "Em Preenchimento",
      em_analise: "Em Análise",
      aprovada: "Aprovada",
      aguardando_documentacao: "Aguardando Documentação",
      liberado: "Liberado"
    };
    return statuses[col] || col;
  };

  const formatDate = (isoStr: string) => {
    if (!isoStr) return "";
    const [year, month, day] = isoStr.split("-");
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="crm-theme" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ color: "var(--crm-muted)" }}>Carregando dados da empresa...</div>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="crm-theme" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ color: "var(--crm-red)" }}>Empresa não encontrada. <Link href="/admin/empresas" style={{ color: "#fff" }}>Voltar</Link></div>
      </div>
    );
  }

  return (
    <div className="crm-theme">
      <Toaster richColors position="top-right" />
      
      {/* Navbar */}
      <nav className="crm-nav">
        <div className="crm-nav-logo">
          <Building2 size={24} style={{ color: "var(--crm-amber)" }} />
          CRM RMJ <span style={{ color: "var(--crm-muted)", fontSize: "0.8rem", fontWeight: "normal" }}>Cadastro PJ</span>
        </div>
        <div className="crm-nav-links">
          <Link href="/admin" className="crm-nav-link">Pipeline</Link>
          <Link href="/admin/empresas" className="crm-nav-link active">Empresas</Link>
          <Link href="/" className="crm-nav-link" target="_blank">Ver Site</Link>
        </div>
      </nav>

      <div className="crm-container">
        {/* Header Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <Link href="/admin/empresas" className="crm-btn crm-btn-secondary" style={{ padding: "0.5rem" }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--crm-text)", margin: 0 }}>
              {empresa.razao_social}
            </h1>
            <p style={{ color: "var(--crm-muted)", fontSize: "0.85rem", margin: "0.2rem 0 0 0" }}>
              Ficha cadastral e oportunidades de crédito BDMG.
            </p>
          </div>
        </div>

        {/* Two Columns Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
          
          {/* Main Info */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            
            {/* Dados Cadastrais */}
            <div style={{ backgroundColor: "var(--crm-card)", border: "1px solid var(--crm-border)", borderRadius: "8px", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1.25rem", borderBottom: "1px solid var(--crm-border)", paddingBottom: "0.5rem" }}>
                Dados da Empresa
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <span className="crm-label" style={{ display: "block" }}>Razão Social</span>
                  <span style={{ fontWeight: "700" }}>{empresa.razao_social}</span>
                </div>
                <div>
                  <span className="crm-label" style={{ display: "block" }}>CNPJ</span>
                  <span>{empresa.cnpj}</span>
                </div>
                <div>
                  <span className="crm-label" style={{ display: "block" }}>Faturamento Anual Registrado</span>
                  <span style={{ color: "var(--crm-green)", fontFamily: "monospace", fontWeight: "700" }}>
                    {formatBRL(empresa.faturamento)}
                  </span>
                </div>
              </div>
            </div>

            {/* Contatos */}
            <div style={{ backgroundColor: "var(--crm-card)", border: "1px solid var(--crm-border)", borderRadius: "8px", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1.25rem", borderBottom: "1px solid var(--crm-border)", paddingBottom: "0.5rem" }}>
                Contatos da Empresa
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {empresa.contatos.map((cont: any) => (
                  <div key={cont.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", backgroundColor: "var(--crm-surface)", borderRadius: "6px" }}>
                    <div>
                      <strong style={{ fontSize: "0.9rem" }}>{cont.nome}</strong>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "var(--crm-muted)" }}>
                        {cont.cargo}
                      </span>
                    </div>
                    <a
                      href={`https://wa.me/55${cont.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="crm-btn crm-btn-secondary"
                      style={{ padding: "0.3rem 0.6rem", display: "inline-flex", gap: "0.25rem", fontSize: "0.75rem" }}
                    >
                      <PhoneCall size={12} /> {cont.whatsapp}
                    </a>
                  </div>
                ))}
                {empresa.contatos.length === 0 && (
                  <div style={{ color: "var(--crm-muted)", fontSize: "0.9rem", textAlign: "center", padding: "1rem" }}>
                    Nenhum contato registrado.
                  </div>
                )}
              </div>

              {/* Add Contact form */}
              <form onSubmit={handleAddContact} style={{ borderTop: "1px solid var(--crm-border)", paddingTop: "1rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.75rem" }}>
                  Adicionar Contato
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <input
                    type="text"
                    className="crm-input"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="crm-input"
                    placeholder="WhatsApp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <input
                    type="text"
                    className="crm-input"
                    placeholder="Cargo (ex: Sócio)"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    required
                  />
                  <button type="submit" className="crm-btn crm-btn-primary" disabled={contLoading}>
                    <UserPlus size={16} />
                  </button>
                </div>
              </form>
            </div>
            
          </div>

          {/* Oportunidades List */}
          <div style={{ backgroundColor: "var(--crm-card)", border: "1px solid var(--crm-border)", borderRadius: "8px", padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1.25rem", borderBottom: "1px solid var(--crm-border)", paddingBottom: "0.5rem" }}>
              Histórico de Oportunidades (Giro BDMG)
            </h3>

            <div style={{ overflowX: "auto" }}>
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Etapa / Coluna</th>
                    <th>Valor Solicitado</th>
                    <th>Valor Aprovado</th>
                    <th>Comissão Esperada</th>
                    <th>Status Repasse</th>
                    <th>Follow-up</th>
                  </tr>
                </thead>
                <tbody>
                  {empresa.oportunidades.map((op: any) => (
                    <tr key={op.id}>
                      <td>
                        <span className="crm-badge crm-badge-amber" style={{ textTransform: "capitalize" }}>
                          {translateStatus(op.coluna_kanban)}
                        </span>
                      </td>
                      <td style={{ color: "var(--crm-green)", fontFamily: "monospace", fontWeight: "600" }}>
                        {formatBRL(op.valor_solicitado)}
                      </td>
                      <td style={{ color: op.valor_aprovado ? "var(--crm-green)" : "var(--crm-muted)", fontFamily: "monospace" }}>
                        {op.valor_aprovado ? formatBRL(op.valor_aprovado) : "—"}
                      </td>
                      <td style={{ color: "var(--crm-text)", opacity: 0.9 }}>
                        {formatBRL(op.comissao_esperada)}
                      </td>
                      <td>
                        {op.status_repasse === "recebido" ? (
                          <span className="crm-badge crm-badge-green">Recebido</span>
                        ) : (
                          <span className="crm-badge crm-badge-red">Pendente</span>
                        )}
                      </td>
                      <td>
                        {op.followup_data ? (
                          <span className="crm-badge crm-badge-amber" style={{ display: "inline-flex", gap: "0.25rem" }}>
                            <Calendar size={12} /> {formatDate(op.followup_data)}
                          </span>
                        ) : (
                          <span style={{ color: "var(--crm-muted)" }}>Não agendado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {empresa.oportunidades.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: "var(--crm-muted)", padding: "2rem" }}>
                        Nenhuma oportunidade ativa vinculada a esta empresa.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
