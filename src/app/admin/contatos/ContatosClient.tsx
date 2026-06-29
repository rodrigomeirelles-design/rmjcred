"use client";

import { useState, useMemo } from "react";
import { Search, User, Building2, Calendar, FileText, Phone, Mail } from "lucide-react";
import { formatCNPJ, maskCPF, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface Produto {
  id: string;
  nome: string;
  data: string;
  etapa: string;
}

interface Contato {
  documento: string;
  nome: string;
  email: string;
  celular: string;
  tipo: "PF" | "PJ";
  produtos: Produto[];
}

export default function ContatosClient({ contatos }: { contatos: Contato[] }) {
  const [busca, setBusca] = useState("");

  const filtered = useMemo(() => {
    if (!busca) return contatos;
    const q = busca.toLowerCase();
    const qDoc = busca.replace(/\D/g, "");
    return contatos.filter((c) => 
      c.nome.toLowerCase().includes(q) || 
      (qDoc && c.documento.includes(qDoc))
    );
  }, [contatos, busca]);

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">
      {/* Header & Search */}
      <div className="px-6 py-5 border-b border-[var(--color-border)] flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)] tracking-tight">Contatos</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Busque clientes e veja o histórico de propostas.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou CNPJ..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-base w-full pl-9"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[var(--color-text-muted)]">
              Nenhum contato encontrado.
            </div>
          ) : (
            filtered.map((c) => (
              <div key={c.documento} className="bg-white border border-[var(--color-border)] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center flex-shrink-0">
                      {c.tipo === "PF" ? <User className="w-5 h-5 text-[var(--color-text-muted)]" /> : <Building2 className="w-5 h-5 text-[var(--color-text-muted)]" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--color-text)] leading-tight">{c.nome}</h3>
                      <p className="text-xs text-[var(--color-text-muted)] font-mono mt-0.5">
                        {c.tipo === "PF" ? formatCNPJ(c.documento) : formatCNPJ(c.documento)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={c.tipo === "PF" ? "default" : "info"}>{c.tipo}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-[var(--color-text-muted)]">
                  {c.celular && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> <span>{c.celular}</span>
                    </div>
                  )}
                  {c.email && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" /> <span className="truncate">{c.email}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-[var(--color-border)] pt-4">
                  <h4 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Histórico de Propostas</h4>
                  <div className="space-y-2">
                    {c.produtos.map((p, i) => (
                      <div key={i} className="flex items-center justify-between bg-[var(--color-surface-subtle)] px-3 py-2 rounded-lg text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                          <span className="font-medium text-[var(--color-text)]">{p.nome}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="default" className="text-[10px]">{p.etapa.replace(/_/g, " ")}</Badge>
                          <span className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDate(p.data?.split("T")[0])}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
