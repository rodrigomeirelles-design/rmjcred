import { NextRequest, NextResponse } from "next/server";
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/lib/calendar";

interface BrasilAPIHoliday {
  date: string;
  name: string;
  type: string;
}

async function getBrazilHolidays(yearMonth: string) {
  const [year, month] = yearMonth.split("-");
  try {
    const res = await fetch(
      `https://brasilapi.com.br/api/feriados/v1/${year}`
    );
    if (!res.ok) return [];
    const data: BrasilAPIHoliday[] = await res.json();
    return data
      .filter((h) => h.date.startsWith(`${year}-${month}`))
      .map((h) => ({
        id: `feriado-${h.date}`,
        title: h.name,
        date: h.date,
        category: "feriado" as const,
        description: "Feriado Nacional",
      }));
  } catch (e) {
    console.error("[calendar/events] BrasilAPI holidays fetch failed:", e);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const month =
      request.nextUrl.searchParams.get("month") ||
      new Date().toISOString().slice(0, 7);

    const [events, holidays] = await Promise.all([
      getCalendarEvents(month),
      getBrazilHolidays(month),
    ]);

    return NextResponse.json({ events: [...events, ...holidays] });
  } catch (e) {
    console.error("[calendar/events GET]", e);
    return NextResponse.json({ events: [], error: String(e) });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = await createCalendarEvent(body);
    return NextResponse.json({ success: true, id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[calendar/events POST]", err);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...event } = await request.json();
    await updateCalendarEvent(id, event);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[calendar/events PATCH]", e);
    return NextResponse.json(
      { success: false, error: String(e) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await deleteCalendarEvent(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[calendar/events DELETE]", e);
    return NextResponse.json(
      { success: false, error: String(e) },
      { status: 500 }
    );
  }
}
