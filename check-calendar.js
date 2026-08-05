const fs = require('fs');
const { google } = require('googleapis');

const env = fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const k = parts.shift().trim();
    if (k) process.env[k] = parts.join('=').trim().replace(/^["']|["']$/g, '');
  }
});

const getCalendarClient = () => {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
  return google.calendar({ version: 'v3', auth });
};

async function checkCalendar() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    console.log('GOOGLE_CALENDAR_ID is not set in .env.local');
    return;
  }
  
  console.log('Checking calendar access for ID:', calendarId);
  const calendar = getCalendarClient();
  try {
    const res = await calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date('2026-07-01').toISOString(),
      timeMax: new Date('2026-08-01').toISOString()
    });
    console.log('Success! Found', res.data.items.length, 'events.');
  } catch (error) {
    console.error('Error accessing calendar:', error.message);
  }
}

checkCalendar();
