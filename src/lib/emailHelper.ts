import nodemailer from "nodemailer";

export async function sendNotificationEmail(subject: string, htmlContent: string): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST || "smtp.titan.email";
  const smtpPort = process.env.SMTP_PORT || "465";
  const smtpUser = process.env.SMTP_USER || "contato@rmjcred.com.br";
  const smtpPass = process.env.SMTP_PASS || "Malu@2015";
  const receiverEmail = process.env.LEAD_RECEIVER_EMAIL || "contato@rmjcred.com.br, rodrigomeirelles@gmail.com";

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn("[EmailHelper] SMTP não configurado completamente. E-mail ignorado.");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: smtpPort === "465",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false, // Prevents certificate rejection issues
      },
    });

    const mailOptions = {
      from: `"RMJ Hub" <${smtpUser}>`,
      to: receiverEmail,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EmailHelper] E-mail enviado com sucesso: "${subject}"`);
    return true;
  } catch (error) {
    console.error(`[EmailHelper] Falha ao enviar e-mail "${subject}":`, error);
    return false;
  }
}
