import Link from "next/link";
import { Car, Shield, ChevronRight, CheckCircle2 } from "lucide-react";

const CARDS = [
  {
    href: "/cadastro/veiculo/financiamento",
    icon: Car,
    iconColor: "#234469",
    iconBg: "rgb(35 68 105 / 0.08)",
    accentColor: "#234469",
    title: "Financiamento de Veículo",
    description: "Financie seu carro, moto ou caminhão — novo ou usado — com parcelas que cabem no seu bolso.",
    features: ["Veículos novos e usados", "Parcelas de até 60 meses", "Consulta à tabela FIPE", "Análise em até 24 horas"],
    cta: "Iniciar proposta",
    badge: "Mais solicitado",
  },
  {
    href: "/cadastro/veiculo/garantia",
    icon: Shield,
    iconColor: "#ee661b",
    iconBg: "rgb(238 102 27 / 0.08)",
    accentColor: "#ee661b",
    title: "Crédito com Garantia de Veículo",
    description: "Use seu veículo quitado como garantia e obtenha crédito com taxas muito menores que o crédito pessoal.",
    features: ["Veículo quitado ou financiado", "Crédito livre para qualquer finalidade", "Taxas reduzidas vs. crédito pessoal", "Avaliação pela tabela FIPE"],
    cta: "Iniciar proposta",
    badge: null,
  },
];

export default function CadastroVeiculoPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 px-2">
        <div
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
          style={{ background: "rgb(238 102 27 / 0.10)", color: "#ee661b" }}
        >
          <Car className="w-3.5 h-3.5" />
          Crédito Veicular
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight" style={{ color: "#234469" }}>
          Qual produto você precisa?
        </h1>
        <p className="text-base sm:text-lg" style={{ color: "#5A6E88" }}>
          Escolha a modalidade e preencha uma proposta em poucos minutos.
          Nossa equipe analisa e retorna em até 24 horas.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group relative flex flex-col rounded-2xl border bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ borderColor: "rgb(35 68 105 / 0.12)" }}
            >
              {card.badge && (
                <div
                  className="absolute top-3.5 right-3.5 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: card.accentColor }}
                >
                  {card.badge}
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: card.iconBg }}
                >
                  <Icon className="w-6 h-6" style={{ color: card.iconColor }} />
                </div>

                {/* Title + desc */}
                <h2 className="text-xl font-bold mb-2" style={{ color: "#234469" }}>
                  {card.title}
                </h2>
                <p className="text-sm mb-5 leading-relaxed" style={{ color: "#5A6E88" }}>
                  {card.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "#5A6E88" }}>
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: card.accentColor }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div
                  className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 group-hover:opacity-90 group-hover:gap-3"
                  style={{ background: card.accentColor }}
                >
                  {card.cta}
                  <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs mt-8 px-4" style={{ color: "#5A6E88" }}>
        Tem dúvidas?{" "}
        <a
          href="https://wa.me/5535999999999"
          className="font-semibold underline"
          style={{ color: "#234469" }}
        >
          Fale conosco no WhatsApp
        </a>{" "}
        antes de preencher.
      </p>
    </div>
  );
}
