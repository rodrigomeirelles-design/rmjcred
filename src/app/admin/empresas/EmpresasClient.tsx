"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { Empresa } from "@/types";
import { Plus, Building2, LogOut, ArrowLeft } from "lucide-react";
import "../crm.css";

export default function EmpresasClient() {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  
  // Form fields
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [faturamento, setFaturamento] = useState("");
  
  // Optional initial contact
  const [contNome, setContNome] = useState("");
  const [contWhatsApp, setContWhatsApp] = useState("");
  const [contCargo, setContCargo] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const fetchEmpresas = () => {
    fetch("/api/empresas")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEmpresas(data);
        }
      })
      .catch(() => toast.error("Falha ao carregar empresas."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!razaoSocial || !cnpj || !faturamento) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setFormLoading(true);

    const payload: any = {
      razao_social: razaoSocial,
      cnpj: cnpj,
      faturamento: parseFloat(faturamento),
      contatos: []
    };

    if (contNome && contWhatsApp) {
      payload.contatos.push({
        nome: contNome,
        whatsapp: contWhatsApp,
        cargo: contCargo || "Contato Principal"
      });
    }

    try {
      const res = await fetch("/api/empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Empresa cadastrada com sucesso!");
        setIsOpen(false);
        setRazaoSocial("");
        setCnpj("");
        setFaturamento("");
        setContNome("");
        setContWhatsApp("");
        setContCargo("");
        fetchEmpresas();
      } else {
        toast.error(data.error || "Erro ao cadastrar empresa.");
      }
    } catch {
      toast.error("Ocorreu um erro ao salvar os dados.");
    } finally {
      setFormLoading(false);
    }
  };

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="crm-theme">
      <Toaster richColors position="top-right" />
      
      {/* Navbar */}
      <nav className="crm-nav">
        <div className="crm-nav-logo">
          <Building2 size={24} style={{ color: "var(--crm-amber)" }} />
          CRM RMJ <span style={{ color: "var(--crm-muted)", fontSize: "0.8rem", fontWeight: "normal" }}>Clientes BDMG</span>
        </div>
        <div className="crm-nav-links">
          <Link href="/admin" className="crm-nav-link">Pipeline</Link>
          <Link href="/admin/empresas" className="crm-nav-link active">Empresas</Link>
          <Link href="/" className="crm-nav-link" target="_blank">Ver Site</Link>
          <button 
            onClick={handleLogout}
            style={{ 
              background: "transparent", 
              border: "none", 
              color: "var(--crm-red)", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontWeight: 600
            }}
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="crm-container">
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
          <Link href="/admin" className="crm-btn crm-btn-secondary" style={{ padding: "0.5rem" }}>
            <ArrowLeft size={16} />
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--crm-text)", margin: 0 }}>
            Empresas
          </h1>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ color: "var(--crm-muted)", fontSize: "0.95rem", margin: 0 }}>
            Gerenciamento de empresas integradas e habilitadas na esteira do BDMG.
          </p>
          <button className="crm-btn crm-btn-primary" onClick={() => setIsOpen(true)}>
            <Plus size={16} /> Cadastrar Empresa
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "var(--crm-muted)" }}>
            Carregando lista de empresas...
          </div>
        ) : (
          <div style={{ backgroundColor: "var(--crm-card)", borderRadius: "8px", border: "1px solid var(--crm-border)", overflowX: "auto" }}>
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Razão Social</th>
                  <th>CNPJ</th>
                  <th>Faturamento Anual</th>
                  <th>Oportunidades</th>
                  <th style={{ textAlign: "right" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <Link 
                        href={`/admin/empresas/${emp.id}`}
                        style={{ color: "var(--crm-text)", fontWeight: "700", textDecoration: "underline" }}
                      >
                        {emp.razao_social}
                      </Link>
                    </td>
                    <td style={{ color: "var(--crm-muted)" }}>{emp.cnpj}</td>
                    <td style={{ color: "var(--crm-green)", fontFamily: "monospace", fontWeight: "600" }}>
                      {formatBRL(emp.faturamento)}
                    </td>
                    <td>
                      <span className="crm-badge crm-badge-amber">
                        {emp.total_oportunidades || 0} cards
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link href={`/admin/empresas/${emp.id}`} className="crm-btn crm-btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>
                        Ver Ficha &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
                {empresas.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "var(--crm-muted)", padding: "3rem" }}>
                      Nenhuma empresa cadastrada. Clique em "Cadastrar Empresa" para começar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cadastrar Empresa Modal */}
      {isOpen && (
        <div className="crm-modal-overlay">
          <div className="crm-modal" style={{ maxWidth: "550px" }}>
            <h3 className="crm-modal-title">Cadastrar Nova Empresa</h3>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="crm-form-group">
                  <label className="crm-label">Razão Social *</label>
                  <input
                    type="text"
                    className="crm-input"
                    placeholder="Ex: Comercial Itajubá Ltda"
                    value={razaoSocial}
                    onChange={(e) => setRazaoSocial(e.target.value)}
                    required
                  />
                </div>
                <div className="crm-form-group">
                  <label className="crm-label">CNPJ *</label>
                  <input
                    type="text"
                    className="crm-input"
                    placeholder="Ex: 00.000.000/0000-00"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Faturamento Anual Bruto (R$) *</label>
                <input
                  type="number"
                  className="crm-input"
                  placeholder="Ex: 1200000"
                  value={faturamento}
                  onChange={(e) => setFaturamento(e.target.value)}
                  required
                />
              </div>

              <div style={{ borderTop: "1px solid var(--crm-border)", paddingTop: "1rem", marginTop: "0.5rem" }}>
                <h4 style={{ fontSize: "0.9rem", color: "var(--crm-text)", marginBottom: "0.75rem", fontWeight: "700" }}>
                  Contato Principal (Opcional)
                </h4>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "0.5rem" }}>
                  <div className="crm-form-group">
                    <label className="crm-label">Nome do Contato</label>
                    <input
                      type="text"
                      className="crm-input"
                      placeholder="Ex: Carlos Pereira"
                      value={contNome}
                      onChange={(e) => setContNome(e.target.value)}
                    />
                  </div>
                  <div className="crm-form-group">
                    <label className="crm-label">WhatsApp</label>
                    <input
                      type="text"
                      className="crm-input"
                      placeholder="Ex: 35999887766"
                      value={contWhatsApp}
                      onChange={(e) => setContWhatsApp(e.target.value)}
                    />
                  </div>
                </div>

                <div className="crm-form-group">
                  <label className="crm-label">Cargo</label>
                  <input
                    type="text"
                    className="crm-input"
                    placeholder="Ex: Diretor Financeiro"
                    value={contCargo}
                    onChange={(e) => setContCargo(e.target.value)}
                  />
                </div>
              </div>

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
                  disabled={formLoading}
                >
                  {formLoading ? "Salvando..." : "Salvar Empresa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
