"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Kanban, Building2, User, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/propostas", icon: Kanban, label: "Propostas" },
  { href: "/admin/empresas", icon: Building2, label: "Pessoa Jurídica" },
  { href: "/admin/pf", icon: User, label: "Pessoa Física" },
  { href: "/admin/configuracoes", icon: Settings, label: "Configurações" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  if (pathname === "/admin/login" || pathname === "/admin/esqueci-senha") return null;

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col h-full" style={{ background: "#234469" }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "#ee661b" }}
          >
            <span className="text-white font-bold text-xs">RMJ</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight tracking-wide">CRM RMJ</p>
            <p className="text-white/50 text-[11px] font-medium">Soluções de Crédito</p>
          </div>
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
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all",
                active
                  ? "bg-[#ee661b] text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5">
        <div className="border-t border-white/10 pt-3">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/8 transition-colors">
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            Suporte
          </button>
        </div>
      </div>
    </aside>
  );
}
