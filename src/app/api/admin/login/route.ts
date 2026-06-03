import { NextResponse } from "next/server";
import { createSessionToken } from "@/utils/auth";

const MASTER_EMAIL = "rodrigomeirelles@gmail.com";
const MASTER_PASSWORD = process.env.ADMIN_PASSWORD || "Malu@2015";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (
      email.toLowerCase().trim() === MASTER_EMAIL &&
      password === MASTER_PASSWORD
    ) {
      const token = createSessionToken(MASTER_EMAIL);
      const response = NextResponse.json({ success: true });
      
      // Define o cookie HttpOnly seguro para a sessão
      response.cookies.set("rmj_admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 3600, // 1 hora
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "E-mail ou senha incorretos." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Erro na API de login:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
