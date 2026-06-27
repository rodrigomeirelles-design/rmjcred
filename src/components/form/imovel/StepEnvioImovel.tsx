"use client";

import { UseFormReturn } from "react-hook-form";
import { PropostaImovelFormData, ProdutoImovel } from "@/types/imovel";
import Textarea from "@/components/ui/Textarea";
import { FileText, MapPin, CreditCard, FileCheck, Home } from "lucide-react";

interface StepEnvioImovelProps {
  form: UseFormReturn<PropostaImovelFormData>;
  isSubmitting: boolean;
  produto: ProdutoImovel;
}

const DOCS_PESSOAIS = [
  { icon: CreditCard, text: "RG/CNH e CPF do(s) proponente(s)" },
  { icon: MapPin,     text: "Comprovante de residência recente" },
  { icon: FileText,   text: "Comprovante de renda (holerite, extrato ou declaração)" },
  { icon: FileText,   text: "IRPF — últimos 2 exercícios" },
  { icon: FileCheck,  text: "Extratos bancários — últimos 3 meses" },
];

const DOCS_IMOVEL_FINANCIAMENTO = [
  { icon: Home,      text: "Matrícula do imóvel atualizada (30 dias)" },
  { icon: FileText,  text: "IPTU — guia do exercício atual" },
  { icon: FileCheck, text: "Certidão negativa de ônus — cartório de registro" },
];

const DOCS_IMOVEL_HOME_EQUITY = [
  { icon: Home,      text: "Matrícula do imóvel atualizada (30 dias)" },
  { icon: FileText,  text: "IPTU — guia do exercício atual" },
  { icon: FileCheck, text: "Certidão negativa de ônus — cartório de registro" },
  { icon: FileCheck, text: "Certidão negativa de débitos municipais" },
];

export default function StepEnvioImovel({ form, isSubmitting, produto }: StepEnvioImovelProps) {
  const { register, formState: { errors } } = form;
  const docsImovel = produto === "Crédito com Garantia de Imóvel" ? DOCS_IMOVEL_HOME_EQUITY : DOCS_IMOVEL_FINANCIAMENTO;

  return (
    <div className="space-y-6">
      <div className="card-form">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-5 pb-3 border-b border-[var(--color-border)]">
          Observações Finais
        </h2>
        <Textarea
          label="Observações (opcional)"
          hint="Informações adicionais relevantes para a análise da operação"
          rows={4}
          placeholder="Ex: O imóvel está em reforma, tem financiamento em andamento pelo banco X..."
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

        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">Documentos pessoais</p>
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

        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">Documentos do imóvel</p>
        <ul className="space-y-3">
          {docsImovel.map(({ icon: Icon, text }) => (
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
