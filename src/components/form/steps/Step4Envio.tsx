"use client";

import { UseFormReturn } from "react-hook-form";
import { PropostaFormData } from "@/types";
import Textarea from "@/components/ui/Textarea";
import { CheckCircle2, FileText, FileCheck, MapPin, CreditCard, Building2 } from "lucide-react";

interface Step4Props {
  form: UseFormReturn<PropostaFormData>;
  isSubmitting: boolean;
}

const DOCUMENTOS = [
  { icon: FileText, text: "IRPF dos últimos 2 anos de todos os sócios" },
  { icon: FileCheck, text: "Extrato Simples Nacional PGDAS-D" },
  { icon: MapPin, text: "Comprovantes de endereço (empresa e sócios)" },
  { icon: CreditCard, text: "RG e CPF de todos os sócios" },
  { icon: Building2, text: "Cartão CNPJ atualizado" },
];

export default function Step4Envio({ form, isSubmitting }: Step4Props) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="card-base">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Observações Finais
        </h2>
        <Textarea
          label="Observações (opcional)"
          hint="Espaço para informações adicionais sobre o faturamento ou particularidades da operação de crédito"
          rows={4}
          placeholder="Ex: A empresa possui sazonalidade no faturamento, sendo o mês de dezembro o de maior receita..."
          {...register("obs_finais")}
        />
      </div>

      <div className="card-base">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 pb-3 border-b border-[var(--color-border)]">
          Documentos Necessários
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          Após o envio desta ficha, você receberá as instruções para enviar os documentos abaixo
          via WhatsApp ou e-mail.
        </p>
        <ul className="space-y-3">
          {DOCUMENTOS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-[var(--color-brand-primary)]" />
              </div>
              <span className="text-sm text-[var(--color-text)] pt-1.5">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card-base border-[var(--color-brand-primary)]/30">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="aceite_lgpd"
            aria-required="true"
            className="mt-1 w-4 h-4 accent-[var(--color-brand-primary)] flex-shrink-0"
            {...register("aceite_lgpd", { required: "É necessário aceitar os termos para enviar a proposta" })}
          />
          <div>
            <label htmlFor="aceite_lgpd" className="text-sm text-[var(--color-text)] cursor-pointer leading-relaxed">
              Autorizo o tratamento dos dados pessoais informados neste formulário exclusivamente
              para fins de análise de crédito, conforme a{" "}
              <strong>Lei 13.709/2018 (LGPD)</strong>. Declaro que as informações prestadas são
              verdadeiras e assumo a responsabilidade civil e criminal por eventuais falsidades.
            </label>
            {errors.aceite_lgpd && (
              <p className="text-xs text-red-500 mt-1">{errors.aceite_lgpd.message}</p>
            )}
          </div>
        </div>
      </div>

      {isSubmitting && (
        <div className="flex items-center justify-center gap-3 py-4 text-[var(--color-text-muted)]">
          <svg className="animate-spin h-5 w-5 text-[var(--color-brand-primary)]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Enviando sua proposta...</span>
        </div>
      )}
    </div>
  );
}
