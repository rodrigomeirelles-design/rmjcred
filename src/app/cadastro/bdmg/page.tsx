"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { PropostaFormData } from "@/types";
import FormStepper from "@/components/form/FormStepper";
import Step1Empresa from "@/components/form/steps/Step1Empresa";
import Step2Socios from "@/components/form/steps/Step2Socios";
import Step3Banco from "@/components/form/steps/Step3Banco";
import Step4Envio from "@/components/form/steps/Step4Envio";
import Button from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

const STEP_FIELDS: (keyof PropostaFormData)[][] = [
  ["emp_razao", "emp_cnpj", "emp_funcionarios", "emp_regime_tributario", "emp_repr_nome", "emp_repr_cpf", "emp_email", "emp_telefone", "emp_cep", "emp_logradouro", "emp_numero", "emp_bairro", "emp_cidade", "emp_uf", "emp_imovel"],
  ["socios"],
  ["banco_nome", "banco_numero", "banco_agencia", "banco_conta", "banco_digito"],
  ["aceite_lgpd"],
];

export default function CadastroBdmgPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<PropostaFormData>({
    defaultValues: {
      emp_imovel: undefined,
      socios: [{
        nome: "", cpf: "", rg: "", participacao: 100,
        nascimento: "", estado_civil: "", profissao: "", nacionalidade: "Brasileira",
        email: "", telefone: "", renda: 0,
        cep: "", logradouro: "", numero: "", complemento: "",
        bairro: "", cidade: "", uf: "",
        possui_imovel: "nao", imovel_valor: null, possui_veiculo: "nao", veiculo_placas: [],
      }],
      aceite_lgpd: false,
    },
    mode: "onBlur",
  });

  async function handleNext() {
    const fields = STEP_FIELDS[currentStep - 1];
    const valid = await form.trigger(fields as any);
    if (!valid) return;
    if (currentStep === 2) {
      const socios = form.getValues("socios") || [];
      const total = socios.reduce((sum, s) => sum + (Number(s.participacao) || 0), 0);
      if (total > 100) {
        form.setError("socios", { message: "A soma das participações não pode ultrapassar 100%" });
        return;
      }
      const cpfs = socios.map((s) => s.cpf.replace(/\D/g, ""));
      const uniqueCpfs = new Set(cpfs);
      if (uniqueCpfs.size !== cpfs.length) {
        form.setError("socios", { message: "CPFs duplicados entre sócios" });
        return;
      }
    }
    setCurrentStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleFinalSubmit() {
    const valid = await form.trigger(STEP_FIELDS[3] as any);
    if (!valid) return;
    await handleSubmit(form.getValues());
  }

  async function handleSubmit(data: PropostaFormData) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const id = crypto.randomUUID();
      const payload = {
        ...data,
        id_proposta: id,
        timestamp_envio: new Date().toISOString(),
        produto: "BDMG Capital de Giro",
        coluna_kanban: "novo_negocio",
        status_repasse: "pendente",
      };

      const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
      if (appsScriptUrl) {
        const res = await fetch(appsScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (!result.success) {
          setSubmitError(result.errors?.join(", ") || "Erro ao enviar. Tente novamente.");
          setIsSubmitting(false);
          return;
        }
      } else {
        const res = await fetch("/api/propostas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (!result.success) {
          setSubmitError(result.error || "Erro ao enviar.");
          setIsSubmitting(false);
          return;
        }
      }

      router.push(`/cadastro/bdmg/sucesso?id=${id}&empresa=${encodeURIComponent(data.emp_razao)}`);
    } catch {
      setSubmitError("Erro de conexão. Verifique sua internet e tente novamente.");
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "#234469" }}>
          Proposta de Capital de Giro — BDMG
        </h1>
        <p className="text-[var(--color-text-muted)] mt-1 text-sm">
          Preencha os dados abaixo para iniciar sua análise de crédito
        </p>
      </div>

      <FormStepper currentStep={currentStep} />

      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
        {currentStep === 1 && <Step1Empresa form={form} />}
        {currentStep === 2 && <Step2Socios form={form} />}
        {currentStep === 3 && <Step3Banco form={form} />}
        {currentStep === 4 && <Step4Envio form={form} isSubmitting={isSubmitting} />}

        {submitError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => { setCurrentStep((s) => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={isSubmitting}
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <Button type="button" variant="accent" onClick={handleNext}>
              Próximo <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="button" variant="accent" loading={isSubmitting} disabled={isSubmitting} onClick={handleFinalSubmit}>
              <Send className="w-4 h-4" /> Enviar Proposta
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
