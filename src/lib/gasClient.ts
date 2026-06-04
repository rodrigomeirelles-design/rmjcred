// src/lib/gasClient.ts

/**
 * Envia dados para o Google Apps Script (GAS) via HTTP POST.
 *
 * Variável de ambiente necessária:
 *   NEXT_PUBLIC_GAS_URL  — URL pública do Web App deployado no GAS
 */
const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || process.env.NEXT_PUBLIC_GAS_WEB_APP_URL || process.env.GAS_WEB_APP_URL;

export interface GasPayload {
  formType: string;
  data: Record<string, unknown>;
  submittedAt?: string;
}

export interface GasResponse {
  result: "success" | "error";
  message?: string;
}

export async function sendToGas(payload: GasPayload): Promise<GasResponse> {
  const finalUrl = GAS_URL || "https://script.google.com/macros/s/AKfycbzR6m199DyTnnTN2aeiekwuFdY5Le9MW6M4NyqcbofBNiUH7He4Ri_OpLZuEhSHzWAuWQ/exec";
  
  const body: GasPayload = {
    ...payload,
    submittedAt: payload.submittedAt ?? new Date().toISOString(),
  };

  const response = await fetch(finalUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(
      `GAS retornou status inesperado: ${response.status} ${response.statusText}`
    );
  }

  const text = await response.text();
  let json: GasResponse;
  try {
    json = JSON.parse(text);
  } catch {
    return { result: "success" };
  }

  if (json.result !== "success" && (json as any).success !== true) {
    throw new Error(json.message ?? "GAS retornou result de erro sem mensagem.");
  }

  return json;
}
