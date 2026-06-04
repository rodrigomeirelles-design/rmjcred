import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// PATCH /api/tarefas/[id] - Toggle task completion
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { concluida } = body;

    db.prepare("UPDATE tarefas SET concluida = ? WHERE id = ?").run(
      concluida ? 1 : 0,
      parseInt(id, 10)
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/tarefas/[id] - Delete a task
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    db.prepare("DELETE FROM tarefas WHERE id = ?").run(parseInt(id, 10));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
