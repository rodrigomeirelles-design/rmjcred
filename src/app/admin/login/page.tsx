"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"login" | "forgot" | "verify">("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        if (router) router.push("/admin");
      } else {
        setError(data.error || "E-mail ou senha inválidos.");
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar fazer login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", email }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess("Um código de verificação foi enviado para o seu e-mail.");
        setStep("verify");
      } else {
        setError(data.error || "Falha ao enviar código.");
      }
    } catch (err) {
      setError("Erro ao solicitar código de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", email, code }),
      });

      const data = await res.json();
      if (data.success) {
        if (router) router.push("/admin");
      } else {
        setError(data.error || "Código incorreto ou expirado.");
      }
    } catch (err) {
      setError("Erro ao verificar o código de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        backgroundColor: "var(--neutral-light)",
        padding: "2rem",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "2.5rem",
          borderRadius: "var(--radius-lg)",
          backgroundColor: "var(--neutral-white)",
          boxShadow: "0 10px 30px rgba(17,34,63,0.06)",
          border: "1px solid var(--neutral-border)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.8rem",
              color: "var(--primary-dark)",
              margin: "0 0 0.5rem 0",
              fontWeight: 700,
            }}
          >
            RMJ <span style={{ color: "var(--secondary-color)", fontWeight: "normal", fontStyle: "italic" }}>Admin</span>
          </h1>
          <p style={{ color: "var(--neutral-muted)", fontSize: "0.9rem", margin: 0 }}>
            {step === "login" && "Entre com as credenciais administrativas"}
            {step === "forgot" && "Informe seu e-mail para receber o código"}
            {step === "verify" && "Digite o código recebido por e-mail"}
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fff5f5",
              color: "var(--accent-color)",
              border: "1px solid #fed7d7",
              padding: "0.75rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.85rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              backgroundColor: "#f0fff4",
              color: "#38a169",
              border: "1px solid #c6f6d5",
              padding: "0.75rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.85rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {success}
          </div>
        )}

        {step === "login" && (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--primary-dark)" }}>E-mail *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rodrigomeirelles@gmail.com"
                style={{
                  padding: "0.75rem",
                  border: "1px solid var(--neutral-border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--primary-dark)" }}>Senha *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                style={{
                  padding: "0.75rem",
                  border: "1px solid var(--neutral-border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ textAlign: "right" }}>
              <button
                type="button"
                onClick={() => setStep("forgot")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary-color)",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem" }}
            >
              {loading ? "Entrando..." : "Entrar no Painel 🚀"}
            </button>
          </form>
        )}

        {step === "forgot" && (
          <form onSubmit={handleSendCode} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--primary-dark)" }}>E-mail Administrativo *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rodrigomeirelles@gmail.com"
                style={{
                  padding: "0.75rem",
                  border: "1px solid var(--neutral-border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setStep("login")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--neutral-muted)",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                &larr; Voltar para Login
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem" }}
            >
              {loading ? "Enviando..." : "Enviar Código de Acesso 📧"}
            </button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={handleVerifyCode} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--primary-dark)" }}>Código de Verificação *</label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="Ex: 123456"
                style={{
                  padding: "0.75rem",
                  border: "1px solid var(--neutral-border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  letterSpacing: "4px",
                  textAlign: "center",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setStep("forgot")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--neutral-muted)",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                &larr; Reenviar Código
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem" }}
            >
              {loading ? "Verificando..." : "Confirmar e Entrar 🔑"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
