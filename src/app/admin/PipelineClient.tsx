"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { Oportunidade } from "@/types";
import KanbanBoard from "@/components/crm/KanbanBoard";
import FormNovaOportunidade from "@/components/crm/FormNovaOportunidade";
import { BarChart3, LogOut, ShieldAlert, Building2 } from "lucide-react";
import "./crm.css";

interface PipelineClientProps {
  adminEmail: string;
}

export default function PipelineClient({ adminEmail }: PipelineClientProps) {
  const [opportunities, setOpportunities] = useState<Oportunidade[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOpportunities = () => {
    fetch("/api/oportunidades")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOpportunities(data);
        }
      })
      .catch(() => toast.error("Falha ao carregar oportunidades."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const totalValue = opportunities.reduce((sum, op) => sum + op.valor_solicitado, 0);

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
          <ShieldAlert size={24} style={{ color: "var(--crm-amber)" }} />
          CRM RMJ <span style={{ color: "var(--crm-muted)", fontSize: "0.8rem", fontWeight: "normal" }}>Capital de Giro BDMG</span>
        </div>
        <div className="crm-nav-links">
          <Link href="/admin" className="crm-nav-link active">Pipeline</Link>
          <Link href="/admin/empresas" className="crm-nav-link">Empresas</Link>
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--crm-text)", margin: 0 }}>
              Pipeline BDMG
            </h1>
            <p style={{ color: "var(--crm-muted)", fontSize: "0.95rem", margin: "0.25rem 0 0 0" }}>
              Total de <strong>{opportunities.length}</strong> oportunidades cadastradas na esteira. Total solicitado: <strong style={{ color: "var(--crm-green)" }}>{formatBRL(totalValue)}</strong>
            </p>
          </div>
          <div>
            <FormNovaOportunidade onSuccess={fetchOpportunities} />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "var(--crm-muted)" }}>
            Carregando esteira de oportunidades...
          </div>
        ) : (
          <KanbanBoard opportunities={opportunities} onRefresh={fetchOpportunities} />
        )}
      </div>
    </div>
  );
}
