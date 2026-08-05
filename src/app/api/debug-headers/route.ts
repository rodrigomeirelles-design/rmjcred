import { google } from "googleapis";
import { NextResponse } from "next/server";

const SHEET_ID = (process.env.GOOGLE_SHEETS_ID || process.env.GOOGLE_SHEET_ID)!;
const SHEET_NAME = "Propostas";

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function GET() {
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1:ZZ`,
    });

    const rows = res.data.values ?? [];
    if (rows.length < 1) return NextResponse.json({ error: "no data" });

    const headers = rows[0] as string[];

    // Find headers related to socios and conjuge
    const socioHeaders = headers
      .map((h, i) => ({ header: h, index: i }))
      .filter(({ header }) => header.startsWith("socio1_") || header.startsWith("conjuge1_"));

    // Also get the data for the last row (most recent proposal) to see alignment
    const lastRow = rows[rows.length - 1] as string[];

    // Build a mapping of header => value for the last row (socio1 + conjuge1 only)
    const lastRowMapping: Record<string, string> = {};
    socioHeaders.forEach(({ header, index }) => {
      lastRowMapping[header] = lastRow[index] ?? "(empty)";
    });

    // Also find Rosana's row
    const rosanaRow = rows.find((r) => (r as string[])[0]?.includes?.("") && (r as string[]).some(v => v?.includes?.("Rosana")));
    const rosanaMapping: Record<string, string> = {};
    if (rosanaRow) {
      socioHeaders.forEach(({ header, index }) => {
        rosanaMapping[header] = (rosanaRow as string[])[index] ?? "(empty)";
      });
    }

    return NextResponse.json({
      totalHeaders: headers.length,
      totalRows: rows.length - 1,
      allHeaders: headers,
      socio1_conjuge1_headers: socioHeaders,
      lastRow_socio_data: lastRowMapping,
      rosana_socio_data: rosanaMapping,
      rosana_found: !!rosanaRow,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
