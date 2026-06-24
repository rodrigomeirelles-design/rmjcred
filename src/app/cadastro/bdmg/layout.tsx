import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proposta de Capital de Giro BDMG | RMJ Soluções de Crédito",
  description: "Preencha sua proposta de Capital de Giro junto ao BDMG através da RMJ Soluções de Crédito.",
};

export default function CadastroBdmgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="bg-[var(--color-brand-primary)] text-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RMJ</span>
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">RMJ Soluções de Crédito</p>
              <p className="text-blue-200 text-xs">Parceiro Oficial BDMG</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-blue-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Dados protegidos pela LGPD
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="mt-12 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-xs text-[var(--color-text-muted)]">
          <p>RMJ Soluções de Crédito · Itajubá, MG · Parceiro Oficial BDMG</p>
          <p className="mt-1">Seus dados são protegidos conforme a Lei 13.709/2018 (LGPD)</p>
        </div>
      </footer>
    </div>
  );
}
