import { NextRequest, NextResponse } from "next/server";
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/lib/calendar";

export async function GET(request: NextRequest) {
  try {
    const month =
      request.nextUrl.searchParams.get("month") ||
      new Date().toISOString().slice(0, 7);
    const events = await getCalendarEvents(month);
    return NextResponse.json({ events });
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
  } catch (e) {
    console.error("[calendar/events POST]", e);
    return NextResponse.json(
      { success: false, error: String(e) },
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
