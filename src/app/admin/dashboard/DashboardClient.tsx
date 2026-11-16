"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Target,
  PieChart,
  Activity,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react";
import {
  format,
  subMonths,
  addMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Proposta,
  getComissaoRate,
  KANBAN_STAGES,
  TaxConfig,
  resolveTipoPessoa,
  getProductCommissionDef,
} from "@/types";
import { PropostaImovel } from "@/types/imovel";
import { PropostaVeiculo } from "@/types/veiculo";

interface DashboardClientProps {
  propostasPj: Proposta[];
  propostasImovel: PropostaImovel[];
  propostasVeiculo: PropostaVeiculo[];
}

function parseDateSafe(val?: string | null): Date | null {
  if (!val) return null;
  const clean = val.trim();
  if (!clean) return null;
  try {
    if (clean.includes("/")) {
      const [d, m, y] = clean.split("/");
      const parsed = new Date(`${y}-${m}-${d}T12:00:00`);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    const parsed = clean.includes("T") ? parseISO(clean) : new Date(`${clean}T12:00:00`);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

function getCategoriaProduto(produto?: string | null): string {
  const def = getProductCommissionDef(produto);
  if (def.category === "bdmg") return "BDMG / Capital de Giro";
  if (def.category === "imovel") {
    const p = (produto || "").toLowerCase();
    if (p.includes("home equity") || p.includes("garantia de imóvel")) return "Home Equity";
    return "Financiamento Imobiliário";
  }
  if (def.category === "veiculo") return "Veículos";
  if (def.category === "consorcio") return "Consórcio";
  return "Outros";
}

export default function DashboardClient({
  propostasPj,
  propostasImovel,
  propostasVeiculo,
}: DashboardClientProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [taxConfig, setTaxConfig] = useState<TaxConfig | null>(null);

  useEffect(() => {
    fetch("/api/comissoes/config")
      .then((r) => r.json())
      .then((data) => setTaxConfig(data))
      .catch(() => {});
  }, []);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Combinar todos os leads sem duplicar IDs já existentes na aba principal
  const allLeads = useMemo(() => {
    const pjIds = new Set(propostasPj.map((p) => p.id_proposta));

    const pj = propostasPj.map((p) => {
      const tipo = p.tipo_pessoa || resolveTipoPessoa(p.emp_cnpj, p.produto, p.emp_razao);
      return {
        ...p,
        data_envio: parseDateSafe(p.timestamp_envio) || new Date(0),
        data_liberacao_dt: parseDateSafe(p.data_liberacao),
        data_recusa_dt: parseDateSafe(p.data_recusa),
        valor_total: Number(p.valor_solicitado) || 0,
        tipo_lead: tipo,
        categoria_produto: getCategoriaProduto(p.produto),
      };
    });

    const imovel = propostasImovel
      .filter((p) => !pjIds.has(p.id_proposta))
      .map((p) => ({
        ...p,
        emp_razao: p.nome,
        emp_cnpj: p.cpf,
        data_envio: parseDateSafe(p.timestamp_envio) || new Date(0),
        data_liberacao_dt: parseDateSafe((p as any).data_liberacao),
        data_recusa_dt: parseDateSafe((p as any).data_recusa),
        valor_total: Number(p.valorFinanciamento) || 0,
        tipo_lead: "PF" as const,
        categoria_produto: getCategoriaProduto(p.produto || "Financiamento Imobiliário"),
      }));

    const veiculo = propostasVeiculo
      .filter((p) => !pjIds.has(p.id_proposta))
      .map((p) => ({
        ...p,
        emp_razao: p.nome,
        emp_cnpj: p.cpf,
        data_envio: parseDateSafe(p.timestamp_envio) || new Date(0),
        data_liberacao_dt: parseDateSafe((p as any).data_liberacao),
        data_recusa_dt: parseDateSafe((p as any).data_recusa),
        valor_total: Number(p.valor_financiamento) || 0,
        tipo_lead: "PF" as const,
        categoria_produto: "Veículos",
      }));

    return [...pj, ...imovel, ...veiculo];
  }, [propostasPj, propostasImovel, propostasVeiculo]);

  // Intervalo do mês selecionado
  const monthInterval = useMemo(() => {
    return {
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    };
  }, [currentMonth]);

  // 1. Volume Solicitado = data de envio (timestamp_envio)
  const leadsVolumeMes = useMemo(() => {
    return allLeads.filter(
      (lead) => lead.data_envio && isWithinInterval(lead.data_envio, monthInterval)
    );
  }, [allLeads, monthInterval]);

  const totalVolume = leadsVolumeMes.reduce((acc, lead) => acc + lead.valor_total, 0);

  // 2. Estimativa de Comissão = data de liberação (data_liberacao)
  const leadsComissaoMes = useMemo(() => {
    return allLeads.filter(
      (lead) =>
        lead.data_liberacao_dt &&
        isWithinInterval(lead.data_liberacao_dt, monthInterval) &&
        lead.coluna_kanban !== KANBAN_STAGES.NAO_APROVADO &&
        lead.coluna_kanban !== KANBAN_STAGES.LEADS_PERDIDOS
    );
  }, [allLeads, monthInterval]);

  const estimativaComissao = leadsComissaoMes.reduce((acc, lead) => {
    const rate = getComissaoRate(lead as unknown as Proposta, taxConfig);
    return acc + lead.valor_total * rate;
  }, 0);

  const metaMensal = 5000000;
  const metaPercent = Math.min((totalVolume / metaMensal) * 100, 100);

  // 3. Funil de Vendas = SEM filtro de data (foto atual da carteira)
  const statusCountsGeral = useMemo(() => {
    return allLeads.reduce((acc, lead) => {
      const col = lead.coluna_kanban || KANBAN_STAGES.NOVO_NEGOCIO;
      acc[col] = (acc[col] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [allLeads]);

  // 4. Win / Loss:
  // Ganhos = data_liberacao no mês selecionado
  // Perdidos = data_recusa no mês selecionado
  const wonLeads = useMemo(() => {
    return allLeads.filter(
      (lead) =>
        (lead.coluna_kanban === KANBAN_STAGES.FINALIZADOS ||
          lead.coluna_kanban === KANBAN_STAGES.CREDITO_LIBERADO) &&
        lead.data_liberacao_dt &&
        isWithinInterval(lead.data_liberacao_dt, monthInterval)
    );
  }, [allLeads, monthInterval]);

  const lostLeads = useMemo(() => {
    return allLeads.filter(
      (lead) =>
        (lead.coluna_kanban === KANBAN_STAGES.NAO_APROVADO ||
          lead.coluna_kanban === KANBAN_STAGES.LEADS_PERDIDOS) &&
        lead.data_recusa_dt &&
        isWithinInterval(lead.data_recusa_dt, monthInterval)
    );
  }, [allLeads, monthInterval]);

  const won = wonLeads.length;
  const lost = lostLeads.length;
  const totalConcluded = won + lost;
  const winRate = totalConcluded > 0 ? (won / totalConcluded) * 100 : 0;

  // 5. Gráfico 1: Por Produto (Volume por Categoria de Produto no mês do Volume Solicitado)
  const productVolume = useMemo(() => {
    return leadsVolumeMes.reduce((acc, lead) => {
      const cat = lead.categoria_produto || "Outros";
      acc[cat] = (acc[cat] || 0) + lead.valor_total;
      return acc;
    }, {} as Record<string, number>);
  }, [leadsVolumeMes]);

  const totalProdVolume = Object.values(productVolume).reduce((a, b) => a + b, 0);

  let currentGradientProd = 0;
  const conicStringProd = Object.entries(productVolume)
    .map(([_, val], index) => {
      const percentage = totalProdVolume > 0 ? (val / totalProdVolume) * 100 : 0;
      const colors = ["#2563eb", "#059669", "#d97706", "#7c3aed", "#e11d48"];
      const color = colors[index % colors.length];
      const str = `${color} ${currentGradientProd}% ${currentGradientProd + percentage}%`;
      currentGradientProd += percentage;
      return str;
    })
    .join(", ");

  // 6. Gráfico 2: Por Tipo de Pessoa (PJ vs PF no mês do Volume Solicitado)
  const tipoVolume = useMemo(() => {
    return leadsVolumeMes.reduce((acc, lead) => {
      const t = lead.tipo_lead === "PJ" ? "Pessoa Jurídica (PJ)" : "Pessoa Física (PF)";
      acc[t] = (acc[t] || 0) + lead.valor_total;
      return acc;
    }, {} as Record<string, number>);
  }, [leadsVolumeMes]);

  const totalTipoVolume = Object.values(tipoVolume).reduce((a, b) => a + b, 0);

  let currentGradientTipo = 0;
  const conicStringTipo = Object.entries(tipoVolume)
    .map(([_, val], index) => {
      const percentage = totalTipoVolume > 0 ? (val / totalTipoVolume) * 100 : 0;
      const colors = ["#1e40af", "#10b981"];
      const color = colors[index % colors.length];
      const str = `${color} ${currentGradientTipo}% ${currentGradientTipo + percentage}%`;
      currentGradientTipo += percentage;
      return str;
    })
    .join(", ");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-fade-in pb-24">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Indicadores de produção e desempenho operacional.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"
            title="Mês anterior"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <span className="w-36 text-center font-semibold text-slate-700 capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"
            title="Próximo mês"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-20">
            <TrendingUp className="w-24 h-24" />
          </div>
          <p className="text-blue-100 font-medium mb-1">Volume Solicitado</p>
          <h2 className="text-4xl font-bold tracking-tight">{formatCurrency(totalVolume)}</h2>
          <div className="mt-6">
            <div className="flex justify-between text-sm font-medium text-blue-100 mb-2">
              <span>Meta Mensal</span>
              <span>{Math.round(metaPercent)}%</span>
            </div>
            <div className="w-full bg-blue-900/50 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-1000"
                style={{ width: `${metaPercent}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-200 mt-2 text-right">
              Meta: {formatCurrency(metaMensal)} • Filtro: Data de Envio
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-6 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-20">
            <DollarSign className="w-24 h-24" />
          </div>
          <p className="text-emerald-100 font-medium mb-1">Estimativa de Comissão</p>
          <h2 className="text-4xl font-bold tracking-tight">
            {formatCurrency(estimativaComissao)}
          </h2>
          <p className="mt-4 text-emerald-100 text-sm">
            Comissões apuradas sobre contratos liberados nesta competência.
          </p>
          <p className="text-xs text-emerald-200 mt-2">Filtro: Data de Liberação</p>
        </div>
      </div>

      {/* Funil de Vendas (Full width: Foto Atual da Carteira) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-bold text-slate-800">Funil de Vendas</h3>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Posição Atual da Carteira ({allLeads.length} leads no total)
          </span>
        </div>
        <div className="flex flex-col space-y-3">
          {[
            { id: KANBAN_STAGES.NOVO_NEGOCIO, label: "Novo Negócio", color: "bg-slate-500" },
            { id: KANBAN_STAGES.EM_ANALISE, label: "Em Análise", color: "bg-blue-500" },
            { id: KANBAN_STAGES.EM_APROVACAO, label: "Em Aprovação", color: "bg-indigo-500" },
            { id: KANBAN_STAGES.FORMALIZACAO, label: "Formalização", color: "bg-purple-500" },
            { id: KANBAN_STAGES.CREDITO_LIBERADO, label: "Crédito Liberado", color: "bg-emerald-500" },
            { id: KANBAN_STAGES.FINALIZADOS, label: "Finalizados (Ganhos)", color: "bg-green-600" },
          ].map((stage) => {
            const count = statusCountsGeral[stage.id] || 0;
            const width = Math.max((count / Math.max(allLeads.length, 1)) * 100, 2);
            return (
              <div key={stage.id} className="flex items-center gap-4">
                <div className="w-36 text-sm font-medium text-slate-600 text-right shrink-0">
                  {stage.label}
                </div>
                <div className="flex-1">
                  <div
                    className={`h-8 rounded-lg ${stage.color} flex items-center px-3 text-white text-xs font-bold transition-all duration-1000 shadow-sm`}
                    style={{ width: `${width}%` }}
                  >
                    {count > 0 && `${count} (${((count / Math.max(allLeads.length, 1)) * 100).toFixed(1)}%)`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Win/Loss, Por Produto, Por Tipo de Pessoa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Win / Loss (Mensal por data de liberação / recusa) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-bold text-slate-800">Win / Loss</h3>
              </div>
              <span className="text-[11px] text-slate-400">Competência</span>
            </div>
            <div className="flex items-center justify-center gap-8 my-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2 text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{won}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ganhos (Liberação)
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-2 text-rose-600">
                  <XCircle className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{lost}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Perdidos (Recusa)
                </p>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-1000"
                style={{ width: `${winRate}%` }}
              ></div>
              <div
                className="bg-rose-500 h-full transition-all duration-1000"
                style={{ width: `${100 - winRate}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center mt-4 pt-3 border-t border-slate-100 text-sm font-semibold text-slate-600">
            Taxa de Sucesso: {winRate.toFixed(1)}%
          </div>
        </div>

        {/* Gráfico 1: Por Produto */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-800">Por Produto</h3>
            </div>
            <span className="text-[11px] text-slate-400">Volume</span>
          </div>

          {totalProdVolume > 0 ? (
            <div className="w-full flex flex-col items-center">
              <div
                className="w-36 h-36 rounded-full my-3 shadow-inner"
                style={{ background: `conic-gradient(${conicStringProd})` }}
              />
              <div className="w-full space-y-2 mt-4">
                {Object.entries(productVolume).map(([type, val], index) => {
                  const colors = [
                    "bg-blue-600",
                    "bg-emerald-600",
                    "bg-amber-600",
                    "bg-purple-600",
                    "bg-rose-600",
                  ];
                  return (
                    <div key={type} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors[index % colors.length]}`}
                        ></div>
                        <span className="text-slate-600 truncate">{type}</span>
                      </div>
                      <span className="font-semibold text-slate-800 shrink-0 ml-2">
                        {formatCurrency(val)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm py-12">
              Nenhum volume no mês
            </div>
          )}
        </div>

        {/* Gráfico 2: Por Tipo de Pessoa (PJ vs PF) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-800">Por Tipo de Pessoa</h3>
            </div>
            <span className="text-[11px] text-slate-400">Volume</span>
          </div>

          {totalTipoVolume > 0 ? (
            <div className="w-full flex flex-col items-center">
              <div
                className="w-36 h-36 rounded-full my-3 shadow-inner"
                style={{ background: `conic-gradient(${conicStringTipo})` }}
              />
              <div className="w-full space-y-2 mt-4">
                {Object.entries(tipoVolume).map(([type, val], index) => {
                  const colors = ["bg-blue-800", "bg-emerald-500"];
                  const pct = totalTipoVolume > 0 ? ((val / totalTipoVolume) * 100).toFixed(1) : "0";
                  return (
                    <div key={type} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors[index % colors.length]}`}
                        ></div>
                        <span className="text-slate-600">{type}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-slate-800">{formatCurrency(val)}</span>
                        <span className="text-[10px] text-slate-400 ml-1.5 font-medium">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm py-12">
              Nenhum volume no mês
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
