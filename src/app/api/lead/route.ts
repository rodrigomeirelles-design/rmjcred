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

// Services that require vehicle data fields instead of company/credit fields
const VEHICLE_SERVICES = ["Veículos", "Garantia de Veículo", "Financiamento de Veículos"]

function parseCurrency(value: string | undefined): number | undefined {
  if (!value) return undefined
  const num = parseFloat(String(value).replace(/[^\d,\.]/g, "").replace(",", "."))
  return isNaN(num) ? undefined : num
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const servico = body.servico || "Capital de Giro BDMG"
    const produto = PRODUTO_MAP[servico] || servico
    const isVehicle = VEHICLE_SERVICES.includes(servico)

    // Build vehicle observations so the data shows in the CRM card
    let obs_finais: string | undefined = undefined
    if (isVehicle) {
      const parts: string[] = []
      if (body.marcaModelo) parts.push(`Veículo: ${body.marcaModelo}`)
      if (body.anoVeiculo)  parts.push(`Ano: ${body.anoVeiculo}`)
      if (body.valorVeiculo) parts.push(`Valor do veículo: ${body.valorVeiculo}`)
      if (body.entradaVeiculo) parts.push(`Entrada/Troco: ${body.entradaVeiculo}`)
      if (parts.length > 0) obs_finais = parts.join(" | ")
    }

    // For vehicle services use valorVeiculo; for others use the valor field
    const valor_solicitado = isVehicle
      ? parseCurrency(body.valorVeiculo)
      : parseCurrency(body.valor)

    const isBDMG = produto.includes("BDMG") || produto.includes("Capital de Giro")
    const tipo_pessoa = isBDMG ? "PJ" : "PF"

    const payload: Record<string, unknown> = {
      tipo_pessoa,
      produto,
      emp_razao: body.empresa || body.nome || "",
      emp_cnpj: (body.cnpj || body.cpf || "").replace(/\D/g, ""),
      emp_repr_nome: body.nome || "",
      emp_email: body.email || "",
      emp_telefone: (body.telefone || "").replace(/\D/g, ""),
      valor_solicitado,
    }

    if (obs_finais) payload.obs_finais = obs_finais

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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro interno"
    console.error("Erro na rota /api/lead:", error)
    return NextResponse.json({ success: false, message: msg }, { status: 500 })
  }
}
