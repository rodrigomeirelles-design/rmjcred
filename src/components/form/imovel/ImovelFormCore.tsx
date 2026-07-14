"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { PropostaImovelFormData, ProdutoImovel } from "@/types/imovel";
import StepperImovel from "./StepperImovel";
import StepPessoal from "./StepPessoal";
import StepFinanceiro from "./StepFinanceiro";
import StepImovelFinanciamento from "./StepImovelFinanciamento";
import StepImovelHomeEquity from "./StepImovelHomeEquity";
import StepEnvioImovel from "./StepEnvioImovel";

interface ImovelFormCoreProps {
  produto: ProdutoImovel;
}

const STEP_FIELDS: (keyof PropostaImovelFormData)[][] = [
  ["nome", "cpf", "celular", "email", "nascimento", "rgCnh", "estadoCivil", "regimeCasamento", "nomeMae", "cep", "logradouro", "numero", "bairro", "cidade", "uf", "conjuge_nome", "conjuge_cpf", "conjuge_celular", "conjuge_email", "conjuge_nascimento", "conjuge_sexo", "conjuge_profissao", "conjuge_fonteRenda", "conjuge_rendaMensal", "conjugeFiliacao", "conjugeRg"],
  ["fonteRenda", "rendaMensal", "banco", "empresa_cnpj", "empresa_endereco", "empresa_ramo"],
  ["tipoImovel", "estadoConservacao", "valorImovel", "valorFinanciamento", "prazo"],
  ["aceite_lgpd"],
];

const STEP_FIELDS_HE: (keyof PropostaImovelFormData)[][] = [
  ["nome", "cpf", "celular", "email", "nascimento", "rgCnh", "estadoCivil", "regimeCasamento", "nomeMae", "cep", "logradouro", "numero", "bairro", "cidade", "uf", "conjuge_nome", "conjuge_cpf", "conjuge_celular", "conjuge_email", "conjuge_nascimento", "conjuge_sexo", "conjuge_profissao", "conjuge_fonteRenda", "conjuge_rendaMensal", "conjugeFiliacao", "conjugeRg"],
  ["fonteRenda", "rendaMensal", "banco", "empresa_cnpj", "empresa_endereco", "empresa_ramo"],
  ["tipoImovel", "estadoConservacao", "situacaoImovel", "imovel_cep", "imovel_logradouro", "imovel_numero", "imovel_bairro", "imovel_cidade", "imovel_uf", "valorImovel", "valorFinanciamento", "prazo"],
  ["aceite_lgpd"],
];

const DEFAULT_VALUES: PropostaImovelFormData = {
  nome: "", cpf: "", celular: "", email: "", nascimento: "",
  sexo: "", nomeMae: "", nomePai: "", rgCnh: "", orgaoEmissor: "",
  estadoCivil: "", naturalidade: "", nacionalidade: "Brasileira",
  cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "",
  fonteRenda: "", rendaMensal: 0, profissao: "", banco: "", agencia: "", conta: "",
  temSegundoProponente: false,
  tipoImovel: "", estadoConservacao: "", valorImovel: 0, valorFinanciamento: 0, prazo: "", ufImovel: "",
  usarFgts: "nao", valorFgts: 0,
  regimeUniao: "", conjuge_nome: "", conjuge_cpf: "", conjuge_celular: "",
  conjuge_email: "", conjuge_nascimento: "", conjuge_sexo: "", conjuge_profissao: "",
  conjuge_fonteRenda: "", conjuge_rendaMensal: 0,
  observacoes: "", aceite_lgpd: false,
};

export default function ImovelFormCore({ produto }: ImovelFormCoreProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isHE = produto === "Crédito com Garantia de Imóvel";
  const stepFields = isHE ? STEP_FIELDS_HE : STEP_FIELDS;

  const form = useForm<PropostaImovelFormData>({
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  async function handleNext() {
    const fields = stepFields[currentStep - 1];
    const valid = await form.trigger(fields);
    if (valid) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleFinalSubmit() {
    const valid = await form.trigger(stepFields[3]);
    if (!valid) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const data = form.getValues();
      const res = await fetch("/api/propostas-imovel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, produto }),
      });
      const result = await res.json();
      if (result.success) {
        router.push(`/cadastro/imovel/sucesso?nome=${encodeURIComponent(data.nome)}&produto=${encodeURIComponent(produto)}`);
      } else {
        setSubmitError("Erro ao enviar proposta. Tente novamente.");
      }
    } catch {
      setSubmitError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const produtoLabel = isHE ? "Crédito com Garantia de Imóvel" : "Financiamento Imobiliário";

  return (
    <div>
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-3"
          style={{ background: isHE ? "rgb(238 102 27 / 0.10)" : "rgb(35 68 105 / 0.08)", color: isHE ? "#ee661b" : "#234469" }}>
          {produtoLabel}
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "#234469" }}>
          {isHE ? "Simulação de Crédito" : "Proposta de Financiamento"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#5A6E88" }}>
          Preencha os dados abaixo. Nossa equipe entrará em contato em até 24 horas.
        </p>
      </div>

      <StepperImovel currentStep={currentStep} />

      <form onSubmit={(e) => e.preventDefault()}>
        {currentStep === 1 && <StepPessoal form={form} />}
        {currentStep === 2 && <StepFinanceiro form={form} />}
        {currentStep === 3 && (
          isHE
            ? <StepImovelHomeEquity form={form} />
            : <StepImovelFinanciamento form={form} />
        )}
        {currentStep === 4 && (
          <StepEnvioImovel form={form} isSubmitting={isSubmitting} produto={produto} />
        )}

        {submitError && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div className="flex items-center justify-between mt-8 gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2.5 border rounded-xl text-sm font-semibold transition-colors"
              style={{ borderColor: "#D8E2EE", color: "#234469" }}
            >
              ← Voltar
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#ee661b" }}
            >
              Continuar →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: "#ee661b" }}
            >
              {isSubmitting ? "Enviando..." : "Enviar Proposta ✓"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
