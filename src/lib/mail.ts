import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"CRM RMJ" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
