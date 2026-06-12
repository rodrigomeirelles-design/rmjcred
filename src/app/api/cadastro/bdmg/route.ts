import { NextResponse } from "next/server";
import { saveCadastro } from "@/lib/dataStore";
import { saveBdmgToCrm } from "@/lib/crmDbHelper";
import { sendNotificationEmail } from "@/lib/emailHelper";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("Nova Ficha PJ BDMG recebida na API:", payload);

    const { empresa, socios, bancario } = payload;

    if (!empresa || !empresa.emp_cnpj || !empresa.emp_razao) {
      return NextResponse.json({ success: false, error: "Dados da empresa incompletos." }, { status: 400 });
    }

    // 1. Enviar para o Google Apps Script (GAS) via dataStore
    const result = await saveCadastro("bdmg", payload);

    // 2. Salvar no banco local SQLite (CRM)
    saveBdmgToCrm(payload);

    // 3. Montar e enviar e-mail de notificação
    const sociosListHtml = (socios && Array.isArray(socios))
      ? socios.map((socio: any) => `
          <li style="margin-bottom: 8px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px;">
            <strong>Nome:</strong> ${socio.soc_nome || socio.nome || "Não informado"}<br/>
            <strong>WhatsApp:</strong> ${socio.soc_whatsapp || socio.telefone || "Não informado"}<br/>
            <strong>Cargo/Participação:</strong> ${socio.soc_cargo || "Sócio"}
          </li>
        `).join("")
      : "<li>Nenhum sócio informado</li>";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #f8fafc;">
        <h2 style="color: #1e498a; margin-top: 0;">📋 Nova Proposta: Capital de Giro BDMG</h2>
        <p style="color: #64748b; font-size: 14px;">Uma nova ficha cadastral PJ foi preenchida no site.</p>
        
        <h3 style="color: #1e498a; border-bottom: 2px solid #cbd5e1; padding-bottom: 5px; margin-top: 25px;">Dados da Empresa</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 35%;">Razão Social:</td>
            <td style="padding: 6px 0;">${empresa.emp_razao}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">CNPJ:</td>
            <td style="padding: 6px 0;">${empresa.emp_cnpj}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Faturamento Anual:</td>
            <td style="padding: 6px 0;">${empresa.emp_faturamento || "Não informado"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">E-mail Comercial:</td>
            <td style="padding: 6px 0;"><a href="mailto:${empresa.emp_email}">${empresa.emp_email || "Não informado"}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Telefone Comercial:</td>
            <td style="padding: 6px 0;">${empresa.emp_telefone || "Não informado"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Cidade/UF:</td>
            <td style="padding: 6px 0;">${empresa.emp_cidade || "Não informado"}-${empresa.emp_uf || "MG"}</td>
          </tr>
        </table>

        <h3 style="color: #1e498a; border-bottom: 2px solid #cbd5e1; padding-bottom: 5px; margin-top: 25px;">Sócios Informados</h3>
        <ul style="padding-left: 20px; margin: 10px 0;">
          ${sociosListHtml}
        </ul>

        <h3 style="color: #ee661c; border-bottom: 2px solid #cbd5e1; padding-bottom: 5px; margin-top: 25px;">Dados de Financiamento</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 35%; color: #ee661c;">Valor Solicitado:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #ee661c;">${bancario?.valor_solicitado || "Não informado"}</td>
          </tr>
        </table>
      </div>
    `;

    // Enviar e-mail em background
    sendNotificationEmail(`📋 Nova Ficha BDMG: ${empresa.emp_razao}`, htmlContent);

    return NextResponse.json({ success: true, destination: result.destination });
  } catch (error: any) {
    console.error("Erro na API de cadastro BDMG:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
