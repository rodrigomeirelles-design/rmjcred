"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { Oportunidade, Tarefa } from "@/types";
import KanbanBoard from "@/components/crm/KanbanBoard";
import FormNovaOportunidade from "@/components/crm/FormNovaOportunidade";
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  ListTodo,
  Wallet,
  BarChart3,
  LogOut,
  ExternalLink,
  Plus,
  FileText,
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  Trash2,
  Menu,
  X
} from "lucide-react";
import "./crm.css";

interface PipelineClientProps {
  adminEmail: string;
}

type ActiveTab = "dashboard" | "clientes" | "propostas" | "tarefas" | "comissoes" | "relatorios";

interface DashboardData {
  totalPropostas: number;
  totalEmpresas: number;
  valorSolicitado: number;
  valorAprovado: number;
  valorLiberado: number;
  comissaoTotal: number;
  comissaoRecebida: number;
  pipeline: Array<{ coluna_kanban: string; count: number; total_valor: number }>;
  canais: Array<{ canal: string; count: number; total_valor: number }>;
  tarefasPendentes: number;
  tarefasVencidas: number;
  recentes: Oportunidade[];
  conversao: number;
}

interface EmpresaRow {
  id: number;
  cnpj: string;
  razao_social: string;
  faturamento: number;
  created_at: string;
  total_oportunidades: number;
  total_valor: number;
}

