import type { Metadata } from "next";
import FormLogo from "@/components/form/FormLogo";

export const metadata: Metadata = {
  title: "Proposta de Capital de Giro BDMG | RMJ Soluções de Crédito",
  description: "Preencha sua proposta de Capital de Giro junto ao BDMG através da RMJ Soluções de Crédito.",
};

export default function CadastroBdmgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#F2F6FB" }}>
      {/* Header branded */}
      <header style={{ background: "#234469" }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FormLogo />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-white/70 text-xs font-medium">
              <svg className="w-3.5 h-3.5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Dados protegidos pela LGPD
            </div>
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <div className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "#ee661b", color: "#fff" }}>
              Parceiro BDMG
            </div>
          </div>
        </div>

        {/* Progress bar decorative */}
        <div className="h-0.5" style={{ background: "linear-gradient(90deg, #ee661b 0%, #f2814a 50%, transparent 100%)" }} />
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="mt-12 border-t border-[#D8E2EE]" style={{ background: "#fff" }}>
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5A6E88]">
          <p className="font-semibold" style={{ color: "#234469" }}>RMJ Soluções de Crédito · Itajubá, MG</p>
          <p>Dados protegidos conforme Lei 13.709/2018 (LGPD)</p>
        </div>
      </footer>
    </div>
  );
}
