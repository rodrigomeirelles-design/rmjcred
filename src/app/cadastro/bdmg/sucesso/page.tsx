import { Suspense } from "react";
import SucessoContent from "./SucessoContent";

export default function SucessoPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-[var(--color-text-muted)]">Carregando...</div>}>
      <SucessoContent />
    </Suspense>
  );
}
