import { NextResponse } from "next/server";
import { appendDynamicRow } from "@/lib/googleSheetsWriter";
import { sendNotificationEmail } from "@/lib/emailHelper";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("[API /cadastro/financiamento-imobiliario] Recebido:", JSON.stringify(payload).slice(0, 300));

    const { proponente, segundo_proponente, imovel, financ } = payload;

    if (!proponente?.nome || !proponente?.cpf || !proponente?.email) {
      return NextResponse.json(
        { success: false, error: "Dados do proponente incompletos." },
        { status: 400 }
      );
    }

    const now = new Date().toLocaleDateString("pt-BR");
    const valorSolicitado = financ?.valor_financ ?? imovel?.valor_compra ?? "";

    await appendDynamicRow("PessoasFisicas", {
      CPF: proponente.cpf ?? "",
      Nome: proponente.nome ?? "",
      "E-mail": proponente.email ?? "",
      Celular: proponente.celular ?? proponente.telefone ?? "",
      "Renda Mensal": proponente.renda ?? "",
      Produto: "Financiamento Imobiliário",
      "Valor Solicitado": valorSolicitado,
    });

    await appendDynamicRow("Imoveis", {
      "CPF do Proponente": proponente.cpf ?? "",
      "Tipo de Imovel": imovel?.tipo ?? "",
      "Valor do Imovel": imovel?.valor_compra ?? "",
      "Cidade do Imovel": imovel?.cidade ?? "",
      "Estado do Imovel": imovel?.uf ?? "",
    });

    console.log(
      `[API /cadastro/financiamento-imobiliario] ${proponente.nome} gravado na planilha com sucesso.`
    );

    // --- ENVIAR PARA O CRM NOVO ---
    try {
      const crmPayload = {
        tipo_pessoa: "PF",
        nome: proponente.nome || "",
        cpf: proponente.cpf || "",
        celular: proponente.celular || proponente.telefone || "",
        email: proponente.email || "",
        valorFinanciamento: parseFloat(String(valorSolicitado).replace(/\D/g, "")) / 100 || 0,
        produto: "Financiamento Imobiliário"
      };

      const crmRes = await fetch("https://crm-rmj-mvp-rodrigo.netlify.app/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(crmPayload),
      });

      if (!crmRes.ok) {
        console.error("[API /cadastro/financiamento-imobiliario] Erro ao enviar para CRM:", await crmRes.text());
      } else {
        console.log(`[API /cadastro/financiamento-imobiliario] Proposta de ${proponente.nome} enviada ao CRM com sucesso.`);
      }
    } catch (e) {
      console.error("[API /cadastro/financiamento-imobiliario] Falha ao comunicar com o CRM:", e);
    }
    // ------------------------------

    const segundoProponenteHtml =
      segundo_proponente?.nome
        ? `<h3 style="color:#1e498a;">Dados do 2º Proponente</h3>
           <table style="width:100%;border-collapse:collapse;">
             <tr><td style="padding:6px 0;font-weight:bold;width:35%;">Nome:</td><td>${segundo_proponente.nome}</td></tr>
             <tr><td style="padding:6px 0;font-weight:bold;">CPF:</td><td>${segundo_proponente.cpf ?? "Não informado"}</td></tr>
             <tr><td style="padding:6px 0;font-weight:bold;">Renda:</td><td>${segundo_proponente.renda ?? "Não informado"}</td></tr>
           </table>`
        : "";

    const htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;">
        <h2 style="color:#1e498a;margin-top:0;">🏠 Nova Proposta: Financiamento Imobiliário</h2>
        <h3 style="color:#1e498a;">Dados do Proponente</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;font-weight:bold;width:35%;">Nome:</td><td>${proponente.nome}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">CPF:</td><td>${proponente.cpf}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">E-mail:</td><td>${proponente.email}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Celular:</td><td>${proponente.celular ?? proponente.telefone ?? "Não informado"}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Renda Mensal:</td><td>${proponente.renda ?? "Não informado"}</td></tr>
        </table>
        ${segundoProponenteHtml}
        <h3 style="color:#ee661c;">Simulação do Imóvel</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;font-weight:bold;width:35%;color:#ee661c;">Valor do Imóvel:</td><td>${imovel?.valor_compra ?? "Não informado"}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#ee661c;">Valor Financiado:</td><td>${financ?.valor_financ ?? "Não informado"}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Prazo:</td><td>${financ?.prazo ?? "Não informado"} meses</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">FGTS:</td><td>${financ?.utilizar_fgts ?? "Não informado"}</td></tr>
        </table>
      </div>`;

    await sendNotificationEmail(
      `🏠 Nova Ficha Imobiliário: ${proponente.nome}`,
      htmlContent
    );

    return NextResponse.json({ success: true, destination: "sheets" });
  } catch (error: any) {
    console.error(
      "[API /cadastro/financiamento-imobiliario] Erro:",
      error?.message ?? error
    );
    return NextResponse.json(
      { success: false, error: error?.message ?? "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
