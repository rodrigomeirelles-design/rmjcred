"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { ArrowLeft, Building2, UserPlus, PhoneCall, Calendar, ShieldAlert, Plus, ExternalLink } from "lucide-react";
import FormNovaOportunidade from "@/components/crm/FormNovaOportunidade";
import "../../crm.css";

interface DetailProps {
  id: string;
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

  const formatDate = (isoStr: string) => {
    if (!isoStr) return "—";
    try {
      const d = new Date(isoStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("pt-BR");
      }
      const [year, month, day] = isoStr.split("-");
      if (year && month && day) return `${day.slice(0, 2)}/${month}/${year}`;
      return isoStr;
    } catch {
      return isoStr;
    }
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

  // Dados para o formulário de nova proposta vinculada
  const initialDataForModal = {
    id: empresa.id,
    razao_social: empresa.razao_social,
    cnpj: empresa.cnpj,
    representante: empresa.contatos?.[0]?.nome,
    telefone: empresa.contatos?.[0]?.whatsapp,
    email: empresa.email || (empresa.proposta_json ? (() => { try { return JSON.parse(empresa.proposta_json).emp_email; } catch { return ""; } })() : "")
  };

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
        {/* Header Navigation com Botão + Nova Proposta (Mudança 3) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/admin/empresas" className="crm-btn crm-btn-secondary" style={{ padding: "0.5rem" }}>
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--crm-text)", margin: 0 }}>
                {empresa.razao_social}
              </h1>
              <p style={{ color: "var(--crm-muted)", fontSize: "0.85rem", margin: "0.2rem 0 0 0" }}>
                Ficha cadastral e oportunidades de crédito BDMG / RMJ.
              </p>
            </div>
          </div>

          {/* Botão "+ Nova Proposta" (Mudança 3) */}
          <FormNovaOportunidade
            onSuccess={fetchDetails}
            initialEmpresa={initialDataForModal}
            triggerButton={
              <button className="crm-btn crm-btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.9rem" }}>
                <Plus size={16} /> Nova Proposta
              </button>
            }
          />
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
                {empresa.contatos && empresa.contatos.map((cont: any) => (
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
                {(!empresa.contatos || empresa.contatos.length === 0) && (
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

          {/* Oportunidades List (Mudança 2: Histórico de Propostas Ordenadas Cronologicamente Decrescente) */}
          <div style={{ backgroundColor: "var(--crm-card)", border: "1px solid var(--crm-border)", borderRadius: "8px", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--crm-border)", paddingBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0 }}>
                  Histórico de Propostas ({empresa.oportunidades ? empresa.oportunidades.length : 0})
                </h3>
                <span style={{ fontSize: "0.78rem", color: "var(--crm-muted)" }}>
                  Exibição cronológica decrescente de todas as solicitações vinculadas a esta empresa.
                </span>
              </div>

              {/* Botão secundário na seção do histórico */}
              <FormNovaOportunidade
                onSuccess={fetchDetails}
                initialEmpresa={initialDataForModal}
                triggerButton={
                  <button className="crm-btn crm-btn-secondary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>
                    <Plus size={14} /> + Nova Proposta
                  </button>
                }
              />
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Data de Criação</th>
                    <th>Tipo de Operação</th>
                    <th>Valor Solicitado</th>
                    <th>Valor Aprovado</th>
                    <th>Etapa Atual</th>
                    <th style={{ textAlign: "right" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {empresa.oportunidades && empresa.oportunidades.map((op: any) => (
                    <tr key={op.id}>
                      <td style={{ color: "var(--crm-muted)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <Calendar size={13} />
                          {formatDate(op.created_at)}
                        </div>
                      </td>
                      <td>
                        <strong style={{ fontSize: "0.88rem", color: "var(--crm-text)" }}>
                          {op.canal || "Capital de Giro BDMG"}
                        </strong>
                      </td>
                      <td style={{ color: "var(--crm-green)", fontFamily: "monospace", fontWeight: "700" }}>
                        {formatBRL(op.valor_solicitado)}
                      </td>
                      <td style={{ color: op.valor_aprovado ? "var(--crm-green)" : "var(--crm-muted)", fontFamily: "monospace" }}>
                        {op.valor_aprovado ? formatBRL(op.valor_aprovado) : "—"}
                      </td>
                      <td>
                        <span
                          className="crm-badge"
                          style={{
                            backgroundColor: PIPELINE_COLORS[op.coluna_kanban] || "#64748b",
                            color: "#ffffff",
                            fontSize: "0.72rem",
                            padding: "0.2rem 0.6rem",
                            borderRadius: "999px",
                            fontWeight: 600
                          }}
                        >
                          {PIPELINE_LABELS[op.coluna_kanban] || op.coluna_kanban}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Link
                          href={`/admin`}
                          className="crm-btn crm-btn-secondary"
                          style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                        >
                          Ver no Pipeline <ExternalLink size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {(!empresa.oportunidades || empresa.oportunidades.length === 0) && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: "var(--crm-muted)", padding: "2.5rem" }}>
                        Nenhuma proposta vinculada a esta empresa ainda. Clique em "+ Nova Proposta" para criar a primeira.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ficha Completa PJ */}
          {empresa.proposta_json && (() => {
            let ficha: any = {};
            try { ficha = JSON.parse(empresa.proposta_json); } catch(e){}
            
            // Extrair sócios dinamicamente
            const socios = [];
            for(let i=1; i<=5; i++) {
              if (ficha[`socio${i}_nome`]) {
                let part = ficha[`socio${i}_participacao`];
                if (typeof part === 'number' && part <= 1) part = part * 100;
                
                socios.push({
                  nome: ficha[`socio${i}_nome`],
                  cpf: ficha[`socio${i}_cpf`],
                  participacao: part,
                  telefone: ficha[`socio${i}_telefone`],
                  renda: ficha[`socio${i}_renda`],
                  conjuge_nome: ficha[`socio${i}_conjuge_nome`],
                  conjuge_cpf: ficha[`socio${i}_conjuge_cpf`],
                });
              }
            }

            return (
              <div style={{ backgroundColor: "var(--crm-card)", border: "1px solid var(--crm-border)", borderRadius: "8px", padding: "1.5rem", marginTop: "0rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--crm-amber)", marginBottom: "1.25rem", borderBottom: "1px solid var(--crm-border)", paddingBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <ShieldAlert size={20} /> Ficha de Análise de Crédito (Completa)
                </h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                  {/* Empresa Addtl Info */}
                  <div>
                    <h4 style={{ fontSize: "1rem", color: "var(--crm-text)", marginBottom: "0.75rem", borderBottom: "1px dashed var(--crm-border)", paddingBottom: "0.25rem" }}>🏢 Dados Operacionais</h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "var(--crm-muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                      <li><strong>Endereço:</strong> {ficha.emp_logradouro}, {ficha.emp_numero} - {ficha.emp_bairro}</li>
                      <li><strong>Cidade:</strong> {ficha.emp_cidade} / {ficha.emp_uf}</li>
                      <li><strong>CEP:</strong> {ficha.emp_cep}</li>
                      <li><strong>Nº Funcionários:</strong> {ficha.emp_funcionarios}</li>
                      <li><strong>Imóvel Próprio:</strong> {ficha.emp_imovel} {ficha.emp_imovel_tipo ? `(${ficha.emp_imovel_tipo})` : ""}</li>
                    </ul>
                  </div>

                  {/* Representante e Banco */}
                  <div>
                    <h4 style={{ fontSize: "1rem", color: "var(--crm-text)", marginBottom: "0.75rem", borderBottom: "1px dashed var(--crm-border)", paddingBottom: "0.25rem" }}>💼 Representante & Banco</h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "var(--crm-muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                      <li><strong>Representante:</strong> {ficha.emp_repr_nome}</li>
                      <li><strong>CPF:</strong> {ficha.emp_repr_cpf}</li>
                      <li><strong>E-mail:</strong> {ficha.emp_email}</li>
                      <li><strong>Banco:</strong> {ficha.banco_nome} {ficha.banco_numero ? `(${ficha.banco_numero})` : ""}</li>
                      <li><strong>Ag/Conta:</strong> {ficha.banco_agencia} / {ficha.banco_conta}-{ficha.banco_digito}</li>
                    </ul>
                  </div>
                </div>

                <h4 style={{ fontSize: "1rem", color: "var(--crm-text)", marginTop: "2rem", marginBottom: "1rem", borderBottom: "1px dashed var(--crm-border)", paddingBottom: "0.25rem" }}>👥 Sócios e Cônjuges</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
                  {socios.map((s, idx) => (
                    <div key={idx} style={{ backgroundColor: "var(--crm-surface)", padding: "1rem", borderRadius: "6px", border: "1px solid var(--crm-border)" }}>
                      <div style={{ fontWeight: "bold", color: "var(--crm-green)", marginBottom: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                        <span>{s.nome}</span>
                        <span>{s.participacao ? `${Number(s.participacao).toFixed(0)}%` : ""}</span>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--crm-muted)", lineHeight: "1.5" }}>
                        <div><strong>CPF:</strong> {s.cpf}</div>
                        <div><strong>Telefone:</strong> {s.telefone}</div>
                        {s.conjuge_nome && (
                          <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                            <div style={{ color: "var(--crm-text)" }}><strong>Cônjuge:</strong> {s.conjuge_nome}</div>
                            <div><strong>CPF Cônjuge:</strong> {s.conjuge_cpf}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {ficha.obs_finais && (
                  <div style={{ marginTop: "1.5rem", backgroundColor: "var(--crm-surface)", padding: "1rem", borderRadius: "6px" }}>
                    <strong style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--crm-text)" }}>Observações Finais:</strong>
                    <p style={{ fontSize: "0.85rem", color: "var(--crm-muted)", margin: 0, whiteSpace: "pre-wrap" }}>{ficha.obs_finais}</p>
                  </div>
                )}
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}
