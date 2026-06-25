import { User } from "lucide-react";

export default function PessoaFisicaPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-subtle)] flex items-center justify-center mb-5">
        <User className="w-8 h-8 text-[var(--color-text-muted)]" />
      </div>
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-2">Pessoa Física</h1>
      <p className="text-[var(--color-text-muted)] text-sm max-w-xs">
        Módulo em desenvolvimento. Em breve você poderá gerenciar propostas de crédito para pessoas físicas aqui.
      </p>
    </div>
  );
}
