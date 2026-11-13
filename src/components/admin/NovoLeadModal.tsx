"use client";

import { useState } from "react";
import { X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { maskCPF, maskCNPJ, maskMoney, parseMoney, formatCNPJ } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { KANBAN_COLUMNS, type KanbanColumn } from "@/types";

const KANBAN_LABEL = Object.fromEntries(KANBAN_COLUMNS.map((c) => [c.id, c.label]));

const FASE_COLOR: Record<string, string> = {
  novo_negocio:     "bg-slate-100 text-slate-700 border-slate-300",
  em_analise:       "bg-blue-100 text-blue-800 border-blue-300",
  em_aprovacao:     "bg-amber-100 text-amber-800 border-amber-300",
  formalizacao:     "bg-purple-100 text-purple-800 border-purple-300",
  credito_liberado: "bg-green-100 text-green-800 border-green-300",
  finalizados:      "bg-emerald-100 text-emerald-800 border-emerald-300",
  nao_aprovado:     "bg-red-100 text-red-800 border-red-300",
  leads_perdidos:   "bg-zinc-100 text-zinc-600 border-zinc-300",
};

export interface InitialLeadData {
  tipo?: "PJ" | "PF";
  empRazao?: string;
  empCnpj?: string;
  reprNome?: string;
  reprCpf?: string;
  empEmail?: string;
  empTelefone?: string;
  empresaIdVinculada?: string;
  // PF fields
  produtoPF?: string;
  nome?: string;
  cpf?: string;
  celular?: string;
  email?: string;
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: InitialLeadData;
}

type TipoPessoa = "PJ" | "PF";

const PRODUTO_PF_OPTIONS = [
  { value: "Financiamento Imobiliário", label: "Financiamento Imobiliário" },
  { value: "Crédito com Garantia de Imóvel", label: "Home Equity (Crédito com Garantia de Imóvel)" },
  { value: "Financiamento de Veículos", label: "Financiamento de Veículos" },
  { value: "Crédito com Garantia de Veículo", label: "Garantia de Veículo" },
  { value: "Consórcio", label: "Consórcio" },
];

interface EmpresaEncontrada {
  id: string;
  razaoSocial?: string;
  nome?: string;
  cnpj?: string;
  cpf?: string;
  representante?: string;
  cpfRepresentante?: string;
  telefone?: string;
  celular?: string;
  email?: string;
  etapaAtual?: string;
}

export default function NovoLeadModal({ onClose, onSuccess, initialData }: Props) {
  const [tipo, setTipo] = useState<TipoPessoa>(initialData?.tipo || "PJ");
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  // Recorrência / Empresa Existente
  const [empresaExistente, setEmpresaExistente] = useState<EmpresaEncontrada | null>(null);
  const [empresaIdVinculada, setEmpresaIdVinculada] = useState<string | null>(
    initialData?.empresaIdVinculada || null
  );

  // PJ fields
  const [empRazao, setEmpRazao] = useState(initialData?.empRazao || "");
  const [empCnpj, setEmpCnpj] = useState(initialData?.empCnpj ? maskCNPJ(initialData.empCnpj) : "");
  const [reprNome, setReprNome] = useState(initialData?.reprNome || "");
  const [reprCpf, setReprCpf] = useState(initialData?.reprCpf ? maskCPF(initialData.reprCpf) : "");
  const [empEmail, setEmpEmail] = useState(initialData?.empEmail || "");
  const [empTelefone, setEmpTelefone] = useState(initialData?.empTelefone || "");
  const [valorPJ, setValorPJ] = useState("");

  // PF fields
  const [produtoPF, setProdutoPF] = useState(initialData?.produtoPF || "Financiamento Imobiliário");
  const [nome, setNome] = useState(initialData?.nome || "");
  const [cpf, setCpf] = useState(initialData?.cpf ? maskCPF(initialData.cpf) : "");
  const [celular, setCelular] = useState(initialData?.celular || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [valorPF, setValorPF] = useState("");

  async function handleCNPJBlur() {
    const clean = empCnpj.replace(/\D/g, "");
    if (clean.length !== 14) return;
    if (empresaIdVinculada) return;

    setSearching(true);
    try {
      const res = await fetch(`/api/empresas?cnpj=${clean}`);
      const json = await res.json();
      if (json.success && json.data) {
        setEmpresaExistente(json.data);
      } else {
        setEmpresaExistente(null);
      }
    } catch (err) {
      console.error("Erro na busca de CNPJ duplicado:", err);
    } finally {
      setSearching(false);
    }
  }

  async function handleCPFBlur() {
    const clean = cpf.replace(/\D/g, "");
    if (clean.length !== 11) return;
    if (empresaIdVinculada) return;

    setSearching(true);
    try {
      const res = await fetch(`/api/empresas?cpf=${clean}`);
      const json = await res.json();
      if (json.success && json.data) {
        setEmpresaExistente(json.data);
      } else {
        setEmpresaExistente(null);
      }
    } catch (err) {
      console.error("Erro na busca de CPF duplicado:", err);
    } finally {
      setSearching(false);
    }
  }

  function usarEmpresaExistente() {
    if (!empresaExistente) return;
    if (tipo === "PJ") {
      if (empresaExistente.razaoSocial) setEmpRazao(empresaExistente.razaoSocial);
      if (empresaExistente.cnpj) setEmpCnpj(maskCNPJ(empresaExistente.cnpj));
      if (empresaExistente.representante) setReprNome(empresaExistente.representante);
      if (empresaExistente.cpfRepresentante) setReprCpf(maskCPF(empresaExistente.cpfRepresentante));
      if (empresaExistente.telefone) setEmpTelefone(empresaExistente.telefone);
      if (empresaExistente.email) setEmpEmail(empresaExistente.email);
      setValorPJ(""); // Conforme briefing: deixar em branco para a nova operação
    } else {
      if (empresaExistente.nome) setNome(empresaExistente.nome);
      if (empresaExistente.cpf) setCpf(maskCPF(empresaExistente.cpf));
      if (empresaExistente.celular || empresaExistente.telefone) {
        setCelular(empresaExistente.celular || empresaExistente.telefone || "");
      }
      if (empresaExistente.email) setEmail(empresaExistente.email);
      setValorPF(""); // Deixar em branco
    }
    setEmpresaIdVinculada(empresaExistente.id || empresaExistente.cnpj || empresaExistente.cpf || "vinculada");
    setEmpresaExistente(null);
  }

  function ignorarEmpresaExistente() {
    setEmpresaExistente(null);
  }

  function validate(): string {
    if (tipo === "PJ") {
      if (!empRazao.trim()) return "Razão Social é obrigatória.";
      if (empCnpj.replace(/\D/g, "").length !== 14) return "CNPJ deve ter 14 dígitos.";
    } else {
      if (!nome.trim()) return "Nome completo é obrigatório.";
      if (cpf.replace(/\D/g, "").length !== 11) return "CPF deve ter 11 dígitos.";
    }
    return "";
  }

  async function handleSubmit() {
    const msg = validate();
    if (msg) { setError(msg); return; }
    setError("");
    setSaving(true);
    try {
      const payload = tipo === "PF"
        ? {
            tipo_pessoa: "PF",
            produto: produtoPF,
            nome,
            cpf,
            celular,
            email,
            valorFinanciamento: parseMoney(valorPF) || undefined,
            empresaIdVinculada: empresaIdVinculada || undefined,
            vinculada: !!empresaIdVinculada,
          }
        : {
            tipo_pessoa: "PJ",
            emp_razao: empRazao,
            emp_cnpj: empCnpj,
            emp_repr_nome: reprNome,
            emp_repr_cpf: reprCpf,
            emp_email: empEmail,
            emp_telefone: empTelefone,
            valor_solicitado: parseMoney(valorPJ) || undefined,
            empresaIdVinculada: empresaIdVinculada || undefined,
            vinculada: !!empresaIdVinculada,
          };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Erro ao salvar");
      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao salvar lead.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-[var(--color-text)]">
              {empresaIdVinculada ? "Nova Proposta Vinculada" : "Novo Lead"}
            </h2>
            {empresaIdVinculada && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                Cliente existente
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--color-surface-subtle)] rounded-lg">
            <X className="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>
        </div>

        {/* Tipo selector */}
        <div className="px-6 pt-5 pb-2">
          <p className="label-base mb-2">Tipo de Proposta</p>
          <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden text-sm font-medium w-fit">
            {(["PJ", "PF"] as TipoPessoa[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTipo(t); setError(""); setEmpresaExistente(null); }}
                className={`px-5 py-2 transition-colors ${tipo === t ? "bg-[var(--color-brand-primary)] text-white" : "bg-white text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]"}`}
              >
                {t === "PJ" ? "Pessoa Jurídica — BDMG" : "Pessoa Física"}
              </button>
            ))}
          </div>
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {tipo === "PJ" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="label-base mb-1">Razão Social <span className="text-red-500">*</span></label>
                  <input
                    className="input-base w-full"
                    placeholder="Nome da empresa"
                    value={empRazao}
                    onChange={(e) => setEmpRazao(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="label-base">CNPJ <span className="text-red-500">*</span></label>
                    {searching && <span className="text-[10px] text-blue-600 flex items-center gap-1"><Loader2 className="w-2.5 h-2.5 animate-spin" /> Verificando...</span>}
                  </div>
                  <input
                    className="input-base w-full font-mono"
                    placeholder="00.000.000/0000-00"
                    value={empCnpj}
                    onChange={(e) => setEmpCnpj(maskCNPJ(e.target.value))}
                    onBlur={handleCNPJBlur}
                    maxLength={18}
                  />
                </div>
                <div>
                  <label className="label-base mb-1">Valor Solicitado</label>
                  <input
                    className="input-base w-full font-mono"
                    placeholder="R$ 0,00"
                    value={valorPJ}
                    onChange={(e) => setValorPJ(maskMoney(e.target.value))}
                  />
                </div>

                {/* Banner Inline de Duplicata (Mudança 1) */}
                {empresaExistente && (
                  <div className="col-span-2 bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 space-y-3 animate-in fade-in duration-200 shadow-sm">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-xs font-bold text-amber-900">
                            Empresa já cadastrada no sistema
                          </p>
                          {empresaExistente.etapaAtual && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${FASE_COLOR[empresaExistente.etapaAtual] || "bg-amber-100 text-amber-800 border-amber-300"}`}>
                              {KANBAN_LABEL[empresaExistente.etapaAtual] || empresaExistente.etapaAtual}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {empresaExistente.razaoSocial}
                        </p>
                        <p className="text-xs font-mono text-slate-600">
                          CNPJ: {formatCNPJ(empresaExistente.cnpj || empCnpj)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-amber-200">
                      <button
                        type="button"
                        onClick={usarEmpresaExistente}
                        className="flex-1 px-3 py-2 bg-[#1F3A5F] text-white hover:bg-[#162a45] rounded-lg text-xs font-semibold transition-colors shadow-sm text-center"
                      >
                        Criar nova proposta para este cliente
                      </button>
                      <button
                        type="button"
                        onClick={ignorarEmpresaExistente}
                        className="px-3 py-2 bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-medium transition-colors text-center"
                      >
                        Cadastrar como novo lead
                      </button>
                    </div>
                  </div>
                )}

                {empresaIdVinculada && (
                  <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      Vinculada à empresa existente (uma nova proposta será criada)
                    </span>
                    <button
                      type="button"
                      onClick={() => setEmpresaIdVinculada(null)}
                      className="text-blue-600 hover:underline text-[11px] font-semibold ml-2"
                    >
                      Desvincular
                    </button>
                  </div>
                )}

                <div className="col-span-2">
                  <label className="label-base mb-1">Representante Legal</label>
                  <input
                    className="input-base w-full"
                    placeholder="Nome completo"
                    value={reprNome}
                    onChange={(e) => setReprNome(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-base mb-1">CPF do Representante</label>
                  <input
                    className="input-base w-full font-mono"
                    placeholder="000.000.000-00"
                    value={reprCpf}
                    onChange={(e) => setReprCpf(maskCPF(e.target.value))}
                    maxLength={14}
                  />
                </div>
                <div>
                  <label className="label-base mb-1">Telefone</label>
                  <input
                    className="input-base w-full"
                    placeholder="(00) 00000-0000"
                    value={empTelefone}
                    onChange={(e) => setEmpTelefone(e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="label-base mb-1">E-mail</label>
                  <input
                    className="input-base w-full"
                    type="email"
                    placeholder="contato@empresa.com"
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="label-base mb-1">Produto <span className="text-red-500">*</span></label>
                  <select className="input-base w-full" value={produtoPF} onChange={(e) => setProdutoPF(e.target.value)}>
                    {PRODUTO_PF_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="label-base mb-1">Nome Completo <span className="text-red-500">*</span></label>
                  <input
                    className="input-base w-full"
                    placeholder="Nome do proponente"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="label-base">CPF <span className="text-red-500">*</span></label>
                    {searching && <span className="text-[10px] text-blue-600 flex items-center gap-1"><Loader2 className="w-2.5 h-2.5 animate-spin" /> Verificando...</span>}
                  </div>
                  <input
                    className="input-base w-full font-mono"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(maskCPF(e.target.value))}
                    onBlur={handleCPFBlur}
                    maxLength={14}
                  />
                </div>
                <div>
                  <label className="label-base mb-1">Valor do Financiamento</label>
                  <input
                    className="input-base w-full font-mono"
                    placeholder="R$ 0,00"
                    value={valorPF}
                    onChange={(e) => setValorPF(maskMoney(e.target.value))}
                  />
                </div>

                {/* Banner Inline de Duplicata PF (Mudança 1) */}
                {empresaExistente && (
                  <div className="col-span-2 bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 space-y-3 animate-in fade-in duration-200 shadow-sm">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-xs font-bold text-amber-900">
                            Cliente já cadastrado no sistema
                          </p>
                          {empresaExistente.etapaAtual && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${FASE_COLOR[empresaExistente.etapaAtual] || "bg-amber-100 text-amber-800 border-amber-300"}`}>
                              {KANBAN_LABEL[empresaExistente.etapaAtual] || empresaExistente.etapaAtual}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {empresaExistente.nome || empresaExistente.razaoSocial}
                        </p>
                        <p className="text-xs font-mono text-slate-600">
                          CPF: {maskCPF(empresaExistente.cpf || cpf)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-amber-200">
                      <button
                        type="button"
                        onClick={usarEmpresaExistente}
                        className="flex-1 px-3 py-2 bg-[#1F3A5F] text-white hover:bg-[#162a45] rounded-lg text-xs font-semibold transition-colors shadow-sm text-center"
                      >
                        Criar nova proposta para este cliente
                      </button>
                      <button
                        type="button"
                        onClick={ignorarEmpresaExistente}
                        className="px-3 py-2 bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-medium transition-colors text-center"
                      >
                        Cadastrar como novo lead
                      </button>
                    </div>
                  </div>
                )}

                {empresaIdVinculada && (
                  <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      Vinculado ao cliente existente (uma nova proposta será criada)
                    </span>
                    <button
                      type="button"
                      onClick={() => setEmpresaIdVinculada(null)}
                      className="text-blue-600 hover:underline text-[11px] font-semibold ml-2"
                    >
                      Desvincular
                    </button>
                  </div>
                )}

                <div>
                  <label className="label-base mb-1">Celular</label>
                  <input
                    className="input-base w-full"
                    placeholder="(00) 00000-0000"
                    value={celular}
                    onChange={(e) => setCelular(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-base mb-1">E-mail</label>
                  <input
                    className="input-base w-full"
                    type="email"
                    placeholder="nome@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[var(--color-border)]">
          <Button variant="ghost" onClick={onClose} className="flex-1" disabled={saving}>Cancelar</Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Salvando…</> : empresaIdVinculada ? "Criar Proposta" : "Criar Lead"}
          </Button>
        </div>
      </div>
    </div>
  );
}
