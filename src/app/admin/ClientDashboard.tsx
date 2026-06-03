"use client";

import { useState } from "react";

export default function ClientDashboard() {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/admin/logout", {
        method: "POST",
      });
      if (res.ok) {
        window.location.href = "/admin/login";
      }
    } catch (err) {
      console.error("Erro ao sair:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  const copyToClipboard = (path: string) => {
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    alert(`Link copiado com sucesso:\n${fullUrl}`);
  };

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <button
        onClick={() => copyToClipboard("/cadastro/bdmg")}
        className="btn btn-accent"
        style={{ fontSize: "0.9rem", padding: "0.6rem 1.2rem" }}
      >
        Copiar Link Ficha BDMG 🔗
      </button>
      
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="btn btn-ghost"
        style={{ fontSize: "0.9rem", padding: "0.6rem 1.2rem" }}
      >
        {loggingOut ? "Saindo..." : "Sair do Painel 🚪"}
      </button>
    </div>
  );
}
