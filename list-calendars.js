const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, val] = line.split('=');
  if (key && val) acc[key.trim()] = val.trim().replace(/^"|"$/g, '');
  return acc;
}, {});

const { google } = require('googleapis');

async function main() {
  const auth = new google.auth.JWT(
    env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    (env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/calendar']
  );
  
  const calendar = google.calendar({ version: 'v3', auth });
  try {
    const res = await calendar.calendarList.list();
    console.log("Calendários encontrados:");
    res.data.items.forEach(c => console.log(`- ID: ${c.id}\n  Summary: ${c.summary}\n`));
  } catch(e) {
    console.error(e);
  }
}
main();
