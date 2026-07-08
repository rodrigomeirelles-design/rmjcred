import { NextResponse } from "next/server";
import { ensureCalendarExists } from "@/lib/calendar";

export async function GET() {
  try {
    const calendarId = await ensureCalendarExists();
    return NextResponse.json({
      success: true,
      calendarId,
      proximoPasso: `Adicione GOOGLE_CALENDAR_ID=${calendarId} nas variáveis de ambiente do Netlify e faça redeploy.`,
    });
  } catch (e) {
    console.error("[calendar/setup]", e);
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
