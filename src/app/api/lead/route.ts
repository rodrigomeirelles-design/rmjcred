import { NextRequest, NextResponse } from 'next/server'

const CRM_URL = "https://crm-rmj-mvp-rodrigo.netlify.app"

const PRODUTO_MAP: Record<string, string> = {
  // Capital de Giro BDMG
  "BDMG":                  "BDMG Capital de Giro",
  "Capital de Giro BDMG":  "BDMG Capital de Giro",
  // Imóvel
  "Crédito Imobiliário":   "Financiamento Imobiliário",
  "Home Equity":           "Home Equity (Crédito com Garantia de Imóvel)",
  "Financiamento Imobiliário": "Financiamento Imobiliário",
  // Veículos
  "Veículos":              "Financiamento de Veículos",
  "Garantia de Veículo":   "Crédito com Garantia de Veículo",
  "Financiamento de Veículos": "Financiamento de Veículos",
  // Outros
  "Consórcios":            "Consórcio",
  "Consórcio":             "Consórcio",
  "Outros":                "Outros Serviços",
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const servico = body.servico || "Capital de Giro BDMG"
    const produto = PRODUTO_MAP[servico] || servico

    const payload = {
      tipo_pessoa: "PJ",
      produto,
      emp_razao: body.empresa || body.nome || "",
      emp_cnpj: (body.cnpj || "").replace(/\D/g, ""),
      emp_repr_nome: body.nome || "",
      emp_email: body.email || "",
      emp_telefone: (body.telefone || "").replace(/\D/g, ""),
      valor_solicitado: body.valor
        ? parseFloat(String(body.valor).replace(/[^\d,\.]/g, "").replace(",", ".")) || undefined
        : undefined,
    }

    const crmRes = await fetch(`${CRM_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const crmData = await crmRes.json()

    if (!crmData.success) {
      console.error("CRM retornou erro:", crmData)
      return NextResponse.json({ success: false, message: "Erro ao registrar lead no CRM" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Lead registrado com sucesso", id: crmData.id })
  } catch (error: any) {
    console.error("Erro na rota /api/lead:", error)
    return NextResponse.json({ success: false, message: error.message || "Erro interno" }, { status: 500 })
  }
}
