"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Kanban, Building2, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/propostas", icon: Kanban, label: "Propostas" },
  { href: "/admin/empresas", icon: Building2, label: "Empresas" },
  { href: "/admin/configuracoes", icon: Settings, label: "Configurações" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 bg-[var(--color-secondary)] flex flex-col h-full"
      style={{ background: "#0F172A" }}>
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[var(--color-brand-primary)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">RMJ</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">CRM RMJ</p>
            <p className="text-slate-400 text-xs">Soluções de Crédito</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-brand-primary)] text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4">
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          Suporte
        </button>
      </div>
    </aside>
  );
}
