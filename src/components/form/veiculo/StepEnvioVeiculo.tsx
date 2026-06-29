"use client";

import { UseFormReturn } from "react-hook-form";
import { PropostaVeiculoFormData, ProdutoVeiculo } from "@/types/veiculo";
import Textarea from "@/components/ui/Textarea";
import { FileText, MapPin, CreditCard, FileCheck, Car } from "lucide-react";

interface Props {
  form: UseFormReturn<PropostaVeiculoFormData>;
  isSubmitting: boolean;
  produto: ProdutoVeiculo;
}

const DOCS_PESSOAIS = [
  { icon: CreditCard, text: "RG e CPF do proponente" },
  { icon: MapPin,     text: "Comprovante de residência recente" },
  { icon: FileText,   text: "Comprovante de renda (holerite, extrato ou declaração de IR)" },
  { icon: FileCheck,  text: "Extratos bancários — últimos 3 meses" },
];

const DOCS_VEICULO_FINANCIAMENTO = [
  { icon: Car,       text: "Nota fiscal ou avaliação do veículo" },
  { icon: FileText,  text: "CRLV do veículo (se usado)" },
  { icon: FileCheck, text: "Laudo de vistoria (para veículos usados)" },
];

const DOCS_VEICULO_GARANTIA = [
  { icon: Car,       text: "CRLV atualizado do veículo dado em garantia" },
  { icon: FileText,  text: "Nota fiscal ou documento de compra do veículo" },
  { icon: FileCheck, text: "Laudo de vistoria com avaliação de mercado" },
  { icon: FileCheck, text: "Declaração de quitação ou extrato do financiamento ativo" },
];

export default function StepEnvioVeiculo({ form, isSubmitting, produto }: Props) {
  const { register, formState: { errors } } = form;
  const isGarantia  = produto === "Crédito com Garantia de Veículo";
  const docsVeiculo = isGarantia ? DOCS_VEICULO_GARANTIA : DOCS_VEICULO_FINANCIAMENTO;

  return (
    <div className="space-y-6">
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Observações Finais
        </h2>
        <Textarea
          label="Observações (opcional)"
          hint="Informações adicionais relevantes para a análise"
          rows={4}
          placeholder="Ex: o veículo ainda está na concessionária, tem recall pendente..."
          {...register("observacoes")}
        />
      </div>

      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-1 pb-3 border-b border-[var(--color-border)]">
          Documentos Necessários
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4 mt-3">
          Após o envio, você receberá as instruções para enviar os documentos via WhatsApp ou e-mail.
        </p>

        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
          Documentos pessoais
        </p>
        <ul className="space-y-3 mb-5">
          {DOCS_PESSOAIS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-[var(--color-brand-primary)]" />
              </div>
              <span className="text-sm text-[var(--color-text)] pt-1.5">{text}</span>
            </li>
          ))}
        </ul>

        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
          Documentos do veículo
        </p>
        <ul className="space-y-3">
          {docsVeiculo.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-sm text-[var(--color-text)] pt-1.5">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card-form border-[var(--color-brand-primary)]/30">
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
