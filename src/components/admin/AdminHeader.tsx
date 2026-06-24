"use client";

import { usePathname } from "next/navigation";
import { User } from "lucide-react";

const BREADCRUMBS: Record<string, string> = {
  "/admin/propostas": "Propostas",
  "/admin/empresas": "Empresas",
  "/admin/configuracoes": "Configurações",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const page = BREADCRUMBS[pathname] || "Admin";

  return (
    <header className="h-14 bg-[var(--color-brand-primary)] flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-2 text-sm text-blue-200">
        <span className="text-white font-semibold">CRM RMJ</span>
        <span>/</span>
        <span>{page}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm text-white font-medium hidden sm:block">Admin</span>
      </div>
    </header>
  );
}
