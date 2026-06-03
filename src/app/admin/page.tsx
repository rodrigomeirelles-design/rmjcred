import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/utils/auth";
import Link from "next/link";
import ClientDashboard from "./ClientDashboard";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("rmj_admin_session")?.value;
  const adminEmail = verifySessionToken(sessionToken);

  // Redireciona para o login se a sessão não for válida
  if (!adminEmail) {
    redirect("/admin/login");
  }

  return (
    <div style={{ backgroundColor: "var(--neutral-light)", minHeight: "90vh", padding: "2rem 0" }}>
      <div className="container">
        
        {/* Topo do Painel */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          <div>
            <h1 style={{ fontSize: "2rem", color: "var(--primary-dark)", margin: 0 }}>
              Painel de Controle <span style={{ color: "var(--secondary-color)", fontWeight: "normal", fontStyle: "italic" }}>CRM</span>
            </h1>
            <p style={{ color: "var(--neutral-muted)", margin: "0.25rem 0 0 0", fontSize: "0.95rem" }}>
              Logado como: <strong>{adminEmail}</strong>
            </p>
          </div>
          
          <ClientDashboard />
        </div>

        {/* Informações Importantes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            marginBottom: "2rem"
          }}
        >
          {/* Box de Links Rápidos */}
          <div
            className="glass-panel"
            style={{
              padding: "2rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--neutral-white)",
              border: "1px solid var(--neutral-border)"
            }}
          >
            <h3 style={{ color: "var(--primary-color)", margin: "0 0 1rem 0" }}>Fichas de Cadastro Qualificado</h3>
            <p style={{ color: "var(--neutral-muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>
              Envie estes links diretamente pelo WhatsApp para os clientes qualificados preencherem as propostas estruturadas:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              <div style={{ padding: "0.75rem", backgroundColor: "var(--neutral-light)", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ fontSize: "0.85rem", display: "block" }}>Crédito BDMG PJ</strong>
                  <span style={{ fontSize: "0.8rem", color: "var(--neutral-muted)" }}>/cadastro/bdmg</span>
                </div>
                <Link href="/cadastro/bdmg" target="_blank" className="btn btn-ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>
                  Visualizar &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Box de Status do Google Sheets */}
          <div
            className="glass-panel"
            style={{
              padding: "2rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--neutral-white)",
              border: "1px solid var(--neutral-border)"
            }}
          >
            <h3 style={{ color: "var(--primary-color)", margin: "0 0 1rem 0" }}>Configuração do Banco de Dados (GAS)</h3>
            <p style={{ color: "var(--neutral-muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>
              Todos os leads coletados no site público e as propostas enviadas na Ficha PJ são salvos diretamente em sua planilha do Google Drive de forma automatizada.
            </p>
            <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#f0fff4", color: "#38a169", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", border: "1px solid #c6f6d5" }}>
              <strong>Status:</strong> Mapeamento Dinâmico por Cabeçalhos Ativo (Seguro contra novas colunas).
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
