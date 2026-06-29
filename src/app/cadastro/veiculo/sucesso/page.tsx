import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, Car } from "lucide-react";

function SucessoContent() {
  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: "rgb(34 197 94 / 0.1)" }}>
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>

      <h1 className="text-2xl font-bold mb-3" style={{ color: "#234469" }}>
        Proposta enviada com sucesso!
      </h1>
      <p className="text-base mb-6" style={{ color: "#5A6E88" }}>
        Recebemos sua solicitação. Nossa equipe entrará em contato em até{" "}
        <strong style={{ color: "#234469" }}>24 horas</strong> para dar continuidade à análise.
      </p>

      <div className="rounded-xl p-5 mb-8 text-left" style={{ background: "rgb(35 68 105 / 0.05)", border: "1px solid rgb(35 68 105 / 0.12)" }}>
        <div className="flex items-center gap-3 mb-3">
          <Car className="w-5 h-5" style={{ color: "#234469" }} />
          <span className="text-sm font-semibold" style={{ color: "#234469" }}>Próximos passos</span>
        </div>
        <ul className="space-y-2">
          {[
            "Nossa equipe analisará seus dados",
            "Entraremos em contato para solicitar os documentos",
            "Faremos a análise de crédito junto à instituição financeira",
            "Você receberá a proposta de financiamento para aprovação",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#5A6E88" }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                style={{ background: "#ee661b", color: "white" }}>
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
        style={{ background: "#ee661b" }}
      >
        Voltar ao início
      </Link>
    </div>
  );
}

export default function SucessoVeiculoPage() {
  return (
    <Suspense fallback={null}>
      <SucessoContent />
    </Suspense>
  );
}
