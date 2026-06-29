import Link from "next/link";
import { Car, Shield, ChevronRight } from "lucide-react";

export default function CadastroVeiculoPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3" style={{ color: "#234469" }}>
          Crédito para Veículos
        </h1>
        <p className="text-base" style={{ color: "#5A6E88" }}>
          Escolha o produto mais adequado para você. Nossa equipe analisará sua proposta em até 24 horas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          href="/cadastro/veiculo/financiamento"
          className="group card-form hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer block"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: "rgb(35 68 105 / 0.08)" }}>
            <Car className="w-6 h-6" style={{ color: "#234469" }} />
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ color: "#234469" }}>
            Financiamento de Veículo
          </h2>
          <p className="text-sm mb-4" style={{ color: "#5A6E88" }}>
            Financie seu carro, moto ou caminhão novo ou usado com parcelas que cabem no seu bolso.
          </p>
          <ul className="space-y-1.5 mb-5">
            {[
              "Veículos novos e usados",
              "Parcelas de até 84 meses",
              "Consulta à tabela FIPE",
              "Análise em até 24 horas",
            ].map((item) => (
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

        <Link
          href="/cadastro/veiculo/garantia"
          className="group card-form hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer block"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: "rgb(238 102 27 / 0.08)" }}>
            <Shield className="w-6 h-6" style={{ color: "#ee661b" }} />
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ color: "#234469" }}>
            Crédito com Garantia de Veículo
          </h2>
          <p className="text-sm mb-4" style={{ color: "#5A6E88" }}>
            Use seu veículo quitado ou financiado como garantia e obtenha crédito com taxas reduzidas.
          </p>
          <ul className="space-y-1.5 mb-5">
            {[
              "Veículo quitado ou financiado",
              "Crédito livre para qualquer finalidade",
              "Taxas menores que crédito pessoal",
              "Avaliação pela tabela FIPE",
            ].map((item) => (
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
      </div>

      <p className="text-center text-xs mt-8" style={{ color: "#5A6E88" }}>
        Tem dúvidas? Entre em contato conosco pelo WhatsApp antes de preencher.
      </p>
    </div>
  );
}
