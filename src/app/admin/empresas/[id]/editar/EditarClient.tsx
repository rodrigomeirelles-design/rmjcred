"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Proposta, PropostaFormData } from "@/types";
import Step1Empresa from "@/components/form/steps/Step1Empresa";
import Step2Socios from "@/components/form/steps/Step2Socios";
import Step3Banco from "@/components/form/steps/Step3Banco";
import { maskMoney, parseMoney, formatCNPJ } from "@/lib/utils";
import { Save, X, Loader2 } from "lucide-react";

function propostaToFormData(p: Proposta): PropostaFormData {
  return {
    emp_razao: p.emp_razao || "",
    emp_fantasia: p.emp_fantasia || "",
    emp_cnpj: p.emp_cnpj || "",
    emp_funcionarios: p.emp_funcionarios || 0,
    emp_repr_nome: p.emp_repr_nome || "",
    emp_repr_cpf: p.emp_repr_cpf || "",
    emp_email: p.emp_email || "",
    emp_telefone: p.emp_telefone || "",
    emp_cep: p.emp_cep || "",
    emp_logradouro: p.emp_logradouro || "",
    emp_numero: p.emp_numero || "",
    emp_complemento: p.emp_complemento || "",
    emp_bairro: p.emp_bairro || "",
    emp_cidade: p.emp_cidade || "",
    emp_uf: (p.emp_uf || "") as PropostaFormData["emp_uf"],
    emp_imovel: (p.emp_imovel || "nao") as "sim" | "nao",
    emp_imovel_tipo: p.emp_imovel_tipo || "",
    emp_imovel_valor: p.emp_imovel_valor,
    emp_regime_tributario: p.emp_regime_tributario || "",
    socios: p.socios?.length ? p.socios : [{
      nome: "", cpf: "", rg: "", participacao: 100,
      nascimento: "", estado_civil: "", profissao: "", nacionalidade: "Brasileira",
      email: "", telefone: "", renda: 0,
      cep: "", logradouro: "", numero: "", complemento: "",
      bairro: "", cidade: "", uf: "",
      possui_imovel: "nao", imovel_valor: null, possui_veiculo: "nao", veiculo_placas: [],
    }],
    banco_nome: p.banco_nome || "",
    banco_numero: p.banco_numero || "",
    banco_agencia: p.banco_agencia || "",
    banco_conta: p.banco_conta || "",
    banco_digito: p.banco_digito || "",
    obs_finais: p.obs_finais || "",
    aceite_lgpd: true,
  };
}

export default function EditarClient({ proposta }: { proposta: Proposta }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valorInput, setValorInput] = useState(
    proposta.valor_solicitado != null
      ? proposta.valor_solicitado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : ""
  );

  const form = useForm<PropostaFormData>({
    defaultValues: propostaToFormData(proposta),
    mode: "onBlur",
  });

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const data = form.getValues();
      const valor = valorInput ? parseMoney(valorInput) : undefined;

      const payload: Record<string, unknown> = {
        emp_razao: data.emp_razao,
        emp_fantasia: data.emp_fantasia,
        emp_cnpj: data.emp_cnpj,
        emp_funcionarios: data.emp_funcionarios,
        emp_repr_nome: data.emp_repr_nome,
        emp_repr_cpf: data.emp_repr_cpf,
        emp_email: data.emp_email,
        emp_telefone: data.emp_telefone,
        emp_cep: data.emp_cep,
        emp_logradouro: data.emp_logradouro,
        emp_numero: data.emp_numero,
        emp_complemento: data.emp_complemento,
        emp_bairro: data.emp_bairro,
        emp_cidade: data.emp_cidade,
        emp_uf: data.emp_uf,
        emp_imovel: data.emp_imovel,
        emp_imovel_tipo: data.emp_imovel_tipo,
        emp_imovel_valor: data.emp_imovel_valor,
        emp_regime_tributario: data.emp_regime_tributario,
        banco_nome: data.banco_nome,
        banco_numero: data.banco_numero,
        banco_agencia: data.banco_agencia,
        banco_conta: data.banco_conta,
        banco_digito: data.banco_digito,
        obs_finais: data.obs_finais,
        socios: JSON.stringify(data.socios),
      };

      if (valor !== undefined && !isNaN(valor) && valor > 0) {
        payload.valor_solicitado = valor;
      }

      const res = await fetch(`/api/propostas/${proposta.id_proposta}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!result.success) {
        setError("Erro ao salvar alterações. Tente novamente.");
        return;
      }

      router.push("/admin/empresas");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between gap-4 flex-shrink-0 bg-[var(--color-surface)] sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-[var(--color-text)]">Editar Proposta</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            {proposta.emp_razao || formatCNPJ(proposta.emp_cnpj)} · #{proposta.id_proposta.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/empresas")}
            className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[var(--color-brand-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-primary-dark)] disabled:opacity-40 transition-colors flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar alterações
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
          )}

          <section className="card-base">
            <h2 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-5">Proposta</h2>
            <div className="max-w-xs">
              <label className="label-base">Valor do Crédito Solicitado</label>
              <input
                type="text"
                className="input-base"
                placeholder="R$ 0,00"
                value={valorInput}
                onChange={(e) => setValorInput(maskMoney(e.target.value))}
              />
            </div>
          </section>

          <section className="card-base">
            <h2 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-5">Dados da Empresa</h2>
            <Step1Empresa form={form} />
          </section>

          <section className="card-base">
            <h2 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-5">Sócios</h2>
            <Step2Socios form={form} />
          </section>

          <section className="card-base">
            <h2 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-5">Dados Bancários</h2>
            <Step3Banco form={form} />
          </section>

          <section className="card-base">
            <h2 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-5">Observações</h2>
            <div>
              <label className="label-base">Observações Finais</label>
              <textarea
                className="input-base min-h-[96px] resize-none"
                {...form.register("obs_finais")}
              />
            </div>
          </section>

          <div className="pb-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/empresas")}
              className="px-5 py-2.5 border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-[var(--color-brand-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-primary-dark)] disabled:opacity-40 transition-colors flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
