import { NextRequest, NextResponse } from 'next/server'
import { saveCadastro } from '@/lib/dataStore'
import { saveLeadToCrm } from '@/lib/crmDbHelper'
import { sendNotificationEmail } from '@/lib/emailHelper'

const CRM_URL = "https://crm-rmj-mvp-rodrigo.netlify.app"

const PRODUTO_MAP: Record<string, string> = {
  "Capital de Giro BDMG": "BDMG Capital de Giro",
  "Home Equity": "Home Equity (Crédito com Garantia de Imóvel)",
  "Financiamento Imobiliário": "Financiamento Imobiliário",
  "Consórcio": "Consórcio",
  "Consórcios": "Consórcio",
  "Simulador de Consórcio": "Consórcio",
  "Crédito Veicular": "Crédito Veicular",
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const servico = body.servico || "Capital de Giro BDMG"
    const produto = PRODUTO_MAP[servico] || servico
    const origem = body.origem || "site-rmj"
    const tipoPessoa = body.tipoPessoa === "Empresa" || body.tipo_pessoa === "PJ" ? "PJ" : (body.tipoPessoa === "Pessoa Física" ? "PF" : "PJ")

    const payload = {
      tipo_pessoa: tipoPessoa,
      produto,
      origem,
      emp_razao: body.empresa || body.nome || "",
      emp_cnpj: (body.cnpj || "").replace(/\D/g, ""),
      emp_repr_nome: body.nome || "",
      emp_email: body.email || "",
      emp_telefone: (body.telefone || body.whatsapp || "").replace(/\D/g, ""),
      cidade: body.cidade || "",
      valor_solicitado: body.valor
        ? parseFloat(String(body.valor).replace(/[^\d,\.]/g, "").replace(",", ".")) || undefined
        : undefined,
      detalhes_simulacao: body.detalhes_simulacao || undefined,
    }

    // 1. Persistir no dataStore (SQLite / GAS) e CRM local
    try {
      await saveCadastro(origem, { ...body, origem })
      saveLeadToCrm({
        nome: body.nome || "Lead",
        email: body.email || "",
        telefone: body.telefone || body.whatsapp || "",
        empresa: body.empresa || (body.cidade ? `${body.nome} - ${body.cidade}` : ""),
        cnpj: body.cnpj || "",
        servico: produto,
        valor: body.valor || 0,
      })
    } catch (localErr) {
      console.warn("Aviso ao salvar localmente:", localErr)
    }

    // 2. Enviar e-mail de notificação se for simulador-consorcio
    if (origem === "simulador-consorcio") {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #f8fafc;">
          <h2 style="color: #162F4B; margin-top: 0;">🎯 Nova Simulação de Consórcio (${origem})</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 40%;">Nome:</td><td style="padding: 6px 0;">${body.nome || "-"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">WhatsApp:</td><td style="padding: 6px 0;">${body.whatsapp || body.telefone || "-"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Cidade:</td><td style="padding: 6px 0;">${body.cidade || "-"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Perfil:</td><td style="padding: 6px 0;">${body.tipoPessoa || "-"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Objetivo:</td><td style="padding: 6px 0;">${body.objetivo || "-"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Valor da Carta:</td><td style="padding: 6px 0; color: #EE661C; font-weight: bold;">${body.valorFormatado || body.valor || "-"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Simular por:</td><td style="padding: 6px 0;">${body.preferenciaSimulacao || "-"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Prazo de Contemplação:</td><td style="padding: 6px 0;">${body.prazoContemplacao || "-"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Tem Lance ou FGTS:</td><td style="padding: 6px 0;">${body.temLanceOuFgts || "-"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Origem:</td><td style="padding: 6px 0;">${origem}</td></tr>
          </table>
        </div>
      `
      sendNotificationEmail(`🎯 Simulador de Consórcio: ${body.nome || "Novo Lead"}`, htmlContent)
    }

    // 3. Enviar para o CRM externo
    try {
      const crmRes = await fetch(`${CRM_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const crmData = await crmRes.json()

      if (crmData && crmData.success) {
        return NextResponse.json({ success: true, message: "Lead registrado com sucesso", id: crmData.id, origem })
      }
    } catch (crmErr) {
      console.warn("Aviso ao sincronizar com CRM externo:", crmErr)
    }

    return NextResponse.json({ success: true, message: "Lead registrado com sucesso", origem })
  } catch (error: any) {
    console.error("Erro na rota /api/lead:", error)
    return NextResponse.json({ success: false, message: error.message || "Erro interno" }, { status: 500 })
  }
}
