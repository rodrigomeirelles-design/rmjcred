import { google } from "googleapis";

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error(
      "[Sheets Writer] Variáveis GOOGLE_SERVICE_ACCOUNT_EMAIL ou GOOGLE_PRIVATE_KEY não configuradas."
    );
  }

  return new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

const headersCache = new Map<string, { headers: string[]; fetchedAt: number }>();
const HEADERS_CACHE_TTL_MS = 5 * 60 * 1000;

async function getSheetHeaders(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  sheetName: string
): Promise<string[]> {
  const cached = headersCache.get(sheetName);
  if (cached && Date.now() - cached.fetchedAt < HEADERS_CACHE_TTL_MS) {
    return cached.headers;
  }

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!1:1`,
  });

  const headers = (res.data.values?.[0] as string[]) ?? [];
  headersCache.set(sheetName, { headers, fetchedAt: Date.now() });
  return headers;
}

export async function appendDynamicRow(
  sheetName: string,
  data: Record<string, string>
): Promise<void> {
  const spreadsheetId =
    process.env.GOOGLE_SHEET_ID || "1D8kQJSUp5UwlUsc-9-P9Nj-rft0BADbGeBg0aHPjT-8";

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const headers = await getSheetHeaders(sheets, spreadsheetId, sheetName);

  if (headers.length === 0) {
    throw new Error(
      `[Sheets Writer] Aba "${sheetName}" não encontrada ou sem cabeçalhos na linha 1.`
    );
  }

  const row = headers.map((header) => data[header] ?? "");

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });

  console.log(
    `[Sheets Writer] Linha adicionada em "${sheetName}": ${JSON.stringify(data)}`
  );
}
