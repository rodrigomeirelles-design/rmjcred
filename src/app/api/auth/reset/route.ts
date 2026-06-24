import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getConfig, setConfig } from "@/lib/sheets";
import { sendEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, code, newPassword } = body;
    const masterEmail = "rodrigomeirelles@gmail.com";

    if (email !== masterEmail) {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    }

    if (action === "send_code") {
      // Gera um código de 6 dígitos
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos
      
      await setConfig("RESET_CODE", resetCode);
      await setConfig("RESET_EXPIRES", expiresAt.toString());

      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Redefinição de Senha - CRM RMJ</h2>
          <p>Você solicitou a redefinição da sua senha de administrador.</p>
          <p>Seu código de verificação é:</p>
          <h1 style="color: #4f46e5; letter-spacing: 5px;">${resetCode}</h1>
          <p>Este código expira em 15 minutos.</p>
          <p>Se não foi você, ignore este e-mail.</p>
        </div>
      `;

      await sendEmail({
        to: email,
        subject: "Código de Redefinição de Senha - CRM RMJ",
        html,
      });

      return NextResponse.json({ success: true });
    }

    if (action === "verify_code") {
      const storedCode = await getConfig("RESET_CODE");
      const expiresAtStr = await getConfig("RESET_EXPIRES");

      if (!storedCode || !expiresAtStr || Date.now() > parseInt(expiresAtStr)) {
        return NextResponse.json({ error: "Código expirado ou inválido" }, { status: 400 });
      }

      if (code !== storedCode) {
        return NextResponse.json({ error: "Código incorreto" }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === "reset_password") {
      const storedCode = await getConfig("RESET_CODE");
      const expiresAtStr = await getConfig("RESET_EXPIRES");

      if (!storedCode || !expiresAtStr || Date.now() > parseInt(expiresAtStr) || code !== storedCode) {
        return NextResponse.json({ error: "Código inválido ou expirado" }, { status: 400 });
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ error: "A nova senha deve ter no mínimo 6 caracteres" }, { status: 400 });
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await setConfig("ADMIN_PASSWORD_HASH", newHash);

      // Invalida o código
      await setConfig("RESET_CODE", "");
      await setConfig("RESET_EXPIRES", "0");

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
