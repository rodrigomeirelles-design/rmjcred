"use client";

import { X } from "lucide-react";
import { DetailSection } from "@/lib/detailSchemas";

interface DetailPanelProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  sections: DetailSection[];
  onClose: () => void;
}

export default function DetailPanel({ title, subtitle, badge, actions, sections, onClose }: DetailPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-stretch">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-5 py-4 z-10">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-[var(--color-text)] truncate">{title}</p>
              {badge}
            </div>
            {subtitle && <p className="text-xs text-[var(--color-text-muted)] font-mono mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            {actions}
            <button onClick={onClose} className="p-1.5 hover:bg-[var(--color-surface-subtle)] rounded-lg text-[var(--color-text-muted)]">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-5 space-y-6">
          {sections.map((section, i) => {
            const rows = section.rows.filter((r) => r.value != null && r.value !== "");
            if (rows.length === 0) return null;
            return (
              <section key={i}>
                <h3 className="text-[10px] font-bold text-[var(--color-brand-primary)] uppercase tracking-widest mb-2 pb-1 border-b-2 border-[var(--color-brand-primary)]">
                  {section.title}
                </h3>
                <div>
                  {rows.map((r, j) =>
                    r.label === "" ? (
                      <p key={j} className="text-sm text-[var(--color-text)] leading-relaxed py-1.5 bg-[var(--color-surface-subtle)] rounded-lg px-3">
                        {r.value}
                      </p>
                    ) : (
                      <div key={j} className="flex gap-2 text-sm py-1.5 border-b border-[var(--color-border)] last:border-0">
                        <span className="text-[var(--color-text-muted)] w-44 flex-shrink-0 text-xs pt-0.5">{r.label}</span>
                        <span className={`flex-1 break-words font-medium ${r.mono ? "font-mono text-green-600" : "text-[var(--color-text)]"}`}>
                          {r.value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