const PIPELINE_LABELS: Record<string, string> = {
  prospect: "Prospect",
  em_preenchimento: "Em Preenchimento",
  em_analise: "Em Análise",
  aprovada: "Aprovada",
  aguardando_documentacao: "Aguard. Documentação",
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

const CANAL_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

export default function PipelineClient({ adminEmail }: PipelineClientProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [opportunities, setOpportunities] = useState<Oportunidade[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [empresas, setEmpresas] = useState<EmpresaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  const formatDate = (isoStr: string) => {
    if (!isoStr) return "";
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("pt-BR");
    } catch {
      return isoStr;
    }
  };

  const fetchOpportunities = useCallback(() => {
    fetch("/api/oportunidades")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOpportunities(data);
      })
      .catch(() => toast.error("Falha ao carregar oportunidades."))
      .finally(() => setLoading(false));
  }, []);

  const fetchDashboard = useCallback(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(data => setDashboardData(data))
      .catch(() => {});
  }, []);

  const fetchTarefas = useCallback(() => {
    fetch("/api/tarefas")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setTarefas(data); })
      .catch(() => {});
  }, []);

  const fetchEmpresas = useCallback(() => {
    fetch("/api/empresas")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setEmpresas(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchOpportunities();
    fetchDashboard();
    fetchTarefas();
    fetchEmpresas();
  }, [fetchOpportunities, fetchDashboard, fetchTarefas, fetchEmpresas]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const handleToggleTarefa = async (id: number, current: number) => {
    try {
      const res = await fetch(`/api/tarefas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concluida: current === 0 })
      });
      if (res.ok) {
        toast.success(current === 0 ? "Tarefa concluída!" : "Tarefa reaberta.");
        fetchTarefas();
        fetchDashboard();
      }
    } catch {
      toast.error("Erro ao atualizar tarefa.");
    }
  };

  const handleDeleteTarefa = async (id: number) => {
    if (!confirm("Remover esta tarefa?")) return;
    try {
      const res = await fetch(`/api/tarefas/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Tarefa removida.");
        fetchTarefas();
        fetchDashboard();
      }
    } catch {
      toast.error("Erro ao remover tarefa.");
    }
  };

  const isVencida = (dataStr: string) => {
    try {
      return new Date(dataStr) < new Date();
    } catch {
      return false;
    }
  };

  // Build empresa data with aggregated oportunidades
  const empresasEnriquecidas: EmpresaRow[] = empresas.map(emp => {
    const opsEmpresa = opportunities.filter(op => op.empresa_id === emp.id);
    return {
      ...emp,
      total_oportunidades: opsEmpresa.length,
      total_valor: opsEmpresa.reduce((sum, op) => sum + op.valor_solicitado, 0)
    };
  });

  const sidebarLinks: Array<{
    section: string;
    items: Array<{ id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }>;
  }> = [
    {
      section: "Principal",
      items: [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        { id: "clientes", label: "Clientes", icon: <Users size={18} /> },
        { id: "propostas", label: "Propostas", icon: <KanbanSquare size={18} /> },
        {
          id: "tarefas",
          label: "Tarefas",
          icon: <ListTodo size={18} />,
          badge: dashboardData?.tarefasVencidas || 0
        }
      ]
    },
    {
      section: "Financeiro",
      items: [
        { id: "comissoes", label: "Comissões", icon: <Wallet size={18} /> },
        { id: "relatorios", label: "Relatórios", icon: <BarChart3 size={18} /> }
      ]
    }
  ];

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    if (tab === "dashboard") fetchDashboard();
    if (tab === "propostas") fetchOpportunities();
    if (tab === "tarefas") fetchTarefas();
    if (tab === "clientes") fetchEmpresas();
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Dashboard";
      case "clientes": return "Clientes";
      case "propostas": return "Esteira de Propostas";
      case "tarefas": return "Tarefas & Follow-up";
      case "comissoes": return "Comissões";
      case "relatorios": return "Relatórios";
      default: return "CRM";
    }
  };

  // ─── RENDER DASHBOARD ────────────────────────────────
  const renderDashboard = () => {
    if (!dashboardData) {
      return <div className="empty-state"><p>Carregando dashboard...</p></div>;
    }

    const maxPipelineCount = Math.max(...(dashboardData.pipeline.map(p => p.count)), 1);

    return (
      <>
        {/* Alert: Pending Tasks */}
        {dashboardData.tarefasVencidas > 0 && (
          <div className="alert-card danger">
            <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ fontSize: "0.85rem" }}>
                {dashboardData.tarefasVencidas} tarefa(s) vencida(s)
              </strong>
              <p style={{ fontSize: "0.8rem", margin: "0.2rem 0 0 0", opacity: 0.85 }}>
                Acesse a aba Tarefas para verificar as pendências.
              </p>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="dashboard-card-icon blue"><FileText size={20} /></div>
            <div className="dashboard-card-label">Total de Propostas</div>
            <div className="dashboard-card-value">{dashboardData.totalPropostas}</div>
            <div className="dashboard-card-sub">{dashboardData.totalEmpresas} empresa(s) cadastrada(s)</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-icon green"><DollarSign size={20} /></div>
            <div className="dashboard-card-label">Valor Aprovado</div>
            <div className="dashboard-card-value" style={{ color: "var(--crm-green)" }}>
              {formatBRL(dashboardData.valorAprovado)}
            </div>
            <div className="dashboard-card-sub">Solicitado: {formatBRL(dashboardData.valorSolicitado)}</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-icon purple"><TrendingUp size={20} /></div>
            <div className="dashboard-card-label">Valor Liberado</div>
            <div className="dashboard-card-value" style={{ color: "var(--crm-purple)" }}>
              {formatBRL(dashboardData.valorLiberado)}
            </div>
            <div className="dashboard-card-sub">Conversão: {dashboardData.conversao}%</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-icon amber"><Wallet size={20} /></div>
            <div className="dashboard-card-label">Comissões</div>
            <div className="dashboard-card-value" style={{ color: "var(--crm-amber)" }}>
              {formatBRL(dashboardData.comissaoRecebida)}
            </div>
            <div className="dashboard-card-sub">Projetada: {formatBRL(dashboardData.comissaoTotal)}</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-icon red"><ListTodo size={20} /></div>
            <div className="dashboard-card-label">Pendências</div>
            <div className="dashboard-card-value">{dashboardData.tarefasPendentes}</div>
            <div className="dashboard-card-sub">{dashboardData.tarefasVencidas} vencida(s)</div>
          </div>
        </div>

        {/* Charts row */}
        <div className="dashboard-charts">
          {/* Pipeline funnel */}
          <div className="dashboard-chart-card">
            <div className="dashboard-chart-title">Funil de Vendas</div>
            <div className="pipeline-bar-container">
              {Object.keys(PIPELINE_LABELS).map((key) => {
                const pData = dashboardData.pipeline.find(p => p.coluna_kanban === key);
                const count = pData?.count || 0;
                const valor = pData?.total_valor || 0;
                const pct = Math.max((count / maxPipelineCount) * 100, count > 0 ? 15 : 0);
                return (
                  <div key={key} className="pipeline-bar-row">
                    <span className="pipeline-bar-label">{PIPELINE_LABELS[key]}</span>
                    <div className="pipeline-bar-track">
                      <div
                        className="pipeline-bar-fill"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: PIPELINE_COLORS[key]
                        }}
                      >
                        {count > 0 && <span className="pipeline-bar-count">{count}</span>}
                      </div>
                    </div>
                    <span className="pipeline-bar-value">{formatBRL(valor)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Canal distribution */}
          <div className="dashboard-chart-card">
            <div className="dashboard-chart-title">Conversão por Canal</div>
            {dashboardData.canais.length === 0 ? (
              <p style={{ color: "var(--crm-muted)", fontSize: "0.85rem" }}>Nenhum canal registrado.</p>
            ) : (
              dashboardData.canais.map((c, i) => (
                <div key={c.canal} className="canal-bar">
                  <div className="canal-dot" style={{ backgroundColor: CANAL_COLORS[i % CANAL_COLORS.length] }} />
                  <span className="canal-name">{c.canal}</span>
                  <span className="canal-count">{c.count}</span>
                  <span className="canal-value">{formatBRL(c.total_valor)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </>
    );
  };

  // ─── RENDER CLIENTES ─────────────────────────────────
  const renderClientes = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <p style={{ color: "var(--crm-muted)", fontSize: "0.9rem" }}>
          <strong>{empresasEnriquecidas.length}</strong> empresa(s) cadastrada(s)
        </p>
        <Link href="/admin/empresas" className="crm-btn crm-btn-secondary crm-btn-sm" style={{ textDecoration: "none" }}>
          <Building2 size={14} /> Gerenciar Empresas
        </Link>
      </div>
      <table className="crm-table">
        <thead>
          <tr>
            <th>Empresa</th>
            <th>CNPJ</th>
            <th>Faturamento</th>
            <th>Negócios</th>
            <th>Total Solicitado</th>
            <th>Desde</th>
          </tr>
        </thead>
        <tbody>
          {empresasEnriquecidas.map(emp => (
            <tr key={emp.id}>
              <td style={{ fontWeight: 600, color: "var(--crm-text)" }}>{emp.razao_social}</td>
              <td>{emp.cnpj}</td>
              <td>{formatBRL(emp.faturamento)}</td>
              <td>
                <span className="crm-badge crm-badge-blue">{emp.total_oportunidades}</span>
              </td>
              <td style={{ fontWeight: 600 }}>{formatBRL(emp.total_valor)}</td>
              <td>{formatDate(emp.created_at)}</td>
            </tr>
          ))}
          {empresasEnriquecidas.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--crm-muted)" }}>
                Nenhuma empresa cadastrada ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );

  // ─── RENDER PROPOSTAS (KANBAN) ───────────────────────
  const renderPropostas = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <p style={{ color: "var(--crm-muted)", fontSize: "0.9rem", margin: 0 }}>
          <strong>{opportunities.length}</strong> oportunidade(s) na esteira.
          Total solicitado: <strong style={{ color: "var(--crm-green)" }}>
            {formatBRL(opportunities.reduce((s, o) => s + o.valor_solicitado, 0))}
          </strong>
        </p>
        <FormNovaOportunidade onSuccess={() => { fetchOpportunities(); fetchDashboard(); }} />
      </div>
      {loading ? (
        <div className="empty-state">
          <p>Carregando esteira de oportunidades...</p>
        </div>
      ) : (
        <KanbanBoard opportunities={opportunities} onRefresh={() => { fetchOpportunities(); fetchDashboard(); }} />
      )}
    </>
  );

  // ─── RENDER TAREFAS ──────────────────────────────────
  const renderTarefas = () => {
    const pendentes = tarefas.filter(t => t.concluida === 0);
    const concluidas = tarefas.filter(t => t.concluida === 1);

    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <p style={{ color: "var(--crm-muted)", fontSize: "0.9rem", margin: 0 }}>
            <strong>{pendentes.length}</strong> pendente(s) • <strong>{concluidas.length}</strong> concluída(s)
          </p>
        </div>

        {pendentes.length === 0 && concluidas.length === 0 ? (
          <div className="empty-state">
            <ListTodo size={48} />
            <h3>Nenhuma tarefa registrada</h3>
            <p>As tarefas aparecerão aqui quando forem criadas.</p>
          </div>
        ) : (
          <div className="tarefa-list">
            {pendentes.map(t => (
              <div key={t.id} className={`tarefa-item ${isVencida(t.data_vencimento) ? "vencida" : ""}`}>
                <div
                  className="tarefa-checkbox"
                  onClick={() => handleToggleTarefa(t.id, t.concluida)}
                  title="Marcar como concluída"
                />
                <div className="tarefa-content">
                  <div className="tarefa-descricao">{t.descricao}</div>
                  <div className="tarefa-meta">
                    <span className="tarefa-meta-item">
                      <Users size={12} /> {t.cliente_nome}
                    </span>
                    <span className={`tarefa-meta-item ${isVencida(t.data_vencimento) ? "vencida" : ""}`}>
                      <Calendar size={12} /> {formatDate(t.data_vencimento)}
                    </span>
                    <span className="crm-badge crm-badge-blue" style={{ fontSize: "0.65rem" }}>
                      {t.tipo}
                    </span>
                  </div>
                </div>
                <button
                  className="crm-btn-ghost"
                  onClick={() => handleDeleteTarefa(t.id)}
                  title="Remover tarefa"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {concluidas.length > 0 && (
              <>
                <div style={{ padding: "0.75rem 0 0.25rem", color: "var(--crm-muted)", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Concluídas
                </div>
                {concluidas.map(t => (
                  <div key={t.id} className="tarefa-item concluida">
                    <div
                      className="tarefa-checkbox checked"
                      onClick={() => handleToggleTarefa(t.id, t.concluida)}
                      title="Reabrir tarefa"
                    >
                      <CheckCircle size={14} />
                    </div>
                    <div className="tarefa-content">
                      <div className="tarefa-descricao">{t.descricao}</div>
                      <div className="tarefa-meta">
                        <span className="tarefa-meta-item">
                          <Users size={12} /> {t.cliente_nome}
                        </span>
                      </div>
                    </div>
                    <button className="crm-btn-ghost" onClick={() => handleDeleteTarefa(t.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </>
    );
  };

  // ─── RENDER COMISSÕES ────────────────────────────────
  const renderComissoes = () => {
    const comissaoProjetada = opportunities.reduce((s, o) => s + o.comissao_esperada, 0);
    const comissaoRecebida = opportunities
      .filter(o => o.status_repasse === "recebido")
      .reduce((s, o) => s + o.comissao_esperada, 0);
    const comissaoPendente = comissaoProjetada - comissaoRecebida;

    return (
      <>
        <div className="comissao-summary">
          <div className="comissao-card">
            <div className="comissao-card-value" style={{ color: "var(--crm-blue)" }}>
              {formatBRL(comissaoProjetada)}
            </div>
            <div className="comissao-card-label">Comissão Projetada</div>
          </div>
          <div className="comissao-card">
            <div className="comissao-card-value" style={{ color: "var(--crm-green)" }}>
              {formatBRL(comissaoRecebida)}
            </div>
            <div className="comissao-card-label">Comissão Recebida</div>
          </div>
          <div className="comissao-card">
            <div className="comissao-card-value" style={{ color: "var(--crm-amber)" }}>
              {formatBRL(comissaoPendente)}
            </div>
            <div className="comissao-card-label">Comissão Pendente</div>
          </div>
        </div>

        <table className="crm-table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Canal</th>
              <th>Valor Solicitado</th>
              <th>Valor Aprovado</th>
              <th>Comissão</th>
              <th>Status Repasse</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map(op => (
              <tr key={op.id}>
                <td style={{ fontWeight: 600, color: "var(--crm-text)" }}>{op.razao_social}</td>
                <td>
                  <span className="crm-badge crm-badge-purple" style={{ fontSize: "0.7rem" }}>
                    {op.canal || "BDMG"}
                  </span>
                </td>
                <td>{formatBRL(op.valor_solicitado)}</td>
                <td>{op.valor_aprovado ? formatBRL(op.valor_aprovado) : "—"}</td>
                <td style={{ fontWeight: 700, color: "var(--crm-green)" }}>{formatBRL(op.comissao_esperada)}</td>
                <td>
                  {op.status_repasse === "recebido" ? (
                    <span className="crm-badge crm-badge-green">
                      <CheckCircle size={12} /> Recebido
                    </span>
                  ) : (
                    <span className="crm-badge crm-badge-amber">
                      <Clock size={12} /> Pendente
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {opportunities.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--crm-muted)" }}>
                  Nenhuma oportunidade registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </>
    );
  };

  // ─── RENDER RELATÓRIOS ───────────────────────────────
  const renderRelatorios = () => (
    <div className="empty-state">
      <BarChart3 size={48} />
      <h3>Relatórios Avançados</h3>
      <p>Módulo de relatórios analíticos com filtros por canal, período e status em breve.</p>
    </div>
  );

  // ─── RENDER CONTENT ──────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return renderDashboard();
      case "clientes": return renderClientes();
      case "propostas": return renderPropostas();
      case "tarefas": return renderTarefas();
      case "comissoes": return renderComissoes();
      case "relatorios": return renderRelatorios();
      default: return renderDashboard();
    }
  };

  return (
    <div className="crm-theme">
      <Toaster richColors position="top-right" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="crm-drawer-overlay"
          style={{ zIndex: 150 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── SIDEBAR ──────────────────────────── */}
      <aside className={`crm-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="crm-sidebar-header">
          <div className="crm-sidebar-logo">RMJ</div>
          <div className="crm-sidebar-brand">
            <span className="crm-sidebar-brand-name">RMJ Crédito</span>
            <span className="crm-sidebar-brand-sub">Painel Administrativo</span>
          </div>
        </div>

        {sidebarLinks.map(section => (
          <div key={section.section} className="crm-sidebar-section">
            <div className="crm-sidebar-section-title">{section.section}</div>
            {section.items.map(item => (
              <button
                key={item.id}
                className={`crm-sidebar-link ${activeTab === item.id ? "active" : ""}`}
                onClick={() => handleTabChange(item.id)}
              >
                {item.icon}
                {item.label}
                {item.badge && item.badge > 0 ? (
                  <span className="crm-sidebar-link-badge">{item.badge}</span>
                ) : null}
              </button>
            ))}
          </div>
        ))}

        {/* External links */}
        <div className="crm-sidebar-section">
          <div className="crm-sidebar-section-title">Ferramentas</div>
          <Link href="/admin/empresas" className="crm-sidebar-link" style={{ textDecoration: "none" }}>
            <Building2 size={18} /> Empresas
          </Link>
          <Link href="/" target="_blank" className="crm-sidebar-link" style={{ textDecoration: "none" }}>
            <ExternalLink size={18} /> Ver Site
          </Link>
        </div>

        {/* Footer */}
        <div className="crm-sidebar-footer">
          <div className="crm-sidebar-user">
            <div className="crm-sidebar-avatar">
              {adminEmail ? adminEmail.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="crm-sidebar-user-info">
              <span className="crm-sidebar-user-name">{adminEmail}</span>
              <span className="crm-sidebar-user-role">Administrador</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="crm-sidebar-link"
            style={{ color: "var(--crm-red)", marginTop: "0.5rem" }}
          >
            <LogOut size={18} /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─────────────────────── */}
      <main className="crm-main">
        <div className="crm-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button className="crm-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span className="crm-topbar-title">{getTabTitle()}</span>
          </div>
          <div className="crm-topbar-actions">
            {activeTab === "propostas" && (
              <FormNovaOportunidade onSuccess={() => { fetchOpportunities(); fetchDashboard(); }} />
            )}
          </div>
        </div>

        <div className="crm-container">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
