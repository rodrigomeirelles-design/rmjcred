import { NextRequest, NextResponse } from "next/server";
import { appendDynamicRow } from "@/lib/googleSheetsWriter";
import { sendNotificationEmail } from "@/lib/emailHelper";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[API /lead] Recebido:", body);

    // Determines if it is PJ or PF based on CNPJ or Empresa existence
    const isPJ = !!body.cnpj || !!body.empresa || String(body.servico).includes("BDMG");

    const crmPayload = isPJ
      ? {
          tipo_pessoa: "PJ",
          emp_razao: body.empresa || body.nome,
          emp_cnpj: body.cnpj || "",
          emp_repr_nome: body.nome || "",
          emp_email: body.email || "",
          emp_telefone: body.telefone || "",
          valor_solicitado: parseFloat(String(body.valor).replace(/\D/g, "")) / 100 || 0,
          produto: body.servico || "BDMG Capital de Giro"
        }
      : {
          tipo_pessoa: "PF",
          nome: body.nome || "",
          celular: body.telefone || "",
          email: body.email || "",
          valorFinanciamento: parseFloat(String(body.valor).replace(/\D/g, "")) / 100 || 0,
          produto: body.servico || "Financiamento Imobiliário"
        };

    const crmRes = await fetch("https://crm-rmj-mvp-rodrigo.netlify.app/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(crmPayload),
    });

    if (!crmRes.ok) {
      console.error("[API /lead] Erro ao enviar para CRM:", await crmRes.text());
    } else {
      console.log(`[API /lead] Lead de ${body.nome} enviado para o CRM com sucesso.`);
    }

    const htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;">
        <h2 style="color:#1e498a;margin-top:0;">🚀 Novo Lead Rápido</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;font-weight:bold;width:35%;">Nome:</td><td>${body.nome}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">E-mail:</td><td>${body.email}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Telefone:</td><td>${body.telefone}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Empresa:</td><td>${body.empresa || "Não informado"}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">CNPJ:</td><td>${body.cnpj || "Não informado"}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Serviço:</td><td>${body.servico}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Valor:</td><td>${body.valor || "Não informado"}</td></tr>
        </table>
        <p style="margin-top: 20px; font-size: 12px; color: #64748b;">Este lead foi enviado automaticamente para a aba Novos Negócios do CRM.</p>
      </div>`;

    await sendNotificationEmail(`🚀 Novo Lead: ${body.nome}`, htmlContent);

    return NextResponse.json({ success: true, message: "Lead registrado e enviado ao CRM com sucesso." });
  } catch (error: any) {
    console.error("[API /lead] Erro:", error?.message ?? error);
    return NextResponse.json(
      { success: false, message: error?.message ?? "Erro interno" },
      { status: 500 }
    );
  }
}
