// src/hooks/useCadastroSubmit.ts

"use client";

import { useState, useCallback } from "react";

export type FormType = "bdmg" | "financiamento-imobiliario";

interface UseCadastroSubmitOptions {
  formType: FormType;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

interface UseCadastroSubmitReturn {
  submit: (data: Record<string, unknown>) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export function useCadastroSubmit({
  formType,
  onSuccess,
  onError,
}: UseCadastroSubmitOptions): UseCadastroSubmitReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = useCallback(
    async (data: Record<string, unknown>) => {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);
      setErrorMessage(null);

      // Tentativa 1: API Route Next.js
      const apiSuccess = await tryApiRoute(formType, data);
      if (apiSuccess) {
        setIsSuccess(true);
        setIsLoading(false);
        onSuccess?.();
        return;
      }

      // Tentativa 2: Fallback direto ao GAS (client-side, no-cors)
      console.warn("[useCadastroSubmit] API route falhou. Acionando fallback GAS...");
      const gasSuccess = await tryGasFallback(formType, data);
      if (gasSuccess) {
        setIsSuccess(true);
        setIsLoading(false);
        onSuccess?.();
        return;
      }

      const msg = "Não foi possível enviar os dados. Verifique sua conexão e tente novamente.";
      setIsError(true);
      setErrorMessage(msg);
      setIsLoading(false);
      onError?.(msg);
    },
    [formType, onSuccess, onError]
  );

  return { submit, isLoading, isSuccess, isError, errorMessage };
}

async function tryApiRoute(
  formType: FormType,
  data: Record<string, unknown>
): Promise<boolean> {
  try {
    const response = await fetch(`/api/cadastro/${formType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) return false;
    
    const result = await response.json();
    return !!result.success;
  } catch (err) {
    console.error("[useCadastroSubmit] Erro de rede na API route:", err);
    return false;
  }
}

async function tryGasFallback(
  formType: FormType,
  data: Record<string, unknown>
): Promise<boolean> {
  const gasUrl = process.env.NEXT_PUBLIC_GAS_URL || process.env.NEXT_PUBLIC_GAS_WEB_APP_URL;
  if (!gasUrl) {
    console.error("[useCadastroSubmit] NEXT_PUBLIC_GAS_URL não definida. Fallback impossível.");
    return false;
  }

  try {
    await fetch(gasUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType,
        data,
        submittedAt: new Date().toISOString(),
        source: "client-fallback",
      }),
    });
    return true;
  } catch (err) {
    console.error("[useCadastroSubmit] Fallback GAS falhou:", err);
    return false;
  }
}
