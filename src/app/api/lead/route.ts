import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { nome, email, telefone, empresa, cnpj, servico, valor } = data;

    console.log("Novo lead recebido no servidor:", data);

    // Configurar o transportador do Nodemailer usando variáveis de ambiente
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || "587";
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const receiverEmail = process.env.LEAD_RECEIVER_EMAIL || "contato@rmjcred.com.br";

    // Se as credenciais estiverem disponíveis, realiza o envio real do e-mail
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: smtpPort === "465", // true para 465, false para outros
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"RMJ Lead Hub" <${smtpUser}>`,
        to: receiverEmail,
        subject: `🚀 Novo Lead: ${nome} - Simulação de ${servico}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
            <h2 style="color: #1e498a; margin-top: 0;">Novo Lead Recebido pelo Site!</h2>
            <p style="color: #64748b; font-size: 14px;">Um visitante solicitou uma simulação de crédito no site da RMJ Soluções de Crédito.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr style="background-color: #e2e8f0;">
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #cbd5e1; width: 35%;">Campo</th>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #cbd5e1;">Valor</th>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Nome:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${nome}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">E-mail:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">WhatsApp/Tel:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="tel:${telefone}">${telefone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Empresa:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${empresa || "Pessoa Física"}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">CNPJ:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${cnpj || "Não informado"}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1e498a;">Serviço:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1e498a;">${servico}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #ee661c;">Valor Solicitado:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #ee661c;">R$ ${valor}</td>
              </tr>
            </table>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="https://wa.me/${telefone.replace(/\D/g, "")}" style="background-color: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Falar com Cliente no WhatsApp 💬
              </a>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("E-mail de notificação enviado com sucesso!");
    } else {
      console.warn("SMTP não configurado. O e-mail de lead não pôde ser enviado silenciosamente. (Leads gravados apenas em log)");
    }

    return NextResponse.json({ success: true, message: "Lead processado com sucesso" });
  } catch (error) {
    console.error("Erro na rota de API de leads:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
