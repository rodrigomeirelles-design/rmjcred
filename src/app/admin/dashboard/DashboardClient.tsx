"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, DollarSign, Target, PieChart, Activity, CheckCircle2, XCircle } from "lucide-react";
import { format, subMonths, addMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Proposta, getComissaoRate } from "@/types";
import { PropostaImovel } from "@/types/imovel";
import { PropostaVeiculo } from "@/types/veiculo";
import { parseISO } from "date-fns";

interface DashboardClientProps {
  propostasPj: Proposta[];
  propostasImovel: PropostaImovel[];
  propostasVeiculo: PropostaVeiculo[];
}

export default function DashboardClient({
  propostasPj,
  propostasImovel,
  propostasVeiculo,
}: DashboardClientProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Combinar todos os leads
  const allLeads = useMemo(() => {
    const pj = propostasPj.map(p => ({
      ...p,
      data_criacao: p.timestamp_envio ? parseISO(p.timestamp_envio) : new Date(0),
      valor_total: Number(p.valor_solicitado) || 0,
      tipo_lead: "PJ",
    }));
    const imovel = propostasImovel.map(p => ({
      ...p,
      data_criacao: p.timestamp_envio ? parseISO(p.timestamp_envio) : new Date(0),
      valor_total: Number(p.valorFinanciamento) || 0,
      tipo_lead: "Imóvel",
    }));
    const veiculo = propostasVeiculo.map(p => ({
      ...p,
      data_criacao: p.timestamp_envio ? parseISO(p.timestamp_envio) : new Date(0),
      valor_total: Number(p.valor_financiamento) || 0,
      tipo_lead: "Veículo",
    }));
    return [...pj, ...imovel, ...veiculo];
  }, [propostasPj, propostasImovel, propostasVeiculo]);

  // Filtrar pelo mês de competência
  const currentMonthLeads = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return allLeads.filter(lead => isWithinInterval(lead.data_criacao, { start, end }));
  }, [allLeads, currentMonth]);

  // Métricas
  const totalVolume = currentMonthLeads.reduce((acc, lead) => acc + lead.valor_total, 0);
  
  const estimativaComissao = currentMonthLeads.reduce((acc, lead) => {
    const isLost = lead.coluna_kanban === "nao_aprovado" || lead.coluna_kanban === "leads_perdidos";
    if (isLost) return acc;
    const rate = getComissaoRate(lead as unknown as Proposta);
    return acc + (lead.valor_total * rate);
  }, 0);

  const metaMensal = 5000000; // Meta fixa de exemplo 5M
  const metaPercent = Math.min((totalVolume / metaMensal) * 100, 100);

  // Status Funil
  const statusCounts = currentMonthLeads.reduce((acc, lead) => {
    const col = lead.coluna_kanban || "novo_negocio";
    acc[col] = (acc[col] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const won = statusCounts["finalizado"] || 0;
  const lost = (statusCounts["nao_aprovado"] || 0) + (statusCounts["lead_perdido"] || 0);
  const totalConcluded = won + lost;
  const winRate = totalConcluded > 0 ? (won / totalConcluded) * 100 : 0;

  // Produtos
  const productVolume = currentMonthLeads.reduce((acc, lead) => {
    acc[lead.tipo_lead] = (acc[lead.tipo_lead] || 0) + lead.valor_total;
    return acc;
  }, {} as Record<string, number>);

  const totalProdVolume = Object.values(productVolume).reduce((a, b) => a + b, 0);
  let currentGradient = 0;
  const conicString = Object.entries(productVolume).map(([type, val], index) => {
    const percentage = totalProdVolume > 0 ? (val / totalProdVolume) * 100 : 0;
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
    const color = colors[index % colors.length];
    const str = `${color} ${currentGradient}% ${currentGradient + percentage}%`;
    currentGradient += percentage;
    return str;
  }).join(", ");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-fade-in pb-24">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Acompanhe a performance da sua operação.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <span className="w-32 text-center font-semibold text-slate-700 capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all">
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-20"><TrendingUp className="w-24 h-24" /></div>
          <p className="text-blue-100 font-medium mb-1">Volume Solicitado</p>
          <h2 className="text-4xl font-bold tracking-tight">{formatCurrency(totalVolume)}</h2>
          <div className="mt-6">
            <div className="flex justify-between text-sm font-medium text-blue-100 mb-2">
              <span>Meta Mensal</span>
              <span>{Math.round(metaPercent)}%</span>
            </div>
            <div className="w-full bg-blue-900/50 rounded-full h-2">
              <div className="bg-white rounded-full h-2 transition-all duration-1000" style={{ width: `${metaPercent}%` }}></div>
            </div>
            <p className="text-xs text-blue-200 mt-2 text-right">{formatCurrency(metaMensal)}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-6 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-20"><DollarSign className="w-24 h-24" /></div>
          <p className="text-emerald-100 font-medium mb-1">Estimativa de Comissão</p>
          <h2 className="text-4xl font-bold tracking-tight">{formatCurrency(estimativaComissao)}</h2>
          <p className="mt-4 text-emerald-100 text-sm">Projeção média de ganhos sobre o volume deste mês.</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funil de Conversão */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-bold text-slate-800">Funil de Vendas</h3>
          </div>
          <div className="flex flex-col space-y-3">
            {[
              { id: 'novo_negocio', label: 'Novo Negócio', color: 'bg-slate-500' },
              { id: 'em_analise', label: 'Em Análise', color: 'bg-blue-500' },
              { id: 'em_aprovacao', label: 'Em Aprovação', color: 'bg-indigo-500' },
              { id: 'formalizacao', label: 'Formalização', color: 'bg-purple-500' },
              { id: 'credito_liberado', label: 'Crédito Liberado', color: 'bg-emerald-500' },
              { id: 'finalizado', label: 'Finalizados (Ganhos)', color: 'bg-green-600' },
            ].map(stage => {
              const count = statusCounts[stage.id] || 0;
              const width = Math.max((count / Math.max(currentMonthLeads.length, 1)) * 100, 2);
              return (
                <div key={stage.id} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-slate-600 text-right shrink-0">{stage.label}</div>
                  <div className="flex-1">
                    <div 
                      className={`h-8 rounded-lg ${stage.color} flex items-center px-3 text-white text-xs font-bold transition-all duration-1000`}
                      style={{ width: `${width}%` }}
                    >
                      {count > 0 && count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Produto e Sucesso */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="w-full flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-800">Por Produto</h3>
            </div>
            
            {totalProdVolume > 0 ? (
              <>
                <div 
                  className="w-40 h-40 rounded-full mb-6"
                  style={{ background: `conic-gradient(${conicString})` }}
                />
                <div className="w-full space-y-2">
                  {Object.entries(productVolume).map(([type, val], index) => {
                    const colors = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-red-500"];
                    return (
                      <div key={type} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                          <span className="text-slate-600">{type}</span>
                        </div>
                        <span className="font-semibold text-slate-800">{formatCurrency(val)}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                Nenhum dado neste mês
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-800">Win / Loss</h3>
            </div>
            <div className="flex items-center justify-center gap-8 mb-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2 text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{won}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ganhos</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-2 text-rose-600">
                  <XCircle className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{lost}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Perdidos</p>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${winRate}%` }}></div>
              <div className="bg-rose-500 h-full transition-all duration-1000" style={{ width: `${100 - winRate}%` }}></div>
            </div>
            <div className="text-center mt-3 text-sm font-semibold text-slate-600">
              Taxa de Sucesso: {winRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
