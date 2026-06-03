import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Exclui o cookie definindo a expiração no passado
  response.cookies.set("rmj_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
