"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, MessageSquare, Mail, ArrowRight } from "lucide-react";

export default function SucessoContent() {
  const params = useSearchParams();
  const empresa = params.get("empresa") || "sua empresa";
  const id = params.get("id") || "";

  return (
    <div className="max-w-2xl mx-auto text-center py-8">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>

      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
        Proposta enviada com sucesso!
      </h1>
      <p className="text-[var(--color-text-muted)] text-lg mb-1">
        Recebemos a proposta de <strong className="text-[var(--color-text)]">{empresa}</strong>
      </p>
      {id && (
        <p className="text-xs text-[var(--color-text-muted)] font-mono bg-[var(--color-surface-subtle)] inline-block px-3 py-1 rounded-full mt-1 mb-6">
          ID: {id}
        </p>
      )}

      <div className="card-base text-left mb-6">
        <h2 className="font-semibold text-[var(--color-text)] mb-4">Próximos passos</h2>
        <ol className="space-y-4">
          {[
            { n: "1", text: "Nossa equipe analisará sua ficha em até 2 dias úteis" },
            { n: "2", text: "Você receberá um contato para envio dos documentos complementares" },
            { n: "3", text: "Após análise completa, encaminharemos a proposta ao BDMG" },
            { n: "4", text: "O BDMG realiza a análise final e comunica o resultado" },
          ].map(({ n, text }) => (
            <li key={n} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[var(--color-brand-primary)] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {n}
              </div>
              <span className="text-sm text-[var(--color-text)] pt-1">{text}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="card-base text-left mb-6">
        <h2 className="font-semibold text-[var(--color-text)] mb-3">Envie os documentos pelos canais abaixo:</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://api.whatsapp.com/send?phone=5535999999999&text=Olá,%20enviei%20a%20ficha%20de%20crédito%20BDMG%20e%20gostaria%20de%20enviar%20os%20documentos.%20ID:%20${id}"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp
            <ArrowRight className="w-3 h-3 ml-auto" />
          </a>
          <a
            href="mailto:contato@rmjcred.com.br"
            className="flex items-center gap-2 px-4 py-3 bg-[var(--color-surface-subtle)] text-[var(--color-text)] border border-[var(--color-border)] rounded-lg text-sm font-medium hover:bg-[var(--color-border)] transition-colors"
          >
            <Mail className="w-4 h-4" />
            E-mail
            <ArrowRight className="w-3 h-3 ml-auto" />
          </a>
        </div>
      </div>

      <Link
        href="https://www.rmjcred.com.br"
        className="text-sm text-[var(--color-brand-primary)] hover:underline"
      >
        ← Voltar ao site da RMJ
      </Link>
    </div>
  );
}
