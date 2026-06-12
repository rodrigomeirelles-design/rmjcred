// src/lib/gasClient.ts

/**
 * Envia dados para o Google Apps Script (GAS) via HTTP POST.
 *
 * Variavel de ambiente necessaria:
 *   NEXT_PUBLIC_GAS_URL  - URL publica do Web App deployado no GAS
 */
const GAS_URL =
  process.env.NEXT_PUBLIC_GAS_URL ||
  process.env.NEXT_PUBLIC_GAS_WEB_APP_URL ||
  process.env.GAS_WEB_APP_URL;

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
  const finalUrl =
    GAS_URL ||
    "https://script.google.com/macros/s/AKfycbyYKZf1JbQBUk5y8GcW86BgsIqyoRZypl849czqJWuhSfGLdzGdMOURO6sw9RlUE7fZ/exec";

  const body: GasPayload = {
    ...payload,
    submittedAt: payload.submittedAt ?? new Date().toISOString(),
  };

  // Bug 1 fix: usar redirect:"manual" para evitar que o fetch converta POST->GET
  // no redirect 302 do GAS, e reenviar como POST para a URL de destino.
  const response = await fetch(finalUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    redirect: "manual",
  });

  let finalResponse = response;
  if (response.status === 301 || response.status === 302) {
    const location = response.headers.get("location");
    if (!location) throw new Error("GAS redirect sem Location header");
    finalResponse = await fetch(location, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  if (!finalResponse.ok) {
    throw new Error(
      "GAS retornou status inesperado: " +
        finalResponse.status +
        " " +
        finalResponse.statusText
    );
  }

  const text = await finalResponse.text();
  let json: GasResponse;
  try {
    json = JSON.parse(text);
  } catch {
    return { result: "success" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (json.result !== "success" && (json as any).success !== true) {
    throw new Error(json.message ?? "GAS retornou result de erro sem mensagem.");
  }

  return json;
}
