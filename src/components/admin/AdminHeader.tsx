"use client";

import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, Menu, ChevronRight } from "lucide-react";

const BREADCRUMBS: Record<string, string> = {
  "/admin/propostas": "Propostas",
  "/admin/empresas": "Empresas",
  "/admin/pf": "Pessoa Física",
  "/admin/comissoes": "Comissões",
  "/admin/configuracoes": "Configurações",
};

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
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
    <header
      className="h-14 flex items-center justify-between px-4 flex-shrink-0 sticky top-0 z-30"
      style={{
        background: "rgba(242, 246, 251, 0.85)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        borderBottom: "1px solid rgba(216, 226, 238, 0.7)",
      }}
    >
      {/* Left: hamburger (mobile) + breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] transition-colors flex-shrink-0"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm min-w-0">
          <span className="text-[var(--color-text-muted)] font-medium hidden sm:block flex-shrink-0">CRM RMJ</span>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--color-border-strong)] hidden sm:block flex-shrink-0" />
          <span className="text-[var(--color-text)] font-semibold truncate">{page}</span>
        </div>
      </div>

      {/* Right: user + logout */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
            style={{ background: "linear-gradient(135deg, #234469, #1a3356)" }}
          >
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-[var(--color-text)] font-semibold hidden sm:block">Admin</span>
        </div>

        <div className="w-px h-5 bg-[var(--color-border)] hidden sm:block" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] transition-colors text-sm font-medium"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Sair</span>
        </button>
      </div>
    </header>
  );
}
