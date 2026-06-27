import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface Props {
  searchParams: Promise<{ nome?: string; produto?: string }>;
}

export default async function SucessoImovelPage({ searchParams }: Props) {
  const { nome, produto } = await searchParams;

  return (
    <div className="max-w-lg mx-auto text-center py-8">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: "rgb(34 197 94 / 0.12)" }}>
        <CheckCircle2 className="w-10 h-10" style={{ color: "#16a34a" }} />
      </div>

      <h1 className="text-2xl font-bold mb-3" style={{ color: "#234469" }}>
        Proposta recebida!
      </h1>
      {nome && (
        <p className="text-base mb-2" style={{ color: "#5A6E88" }}>
          Obrigado, <strong style={{ color: "#234469" }}>{nome}</strong>!
        </p>
      )}
      <p className="text-sm mb-2" style={{ color: "#5A6E88" }}>
        Sua proposta de{" "}
        <strong style={{ color: "#234469" }}>{produto ?? "crédito imobiliário"}</strong>{" "}
        foi registrada com sucesso.
      </p>
      <p className="text-sm mb-8" style={{ color: "#5A6E88" }}>
        Nossa equipe entrará em contato pelo WhatsApp ou e-mail cadastrado em até{" "}
        <strong>24 horas úteis</strong> para dar continuidade à análise.
      </p>

      <div className="card-form text-left mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#5A6E88" }}>
          Próximos passos
        </p>
        <ol className="space-y-3">
          {[
            "Nossa equipe analisará os dados informados",
            "Entraremos em contato para solicitar os documentos necessários",
            "Você receberá o resultado da análise de crédito",
          ].map((step, i) => (
            <li key={step} className="flex items-start gap-3 text-sm" style={{ color: "#234469" }}>
              <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 text-white"
                style={{ background: "#ee661b" }}>
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <Link
        href="/cadastro/imovel"
        className="text-sm font-medium transition-colors"
        style={{ color: "#ee661b" }}
      >
        ← Enviar outra proposta
      </Link>
    </div>
  );
}
