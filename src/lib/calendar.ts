import { google } from "googleapis";

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "";

function getCalendarClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  return google.calendar({ version: "v3", auth });
}

export type EventCategory =
  | "feriado"
  | "reuniao"
  | "tarefa"
  | "aniversario"
  | "followup"
  | "credito_liberado";

const CATEGORY_COLOR_ID: Record<EventCategory, string> = {
  feriado: "11",
  reuniao: "9",
  tarefa: "2",
  aniversario: "3",
  followup: "5",
  credito_liberado: "7",
};

export interface CalendarEvent {
  id?: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  category: EventCategory;
  description?: string;
}

export async function ensureCalendarExists(): Promise<string> {
  const calendar = getCalendarClient();
  const res = await calendar.calendars.insert({
    requestBody: {
      summary: "RMJ",
      description: "Calendário CRM RMJ Soluções de Crédito",
      timeZone: "America/Sao_Paulo",
    },
  });
  return res.data.id!;
}

export async function getCalendarEvents(yearMonth: string): Promise<CalendarEvent[]> {
  if (!CALENDAR_ID) return [];

  const calendar = getCalendarClient();
  const [year, month] = yearMonth.split("-").map(Number);
  const timeMin = new Date(year, month - 1, 1).toISOString();
  const timeMax = new Date(year, month, 1).toISOString();

  const res = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 500,
  });

  return (res.data.items || []).map((event) => {
    const isAllDay = !event.start?.dateTime;
    const date = isAllDay
      ? event.start?.date!
      : event.start?.dateTime!.split("T")[0];

    return {
      id: event.id!,
      title: event.summary || "",
      date: date!,
      startTime: isAllDay
        ? undefined
        : event.start?.dateTime?.split("T")[1]?.slice(0, 5),
      endTime: isAllDay
        ? undefined
        : event.end?.dateTime?.split("T")[1]?.slice(0, 5),
      category:
        (event.extendedProperties?.private?.category as EventCategory) ||
        "tarefa",
      description: event.description || "",
    };
  });
}

export async function createCalendarEvent(event: CalendarEvent): Promise<string> {
  if (!CALENDAR_ID) throw new Error("GOOGLE_CALENDAR_ID não configurado");

  const calendar = getCalendarClient();
  const isAllDay = !event.startTime;

  const start = isAllDay
    ? { date: event.date }
    : {
        dateTime: `${event.date}T${event.startTime}:00`,
        timeZone: "America/Sao_Paulo",
      };
  const end = isAllDay
    ? { date: event.date }
    : {
        dateTime: `${event.date}T${event.endTime || event.startTime}:00`,
        timeZone: "America/Sao_Paulo",
      };

  const res = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: {
      summary: event.title,
      description: event.description,
      start,
      end,
      colorId: CATEGORY_COLOR_ID[event.category],
      extendedProperties: {
        private: { category: event.category },
      },
      reminders: {
        useDefault: false,
        overrides: event.startTime
          ? [{ method: "popup", minutes: 60 }]
          : [],
      },
    },
  });

  return res.data.id!;
}

export async function updateCalendarEvent(
  id: string,
  event: Partial<CalendarEvent>
): Promise<void> {
  if (!CALENDAR_ID) throw new Error("GOOGLE_CALENDAR_ID não configurado");

  const calendar = getCalendarClient();
  const patch: Record<string, unknown> = {};

  if (event.title !== undefined) patch.summary = event.title;
  if (event.description !== undefined) patch.description = event.description;

  if (event.date) {
    if (event.startTime) {
      patch.start = {
        dateTime: `${event.date}T${event.startTime}:00`,
        timeZone: "America/Sao_Paulo",
      };
      patch.end = {
        dateTime: `${event.date}T${event.endTime || event.startTime}:00`,
        timeZone: "America/Sao_Paulo",
      };
    } else {
      patch.start = { date: event.date };
      patch.end = { date: event.date };
    }
  }

  if (event.category) {
    patch.colorId = CATEGORY_COLOR_ID[event.category];
    patch.extendedProperties = { private: { category: event.category } };
  }

  await calendar.events.patch({
    calendarId: CALENDAR_ID,
    eventId: id,
    requestBody: patch,
  });
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  if (!CALENDAR_ID) throw new Error("GOOGLE_CALENDAR_ID não configurado");

  const calendar = getCalendarClient();
  await calendar.events.delete({ calendarId: CALENDAR_ID, eventId: id });
}
