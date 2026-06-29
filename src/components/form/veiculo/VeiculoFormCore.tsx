"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { PropostaVeiculoFormData, ProdutoVeiculo } from "@/types/veiculo";
import StepperVeiculo from "./StepperVeiculo";
import StepPessoalVeiculo from "./StepPessoalVeiculo";
import StepProfissionalVeiculo from "./StepProfissionalVeiculo";
import StepVeiculoFinanciamento from "./StepVeiculoFinanciamento";
import StepEnvioVeiculo from "./StepEnvioVeiculo";

interface Props {
  produto: ProdutoVeiculo;
}

const STEP_FIELDS: (keyof PropostaVeiculoFormData)[][] = [
  ["nome", "cpf", "rg", "nascimento", "estado_civil", "nome_mae", "celular", "email", "cep", "logradouro", "numero", "bairro", "cidade", "uf"],
  ["situacao_profissional", "renda_mensal", "banco"],
  ["veiculo_tipo", "veiculo_categoria", "veiculo_marca", "veiculo_modelo", "veiculo_ano_fabricacao", "valor_veiculo", "valor_financiamento", "parcelas"],
  ["aceite_lgpd"],
];

const DEFAULT_VALUES: PropostaVeiculoFormData = {
  nome: "", cpf: "", rg: "", rg_orgao_emissor: "", rg_data_emissao: "",
  nascimento: "", estado_civil: "", nacionalidade: "Brasileira", nome_mae: "",
  celular: "", telefone: "", email: "",
  cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "",
  tempo_residencia: "",
  situacao_profissional: "assalariado",
  empresa: "", empresa_cnpj: "", cargo: "", data_admissao: "",
  autonomo_empresa: "", autonomo_cnpj: "", autonomo_atividade: "", autonomo_tempo: "",
  renda_mensal: 0, outras_rendas: "", outras_rendas_valor: 0,
  banco: "", banco_agencia: "", banco_conta: "", banco_tipo_conta: undefined,
  veiculo_tipo: "novo", veiculo_categoria: "carros",
  veiculo_marca_id: "", veiculo_marca: "",
  veiculo_modelo_id: "", veiculo_modelo: "",
  veiculo_ano_id: "", veiculo_ano_fabricacao: "",
  veiculo_placa: "", veiculo_valor_fipe: 0,
  valor_veiculo: 0, valor_entrada: 0, valor_financiamento: 0, parcelas: "",
  veiculo_tem_divida: "nao", veiculo_saldo_devedor: 0,
  conjugeNome: "", conjugeCpf: "", conjugeNascimento: "",
  conjugeCelular: "", conjugeEmail: "", conjugeRenda: 0,
  observacoes: "", aceite_lgpd: false,
};

export default function VeiculoFormCore({ produto }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isGarantia = produto === "Crédito com Garantia de Veículo";

  const form = useForm<PropostaVeiculoFormData>({
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  async function handleNext() {
    const baseFields = STEP_FIELDS[currentStep - 1];
    let fields = [...baseFields];

    if (currentStep === 2) {
      const prof = form.getValues("situacao_profissional");
      if (prof === "assalariado") {
        fields = [...fields, "empresa", "cargo", "data_admissao"];
      } else if (prof === "autonomo") {
        fields = [...fields, "autonomo_atividade", "autonomo_tempo"];
      }
    }

    const valid = await form.trigger(fields as (keyof PropostaVeiculoFormData)[]);
    if (valid) {
      setCurrentStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    setCurrentStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleFinalSubmit() {
    const valid = await form.trigger(STEP_FIELDS[3]);
    if (!valid) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const data = form.getValues();
      const res = await fetch("/api/propostas-veiculo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, produto }),
      });
      const result = await res.json();
      if (result.success) {
        router.push(
          `/cadastro/veiculo/sucesso?nome=${encodeURIComponent(data.nome)}&produto=${encodeURIComponent(produto)}`
        );
      } else {
        setSubmitError("Erro ao enviar proposta. Tente novamente.");
      }
    } catch {
      setSubmitError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-3"
          style={{
            background: isGarantia ? "rgb(238 102 27 / 0.10)" : "rgb(35 68 105 / 0.08)",
            color:      isGarantia ? "#ee661b" : "#234469",
          }}
        >
          {produto}
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "#234469" }}>
          {isGarantia ? "Simulação de Crédito" : "Proposta de Financiamento"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#5A6E88" }}>
          Preencha os dados abaixo. Nossa equipe entrará em contato em até 24 horas.
        </p>
      </div>

      <StepperVeiculo currentStep={currentStep} />

      <form onSubmit={(e) => e.preventDefault()}>
        {currentStep === 1 && <StepPessoalVeiculo form={form} />}
        {currentStep === 2 && <StepProfissionalVeiculo form={form} />}
        {currentStep === 3 && <StepVeiculoFinanciamento form={form} isGarantia={isGarantia} />}
        {currentStep === 4 && (
          <StepEnvioVeiculo form={form} isSubmitting={isSubmitting} produto={produto} />
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
