import crypto from "crypto";

const SECRET_KEY = process.env.ADMIN_SESSION_SECRET || "rmj_super_secret_session_key_2026_itajuba";

// A sessão expira em 1 hora
const SESSION_DURATION_MS = 60 * 60 * 1000;

export function createSessionToken(email: string): string {
  const expiry = Date.now() + SESSION_DURATION_MS;
  const data = `${email}:${expiry}`;
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(data)
    .digest("hex");
  return `${data}:${signature}`;
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(":");
  if (parts.length !== 3) return null;

  const [email, expiryStr, signature] = parts;
  const expiry = parseInt(expiryStr, 10);

  if (isNaN(expiry) || expiry < Date.now()) {
    return null; // Token expirado
  }

  // Verifica a assinatura
  const data = `${email}:${expiryStr}`;
  const expectedSignature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(data)
    .digest("hex");

  if (signature !== expectedSignature) {
    return null; // Assinatura inválida/tamperizada
  }

  return email;
}
