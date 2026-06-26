import { google } from "googleapis";

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error(
      "[Sheets Reader] Variáveis GOOGLE_SERVICE_ACCOUNT_EMAIL ou GOOGLE_PRIVATE_KEY não configuradas."
    );
  }

  return new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

function parseSheet(sheetData: { values?: string[][] } | null): Record<string, string>[] {
  if (!sheetData?.values || sheetData.values.length < 2) return [];
  const headers = sheetData.values[0];
  return sheetData.values.slice(1)
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] ?? "";
      });
      return obj;
    });
}

export interface ClienteUnificado {
  id: string;
  razao_social: string;
  cnpj: string;
  faturamento: number;
  fonte: string;
  total_oportunidades: number;
  created_at: string;
}

export async function readClientesFromSheets(): Promise<ClienteUnificado[]> {
  const spreadsheetId =
    process.env.GOOGLE_SHEET_ID || "1D8kQJSUp5UwlUsc-9-P9Nj-rft0BADbGeBg0aHPjT-8";

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: ["Empresas!A:Z", "LeadsRapidos!A:Z"],
  });

  const valueRanges = res.data.valueRanges ?? [];
  const empresasRows = parseSheet(valueRanges[0] as { values?: string[][] } | null);
  const leadsRows = parseSheet(valueRanges[1] as { values?: string[][] } | null);

  const clientes: ClienteUnificado[] = [];
  const cnpjsSeen = new Set<string>();

  for (const emp of empresasRows) {
    const cnpj = emp["CNPJ"] ?? "";
    if (!cnpj) continue;
    cnpjsSeen.add(cnpj);

    const faturamentoRaw = emp["Faturamento"] ?? "0";
    const faturamento = parseBrNumber(faturamentoRaw);

    clientes.push({
      id: `emp-${sanitizeId(cnpj)}`,
      razao_social: emp["Razão Social"] || cnpj,
      cnpj,
      faturamento,
      fonte: "BDMG",
      total_oportunidades: 0,
      created_at: emp["DataCadastro"] ?? "",
    });
  }

  for (const lead of leadsRows) {
    const cnpj = lead["CNPJ"] || `PF-${lead["E-mail"] || lead["Telefone"] || lead["Nome"]}`;
    if (cnpjsSeen.has(cnpj)) continue;
    cnpjsSeen.add(cnpj);

    const valorRaw = lead["Valor Solicitado"] ?? "0";
    const valor = parseBrNumber(valorRaw);

    clientes.push({
      id: `lead-${sanitizeId(cnpj)}`,
      razao_social: lead["Empresa"] || lead["Nome"] || cnpj,
      cnpj,
      faturamento: valor,
      fonte: "Lead Rápido",
      total_oportunidades: 0,
      created_at: lead["DataCadastro"] ?? "",
    });
  }

  return clientes;
}

function sanitizeId(val: string): string {
  return val.replace(/[^a-zA-Z0-9]/g, "");
}

function parseBrNumber(val: string): number {
  if (!val) return 0;
  const cleaned = val.replace(/[R$\s.]/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}
