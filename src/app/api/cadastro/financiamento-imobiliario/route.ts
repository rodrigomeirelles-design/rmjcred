import { NextResponse } from "next/server";
import { saveCadastro } from "@/lib/dataStore";
import { saveImobiliarioToCrm } from "@/lib/crmDbHelper";
import { sendNotificationEmail } from "@/lib/emailHelper";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("Nova Ficha Financiamento Imobiliário recebida:", payload);

    const { proponente, segundo_proponente, imovel, financ } = payload;

    if (!proponente || !proponente.nome || !proponente.cpf || !proponente.email) {
      return NextResponse.json(
        { success: false, error: "Dados do proponente incompletos." },
        { status: 400 }
      );
    }

    // 1. Enviar para o Google Apps Script (GAS) via dataStore
    const result = await saveCadastro("financiamento-imobiliario", payload);

    // 2. Salvar no banco local SQLite (CRM)
    saveImobiliarioToCrm(payload);

    // 3. Montar e enviar e-mail de notificação
    const segundoProponenteHtml = (segundo_proponente && segundo_proponente.nome)
      ? `
        <h3 style="color: #1e498a; border-bottom: 2px solid #cbd5e1; padding-bottom: 5px; margin-top: 25px;">Dados do 2º Proponente</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 35%;">Nome:</td>
            <td style="padding: 6px 0;">${segundo_proponente.nome}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">CPF:</td>
            <td style="padding: 6px 0;">${segundo_proponente.cpf}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Renda Mensal:</td>
            <td style="padding: 6px 0;">${segundo_proponente.renda || "Não informado"}</td>
          </tr>
        </table>
      `
      : "";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #f8fafc;">
        <h2 style="color: #1e498a; margin-top: 0;">🏠 Nova Proposta: Financiamento Imobiliário</h2>
        <p style="color: #64748b; font-size: 14px;">Uma nova ficha cadastral de Financiamento Imobiliário foi preenchida no site.</p>
        
        <h3 style="color: #1e498a; border-bottom: 2px solid #cbd5e1; padding-bottom: 5px; margin-top: 25px;">Dados do Proponente</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 35%;">Nome:</td>
            <td style="padding: 6px 0;">${proponente.nome}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">CPF:</td>
            <td style="padding: 6px 0;">${proponente.cpf}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">E-mail:</td>
            <td style="padding: 6px 0;"><a href="mailto:${proponente.email}">${proponente.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Celular/WhatsApp:</td>
            <td style="padding: 6px 0;">${proponente.celular || proponente.telefone || "Não informado"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Renda Mensal:</td>
            <td style="padding: 6px 0;">${proponente.renda || "Não informado"}</td>
          </tr>
        </table>

        ${segundoProponenteHtml}

        <h3 style="color: #ee661c; border-bottom: 2px solid #cbd5e1; padding-bottom: 5px; margin-top: 25px;">Simulação do Imóvel</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 35%; color: #ee661c;">Valor do Imóvel:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #ee661c;">${imovel?.valor_compra || "Não informado"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #ee661c;">Valor Financiado:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #ee661c;">${financ?.valor_financ || "Não informado"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Prazo Desejado:</td>
            <td style="padding: 6px 0;">${financ?.prazo || "Não informado"} meses</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Utiliza FGTS:</td>
            <td style="padding: 6px 0;">${financ?.utilizar_fgts || "Não informado"} ${financ?.valor_fgts ? `(R$ ${financ.valor_fgts})` : ""}</td>
          </tr>
        </table>
      </div>
    `;

    // Enviar e-mail em background
    sendNotificationEmail(`🏠 Nova Ficha Imobiliário: ${proponente.nome}`, htmlContent);

    return NextResponse.json({ success: true, destination: result.destination });
  } catch (error: any) {
    console.error("Erro na API de financiamento imobiliário:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
