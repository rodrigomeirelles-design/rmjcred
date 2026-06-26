import { NextResponse } from "next/server";
import { appendDynamicRow } from "@/lib/googleSheetsWriter";
import { sendNotificationEmail } from "@/lib/emailHelper";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("[API /cadastro/bdmg] Recebido:", JSON.stringify(payload).slice(0, 300));

    const { empresa, socios, bancario } = payload;

    if (!empresa?.emp_cnpj || !empresa?.emp_razao) {
      return NextResponse.json(
        { success: false, error: "Dados da empresa incompletos." },
        { status: 400 }
      );
    }

    const now = new Date().toLocaleDateString("pt-BR");

    await appendDynamicRow("Empresas", {
      CNPJ: empresa.emp_cnpj ?? "",
      "Razão Social": empresa.emp_razao ?? "",
      Fantasia: empresa.emp_fantasia ?? "",
      "Nº Funcionários": empresa.emp_funcionarios ?? "",
      Faturamento: empresa.emp_faturamento ?? "",
      Representante: empresa.emp_representante ?? socios?.[0]?.soc_nome ?? "",
      "CPF Representante": empresa.emp_cpf_representante ?? socios?.[0]?.soc_cpf ?? "",
      "E-mail": empresa.emp_email ?? "",
      Telefone: empresa.emp_telefone ?? "",
      CEP: empresa.emp_cep ?? "",
      Logradouro: empresa.emp_logradouro ?? "",
      Número: empresa.emp_numero ?? "",
      Bairro: empresa.emp_bairro ?? "",
      Cidade: empresa.emp_cidade ?? "",
      UF: empresa.emp_uf ?? "",
      "Possui Imóvel": empresa.emp_possui_imovel ?? "",
      "Tipo Matrícula": empresa.emp_tipo_matricula ?? "",
      "Valor Imóvel": empresa.emp_valor_imovel ?? "",
      DataCadastro: now,
    });

    if (Array.isArray(socios)) {
      for (const socio of socios) {
        await appendDynamicRow("Socios", {
          "CNPJ Empresa": empresa.emp_cnpj ?? "",
          "Nome Sócio": socio.soc_nome ?? "",
          "CPF Sócio": socio.soc_cpf ?? "",
          "RG Sócio": socio.soc_rg ?? "",
          "Emissão RG Sócio": socio.soc_emissao_rg ?? "",
          Nascimento: socio.soc_nascimento ?? "",
          "Participação %": socio.soc_participacao ?? "",
          "Estado Civil": socio.soc_estado_civil ?? "",
          Regime: socio.soc_regime ?? "",
          "E-mail Sócio": socio.soc_email ?? "",
          "Telefone Sócio": socio.soc_whatsapp ?? socio.soc_telefone ?? "",
          "Renda Sócio": socio.soc_renda ?? "",
          "CEP Sócio": socio.soc_cep ?? "",
          "Endereço Sócio": socio.soc_endereco ?? "",
          "Bens Sócio (Imóvel)": socio.soc_bens_imovel ?? "",
          "Valor Bens Sócio": socio.soc_valor_bens ?? "",
          "Veículos Sócio": socio.soc_veiculos ?? "",
          "Nome Cônjuge": socio.conj_nome ?? "",
          "CPF Cônjuge": socio.conj_cpf ?? "",
          "RG Cônjuge": socio.conj_rg ?? "",
          "Emissão RG Cônjuge": socio.conj_emissao_rg ?? "",
          "Nascimento Cônjuge": socio.conj_nascimento ?? "",
          "E-mail Cônjuge": socio.conj_email ?? "",
          "Telefone Cônjuge": socio.conj_telefone ?? "",
          "Incluir Renda Cônjuge": socio.incluir_renda_conj ?? "",
          "Renda Cônjuge": socio.conj_renda ?? "",
          DataCadastro: now,
        });
      }
    }

    if (bancario) {
      await appendDynamicRow("DadosBancarios", {
        "CNPJ Empresa": empresa.emp_cnpj ?? "",
        Banco: bancario.banco ?? "",
        Agência: bancario.agencia ?? "",
        "Conta Corrente": bancario.conta ?? "",
        DataCadastro: now,
      });
    }

    // --- ENVIAR PARA O CRM NOVO ---
    try {
      const crmPayload = {
        tipo_pessoa: "PJ",
        emp_razao: empresa.emp_razao,
        emp_cnpj: empresa.emp_cnpj || "",
        emp_repr_nome: empresa.emp_representante || socios?.[0]?.soc_nome || "",
        emp_repr_cpf: empresa.emp_cpf_representante || socios?.[0]?.soc_cpf || "",
        emp_email: empresa.emp_email || "",
        emp_telefone: empresa.emp_telefone || "",
        valor_solicitado: parseFloat(String(bancario?.valor_solicitado).replace(/\D/g, "")) / 100 || 0,
        produto: "BDMG Capital de Giro"
      };

      const crmRes = await fetch("https://crm-rmj-mvp-rodrigo.netlify.app/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(crmPayload),
      });

      if (!crmRes.ok) {
        console.error("[API /cadastro/bdmg] Erro ao enviar para CRM:", await crmRes.text());
      } else {
        console.log(`[API /cadastro/bdmg] Proposta de ${empresa.emp_razao} enviada ao CRM com sucesso.`);
      }
    } catch (e) {
      console.error("[API /cadastro/bdmg] Falha ao comunicar com o CRM:", e);
    }
    // ------------------------------

    console.log(`[API /cadastro/bdmg] ${empresa.emp_razao} gravado na planilha com sucesso.`);

    const sociosListHtml = Array.isArray(socios)
      ? socios
          .map(
            (s: any) =>
              `<li style="margin-bottom:8px;border-bottom:1px dashed #cbd5e1;padding-bottom:8px;">
                <strong>Nome:</strong> ${s.soc_nome ?? "Não informado"}<br/>
                <strong>WhatsApp:</strong> ${s.soc_whatsapp ?? "Não informado"}<br/>
                <strong>Participação:</strong> ${s.soc_participacao ?? "Não informado"}
              </li>`
          )
          .join("")
      : "<li>Nenhum sócio informado</li>";

    const htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;">
        <h2 style="color:#1e498a;margin-top:0;">📋 Nova Proposta: Capital de Giro BDMG</h2>
        <h3 style="color:#1e498a;">Dados da Empresa</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;font-weight:bold;width:35%;">Razão Social:</td><td>${empresa.emp_razao}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">CNPJ:</td><td>${empresa.emp_cnpj}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Faturamento Anual:</td><td>${empresa.emp_faturamento ?? "Não informado"}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">E-mail:</td><td>${empresa.emp_email ?? "Não informado"}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Telefone:</td><td>${empresa.emp_telefone ?? "Não informado"}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Cidade/UF:</td><td>${empresa.emp_cidade ?? ""}-${empresa.emp_uf ?? "MG"}</td></tr>
        </table>
        <h3 style="color:#1e498a;">Sócios</h3>
        <ul style="padding-left:20px;margin:10px 0;">${sociosListHtml}</ul>
        <h3 style="color:#ee661c;">Valor Solicitado</h3>
        <p style="color:#ee661c;font-weight:bold;font-size:1.2rem;">${bancario?.valor_solicitado ?? "Não informado"}</p>
      </div>`;

    await sendNotificationEmail(`📋 Nova Ficha BDMG: ${empresa.emp_razao}`, htmlContent);

    return NextResponse.json({ success: true, destination: "sheets" });
  } catch (error: any) {
    console.error("[API /cadastro/bdmg] Erro:", error?.message ?? error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
