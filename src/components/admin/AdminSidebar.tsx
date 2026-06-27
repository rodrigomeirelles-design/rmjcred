"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Kanban, Building2, User, DollarSign, Settings, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/propostas", icon: Kanban, label: "Propostas" },
  { href: "/admin/empresas", icon: Building2, label: "Pessoa Jurídica" },
  { href: "/admin/pf", icon: User, label: "Pessoa Física" },
  { href: "/admin/comissoes", icon: DollarSign, label: "Comissões" },
  { href: "/admin/configuracoes", icon: Settings, label: "Configurações" },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  if (pathname === "/admin/login" || pathname === "/admin/esqueci-senha") return null;

  return (
    <>
      {/* ── Mobile Overlay ─────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Sidebar Panel ──────────────────────────────────── */}
      <aside
        className={cn(
          // Desktop: always visible, static
          "md:relative md:translate-x-0 md:flex md:flex-shrink-0",
          // Mobile: fixed off-canvas drawer
          "fixed top-0 left-0 z-50 h-full",
          "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          !isOpen && "-translate-x-full md:translate-x-0",
          isOpen && "translate-x-0"
        )}
        style={{ width: "15rem" }}
      >
        <div
          className="flex flex-col h-full w-full"
          style={{
            background: "linear-gradient(160deg, #1e3f63 0%, #234469 60%, #1a3356 100%)",
            boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
          }}
        >
          {/* Logo + Close Button */}
          <div className="px-5 py-5 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                  style={{ background: "linear-gradient(135deg, #ee661b, #f2814a)" }}
                >
                  <span className="text-white font-bold text-xs tracking-wide">RMJ</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight tracking-wide">CRM RMJ</p>
                  <p className="text-white/50 text-[11px] font-medium">Soluções de Crédito</p>
                </div>
              </div>
              {/* Close button — mobile only */}
              <button
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                    active
                      ? "text-white shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/8"
                  )}
                  style={
                    active
                      ? { background: "linear-gradient(90deg, #ee661b 0%, #f2814a 100%)", boxShadow: "0 2px 8px rgba(238,102,27,0.35)" }
                      : {}
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-3 pb-6">
            <div className="border-t border-white/10 pt-3">
              <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/8 transition-colors">
                <HelpCircle className="w-4 h-4 flex-shrink-0" />
                Suporte
              </button>
            </div>
            {/* App version badge */}
            <div className="mt-4 px-3">
              <span className="text-[10px] text-white/20 font-mono tracking-widest uppercase">v1.0 · RMJ Hub</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
