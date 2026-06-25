"use client";

import { usePathname, useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";

const BREADCRUMBS: Record<string, string> = {
  "/admin/propostas": "Propostas",
  "/admin/empresas": "Empresas",
  "/admin/configuracoes": "Configurações",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login" || pathname === "/admin/esqueci-senha") return null;

  const page = BREADCRUMBS[pathname] || "Admin";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="h-14 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[var(--color-text-muted)] font-medium">CRM RMJ</span>
        <span className="text-[var(--color-border-strong)]">/</span>
        <span className="text-[var(--color-text)] font-semibold">{page}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#234469" }}>
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-[var(--color-text)] font-semibold hidden sm:block">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] p-2 rounded-lg transition-colors flex items-center gap-1.5"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:block">Sair</span>
        </button>
      </div>
    </header>
  );
}
