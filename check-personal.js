const fs = require('fs');
const { google } = require('googleapis');

const env = fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const k = parts.shift().trim();
    if (k) process.env[k] = parts.join('=').trim().replace(/^["']|["']$/g, '');
  }
});

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/calendar'],
});
const calendar = google.calendar({ version: 'v3', auth });

calendar.events.list({
  calendarId: 'rodrigomeirelles@gmail.com',
  timeMin: new Date('2026-08-05T00:00:00-03:00').toISOString(),
  timeMax: new Date('2026-08-05T23:59:59-03:00').toISOString()
}).then(r => {
  console.log("SUCESSO! Eventos encontrados na agenda pessoal:", r.data.items.length);
  console.log(r.data.items.map(i => i.summary));
}).catch(console.error);
