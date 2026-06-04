// src/lib/dataStore.ts

/**
 * Camada de Abstração de Persistência.
 *   development  → SQLite local via better-sqlite3 (importado dinamicamente)
 *   production   → Google Apps Script via HTTP POST
 *
 * better-sqlite3 NUNCA é importado estaticamente aqui.
 */
import { sendToGas, type GasPayload } from "./gasClient";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export interface SaveResult {
  ok: boolean;
  id?: number | bigint;
  destination: "sqlite" | "gas";
  error?: string;
}

export async function saveCadastro(
  formType: string,
  data: Record<string, unknown>
): Promise<SaveResult> {
  if (IS_PRODUCTION) {
    return saveToGas(formType, data);
  }
  return saveToSqlite(formType, data);
}

async function saveToGas(
  formType: string,
  data: Record<string, unknown>
): Promise<SaveResult> {
  const payload: GasPayload = { formType, data };
  try {
    await sendToGas(payload);
    return { ok: true, destination: "gas" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[dataStore] Falha ao enviar para GAS:", message);
    return { ok: false, destination: "gas", error: message };
  }
}

async function saveToSqlite(
  formType: string,
  data: Record<string, unknown>
): Promise<SaveResult> {
  let db: any;
  try {
    db = (await import("./db")).default;
  } catch (err) {
    console.error("[dataStore] Não foi possível carregar o módulo db:", err);
    return {
      ok: false,
      destination: "sqlite",
      error: "Falha ao carregar módulo de banco de dados local.",
    };
  }

  if (!db) {
    return {
      ok: false,
      destination: "sqlite",
      error: "Banco de dados SQLite não inicializado.",
    };
  }

  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS cadastros (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        form_type  TEXT    NOT NULL,
        payload    TEXT    NOT NULL,
        created_at TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
      )
    `);
    const stmt = db.prepare(
      "INSERT INTO cadastros (form_type, payload) VALUES (?, ?)"
    );
    const result = stmt.run(formType, JSON.stringify(data));
    return { ok: true, destination: "sqlite", id: result.lastInsertRowid };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[dataStore] Erro ao gravar no SQLite:", message);
    return { ok: false, destination: "sqlite", error: message };
  }
}
