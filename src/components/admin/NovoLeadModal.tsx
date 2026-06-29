"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { maskCPF, maskCNPJ, maskMoney, parseMoney } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

type TipoPessoa = "PJ" | "PF";

const PRODUTO_PF_OPTIONS = [
  { value: "Financiamento Imobiliário", label: "Financiamento Imobiliário" },
  { value: "Crédito com Garantia de Imóvel", label: "Home Equity (Crédito com Garantia de Imóvel)" },
  { value: "Financiamento de Veículos", label: "Financiamento de Veículos" },
  { value: "Crédito com Garantia de Veículo", label: "Garantia de Veículo" },
  { value: "Consórcio", label: "Consórcio" },
];

export default function NovoLeadModal({ onClose, onSuccess }: Props) {
  const [tipo, setTipo] = useState<TipoPessoa>("PJ");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // PJ fields
  const [empRazao, setEmpRazao] = useState("");
  const [empCnpj, setEmpCnpj] = useState("");
  const [reprNome, setReprNome] = useState("");
  const [reprCpf, setReprCpf] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empTelefone, setEmpTelefone] = useState("");
  const [valorPJ, setValorPJ] = useState("");

  // PF fields
  const [produtoPF, setProdutoPF] = useState("Financiamento Imobiliário");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [valorPF, setValorPF] = useState("");

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
          <h2 className="font-semibold text-[var(--color-text)]">Novo Lead</h2>
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
                onClick={() => { setTipo(t); setError(""); }}
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
                  <input className="input-base w-full" placeholder="Nome da empresa" value={empRazao} onChange={(e) => setEmpRazao(e.target.value)} />
                </div>
                <div>
                  <label className="label-base mb-1">CNPJ <span className="text-red-500">*</span></label>
                  <input className="input-base w-full font-mono" placeholder="00.000.000/0000-00" value={empCnpj} onChange={(e) => setEmpCnpj(maskCNPJ(e.target.value))} maxLength={18} />
                </div>
                <div>
                  <label className="label-base mb-1">Valor Solicitado</label>
                  <input className="input-base w-full font-mono" placeholder="R$ 0,00" value={valorPJ} onChange={(e) => setValorPJ(maskMoney(e.target.value))} />
                </div>
                <div className="col-span-2">
                  <label className="label-base mb-1">Representante Legal</label>
                  <input className="input-base w-full" placeholder="Nome completo" value={reprNome} onChange={(e) => setReprNome(e.target.value)} />
                </div>
                <div>
                  <label className="label-base mb-1">CPF do Representante</label>
                  <input className="input-base w-full font-mono" placeholder="000.000.000-00" value={reprCpf} onChange={(e) => setReprCpf(maskCPF(e.target.value))} maxLength={14} />
                </div>
                <div>
                  <label className="label-base mb-1">Telefone</label>
                  <input className="input-base w-full" placeholder="(00) 00000-0000" value={empTelefone} onChange={(e) => setEmpTelefone(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="label-base mb-1">E-mail</label>
                  <input className="input-base w-full" type="email" placeholder="contato@empresa.com" value={empEmail} onChange={(e) => setEmpEmail(e.target.value)} />
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
                  <input className="input-base w-full" placeholder="Nome do proponente" value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>
                <div>
                  <label className="label-base mb-1">CPF <span className="text-red-500">*</span></label>
                  <input className="input-base w-full font-mono" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(maskCPF(e.target.value))} maxLength={14} />
                </div>
                <div>
                  <label className="label-base mb-1">Valor do Financiamento</label>
                  <input className="input-base w-full font-mono" placeholder="R$ 0,00" value={valorPF} onChange={(e) => setValorPF(maskMoney(e.target.value))} />
                </div>
                <div>
                  <label className="label-base mb-1">Celular</label>
                  <input className="input-base w-full" placeholder="(00) 00000-0000" value={celular} onChange={(e) => setCelular(e.target.value)} />
                </div>
                <div>
                  <label className="label-base mb-1">E-mail</label>
                  <input className="input-base w-full" type="email" placeholder="nome@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
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
            {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Salvando…</> : "Criar Lead"}
          </Button>
        </div>
      </div>
    </div>
  );
}
