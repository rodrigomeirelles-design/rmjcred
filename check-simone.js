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

  // Busca todas as linhas com "Simone" ou "Centro de Pediatria"
  const found = rows.slice(1).filter(r =>
    r.some(c => c && (c.toLowerCase().includes('simone') || c.toLowerCase().includes('pediatria')))
  );

  if (found.length === 0) {
    console.log('Nenhuma linha encontrada para Simone / Centro de Pediatria.');
    return;
  }

  found.forEach((row, idx) => {
    console.log(`\n=== PROPOSTA ${idx + 1} ===`);
    headers.forEach((h, i) => {
      if (row[i]) {
        console.log(`  ${h}: ${row[i]}`);
      }
    });
  });
};

run().catch(console.error);
