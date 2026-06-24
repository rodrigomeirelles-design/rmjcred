"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, KeyRound, Lock, Loader2, CheckCircle2 } from "lucide-react";

type Step = "request" | "verify" | "reset" | "success";

export default function EsqueciSenhaPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("rodrigomeirelles@gmail.com");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_code", email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep("verify");
      } else {
        setError(data.error || "Erro ao solicitar código");
      }
    } catch (err) {
      setError("Erro interno ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_code", email, code }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep("reset");
      } else {
        setError(data.error || "Código inválido");
      }
    } catch (err) {
      setError("Erro interno ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_password", email, code, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep("success");
      } else {
        setError(data.error || "Erro ao redefinir senha");
      }
    } catch (err) {
      setError("Erro interno ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden relative">
        <Link 
          href="/admin/login"
          className="absolute top-4 left-4 p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        
        <div className="p-8 pt-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-[var(--color-brand-primary)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">Recuperar Senha</h1>
            <p className="text-[var(--color-text-muted)] mt-2">
              {step === "request" && "Informe seu e-mail para receber o código."}
              {step === "verify" && "Insira o código de 6 dígitos enviado."}
              {step === "reset" && "Crie uma nova senha segura."}
              {step === "success" && "Senha redefinida com sucesso!"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 text-center">
              {error}
            </div>
          )}

          {step === "request" && (
            <form onSubmit={handleRequestCode} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  E-mail do Administrador
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-base pl-10 w-full"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 flex justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Código"}
              </button>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5 text-center">
                  Código de Verificação
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                  className="input-base w-full text-center text-2xl tracking-[0.5em] font-mono py-3"
                  placeholder="000000"
                />
              </div>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="btn-primary w-full py-2.5 flex justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verificar Código"}
              </button>
              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={handleRequestCode}
                  disabled={loading}
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)]"
                >
                  Reenviar código
                </button>
              </div>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-base pl-10 w-full"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 flex justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar Nova Senha"}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <Link
                href="/admin/login"
                className="btn-primary w-full inline-block py-2.5"
              >
                Ir para o Login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
