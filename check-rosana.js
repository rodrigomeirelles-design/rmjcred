const fs = require('fs');
const { google } = require('googleapis');

const env = fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const k = parts.shift().trim();
    if (k) process.env[k] = parts.join('=').trim().replace(/^["']|["']$/g, '');
  }
});

const SHEET_ID = process.env.GOOGLE_SHEETS_ID || process.env.GOOGLE_SHEET_ID;

const getAuth = () => new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const run = async () => {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Propostas!A1:ZZ'
  });
  
  const rows = res.data.values;
  const headers = rows[0];
  
  const rosanaIndex = rows.findIndex(r => r.some(c => c && c.includes('Rosana Maria Ribeiro')));
  if (rosanaIndex === -1) {
    console.log("Rosana's proposal not found.");
    return;
  }
  
  const row = rows[rosanaIndex];
  console.log("Found Rosana's proposal at row index:", rosanaIndex, "(Sheet row", rosanaIndex + 1, ")");
  
  // Imprimir os campos originais vs o que está na linha
  const socio1_nome_idx = headers.indexOf('socio1_nome');
  console.log("socio1_nome index:", socio1_nome_idx);
  console.log("Value at that index in Rosana's row:", row[socio1_nome_idx]);
  
  const conjuge1_nome_idx = headers.indexOf('conjuge1_nome');
  console.log("conjuge1_nome index:", conjuge1_nome_idx);
  console.log("Value at that index:", row[conjuge1_nome_idx]);
  
  // Se o valor estiver deslocado, o socio1_nome deve estar 2 posições para a direita.
  // Wait, no, the first shift happens AFTER conjuge1!
  // Let's trace it: socio1 is before conjuge1. So socio1 should NOT be shifted!
  // Wait, in my broken code, DID socio1 get shifted?
  
  console.log("Full row from socio1_nome onwards:");
  for (let i = socio1_nome_idx; i < row.length; i++) {
    console.log(`[${i}] ${headers[i] || 'NO_HEADER'}: ${row[i]}`);
  }
};

run().catch(console.error);
