import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { getConfig, setConfig } from "@/lib/sheets";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const masterEmail = "rodrigomeirelles@gmail.com";
    
    if (email !== masterEmail) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    let storedHash = await getConfig("ADMIN_PASSWORD_HASH");
    
    // Fallback para a senha no .env.local na primeira vez
    if (!storedHash) {
      const defaultPassword = process.env.ADMIN_PASSWORD || "rmjadmin2024";
      if (password === defaultPassword) {
        // Gera o hash e salva para usos futuros
        storedHash = await bcrypt.hash(defaultPassword, 10);
        await setConfig("ADMIN_PASSWORD_HASH", storedHash);
      } else {
        return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
      }
    }

    const isValid = await bcrypt.compare(password, storedHash);

    if (!isValid) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    const token = await signToken({ role: "admin", email });

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 dia
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
