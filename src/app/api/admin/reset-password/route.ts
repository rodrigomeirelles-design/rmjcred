import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createSessionToken } from "@/utils/auth";
import fs from "fs";
import path from "path";

const MASTER_EMAIL = "rodrigomeirelles@gmail.com";
const CODE_FILE_PATH = path.join(process.cwd(), "src", "utils", "reset_code.json");

export async function POST(request: Request) {
  try {
    const { action, email, code } = await request.json();

    if (email.toLowerCase().trim() !== MASTER_EMAIL) {
      return NextResponse.json(
        { success: false, error: "Usuário não autorizado." },
        { status: 403 }
      );
    }

    if (action === "request") {
      // 1. Gera código de 6 dígitos
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutos de validade

      // Salva o código localmente em arquivo para persistência
      fs.writeFileSync(
        CODE_FILE_PATH,
        JSON.stringify({ code: resetCode, expiresAt }),
        "utf-8"
      );

      // 2. Dispara e-mail via SMTP
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT || "587";
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (smtpHost && smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort),
          secure: smtpPort === "465",
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: `"RMJ Seguradora" <${smtpUser}>`,
          to: MASTER_EMAIL,
          subject: "🔐 Código de Recuperação - RMJ Soluções de Crédito",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
              <h2 style="color: #1e498a;">Recuperação de Acesso</h2>
              <p>Você solicitou a redefinição de acesso para o Painel Admin da RMJ.</p>
              <p>Utilize o código abaixo para entrar no sistema. Ele expira em 5 minutos.</p>
              <div style="background-color: #e2e8f0; font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 15px; text-align: center; border-radius: 8px; color: #ee661c; margin: 20px 0;">
                ${resetCode}
              </div>
              <p style="color: #64748b; font-size: 12px;">Se você não solicitou este código, apenas ignore este e-mail.</p>
            </div>
          `,
        });
        console.log("Código de recuperação enviado para e-mail. Código:", resetCode);
      } else {
        console.log("Servidor SMTP não configurado. Código gerado em ambiente local:", resetCode);
      }

      return NextResponse.json({ success: true, message: "Código enviado para o seu e-mail." });
    }

    if (action === "verify") {
      if (!fs.existsSync(CODE_FILE_PATH)) {
        return NextResponse.json({ success: false, error: "Código não gerado ou inválido." }, { status: 400 });
      }

      const raw = fs.readFileSync(CODE_FILE_PATH, "utf-8");
      const savedData = JSON.parse(raw);

      if (Date.now() > savedData.expiresAt) {
        return NextResponse.json({ success: false, error: "Código expirado." }, { status: 400 });
      }

      if (code !== savedData.code) {
        return NextResponse.json({ success: false, error: "Código incorreto." }, { status: 400 });
      }

      // Código correto: remove o arquivo e loga o usuário
      try {
        fs.unlinkSync(CODE_FILE_PATH);
      } catch (e) {}

      const token = createSessionToken(MASTER_EMAIL);
      const response = NextResponse.json({ success: true });
      response.cookies.set("rmj_admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 3600,
      });

      return response;
    }

    return NextResponse.json({ success: false, error: "Ação inválida." }, { status: 400 });

  } catch (error) {
    console.error("Erro na API de recuperação de senha:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
