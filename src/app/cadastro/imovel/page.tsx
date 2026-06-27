import Link from "next/link";
import { Home, Building2, ChevronRight } from "lucide-react";

export default function CadastroImovelPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3" style={{ color: "#234469" }}>
          Crédito Imobiliário
        </h1>
        <p className="text-base" style={{ color: "#5A6E88" }}>
          Escolha o produto mais adequado para você. Nossa equipe analisará sua proposta em até 24 horas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          href="/cadastro/imovel/financiamento"
          className="group card-form hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer block"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: "rgb(35 68 105 / 0.08)" }}>
            <Home className="w-6 h-6" style={{ color: "#234469" }} />
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ color: "#234469" }}>
            Financiamento Imobiliário
          </h2>
          <p className="text-sm mb-4" style={{ color: "#5A6E88" }}>
            Compre seu imóvel com parcelas longas de até 30 anos. Utilização de FGTS disponível.
          </p>
          <ul className="space-y-1.5 mb-5">
            {["Imóveis residenciais e comerciais", "Prazo até 360 meses", "Utilização do FGTS", "Taxas competitivas"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs" style={{ color: "#5A6E88" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#ee661b" }} />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all"
            style={{ color: "#ee661b" }}>
            Preencher proposta <ChevronRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/cadastro/imovel/home-equity"
          className="group card-form hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer block"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: "rgb(238 102 27 / 0.08)" }}>
            <Building2 className="w-6 h-6" style={{ color: "#ee661b" }} />
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ color: "#234469" }}>
            Crédito com Garantia de Imóvel
          </h2>
          <p className="text-sm mb-4" style={{ color: "#5A6E88" }}>
            Use seu imóvel quitado ou financiado como garantia e obtenha crédito com as melhores taxas.
          </p>
          <ul className="space-y-1.5 mb-5">
            {["Imóvel como garantia (home equity)", "Crédito livre para qualquer finalidade", "Taxas menores que crédito pessoal", "Prazo até 240 meses"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs" style={{ color: "#5A6E88" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#234469" }} />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all"
            style={{ color: "#234469" }}>
            Preencher proposta <ChevronRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      <p className="text-center text-xs mt-8" style={{ color: "#5A6E88" }}>
        Tem dúvidas? Entre em contato conosco pelo WhatsApp antes de preencher.
      </p>
    </div>
  );
}
