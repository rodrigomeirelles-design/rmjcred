import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-[var(--color-brand-primary)] rounded-2xl flex items-center justify-center mx-auto">
          <span className="text-white font-bold text-xl">RMJ</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">CRM RMJ</h1>
        <p className="text-[var(--color-text-muted)]">Soluções de Crédito</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Link href="/cadastro/bdmg" className="btn-primary px-6 py-2.5 text-sm rounded-lg">
            Preencher Proposta BDMG
          </Link>
          <Link href="/admin" className="btn-outline px-6 py-2.5 text-sm rounded-lg">
            Painel Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
