import nodemailer from "nodemailer";
import { Proposta } from "@/types";

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendPropostaNotification(proposta: Proposta): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const to = process.env.GMAIL_NOTIFY_TO || process.env.GMAIL_USER!;
  const socios = proposta.socios
    .map((s, i) => `  Sócio ${i + 1}: ${s.nome} (${s.cpf}) — ${s.participacao}%`)
    .join("\n");

  const valor = proposta.valor_solicitado
    ? `R$ ${proposta.valor_solicitado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    : "Não informado";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #234469; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Nova Proposta Recebida</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 14px;">CRM RMJ — Capital de Giro BDMG</p>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 40%;">ID da Proposta</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 13px; font-weight: 600;">${proposta.id_proposta}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Empresa</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 13px; font-weight: 600;">${proposta.emp_razao}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">CNPJ</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 13px;">${proposta.emp_cnpj}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Regime Tributário</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 13px;">${proposta.emp_regime_tributario || "Não informado"}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Valor do Crédito</td>
            <td style="padding: 8px 0; color: #234469; font-size: 15px; font-weight: 700;">${valor}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Representante</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 13px;">${proposta.emp_repr_nome}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">E-mail</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 13px;">${proposta.emp_email}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Telefone</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 13px;">${proposta.emp_telefone}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Cidade / UF</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 13px;">${proposta.emp_cidade} / ${proposta.emp_uf}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Sócios</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 13px;">${proposta.socios.map((s) => s.nome).join(", ")}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; text-align: center;">
          <a href="https://crm-rmj-mvp-rodrigo.netlify.app/admin/propostas"
            style="display: inline-block; background: #ee661b; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">
            Abrir no CRM
          </a>
        </div>

        <p style="margin-top: 20px; font-size: 11px; color: #94a3b8; text-align: center;">
          Enviado automaticamente pelo CRM RMJ · ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"CRM RMJ" <${process.env.GMAIL_USER}>`,
    to,
    subject: `[CRM RMJ] Nova proposta — ${proposta.emp_razao}`,
    html,
  });
}
