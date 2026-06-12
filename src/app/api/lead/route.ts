import { NextRequest, NextResponse } from 'next/server'
import { saveLeadToCrm } from '@/lib/crmDbHelper'

const GAS_URL = process.env.GAS_WEB_APP_URL

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!GAS_URL) {
      console.error('GAS_WEB_APP_URL not configured')
      return NextResponse.json({ success: false, message: 'Configuração ausente' }, { status: 500 })
    }

    // Salva o lead no banco de dados local SQLite (CRM) para aparecer no painel Clientes
    saveLeadToCrm({
      nome: body.nome || '',
      email: body.email || '',
      telefone: body.telefone || '',
      empresa: body.empresa || '',
      cnpj: body.cnpj || '',
      servico: body.servico || '',
      valor: body.valor || '',
    });

    // Envia os dados para o Google Apps Script no formato esperado
    const gasPayload = {
      formType: 'lead',
      data: {
        nome: body.nome || '',
        email: body.email || '',
        telefone: body.telefone || '',
        empresa: body.empresa || '',
        cnpj: body.cnpj || '',
        servico: body.servico || '',
        valor: body.valor || '',
        marcaModelo: body.marcaModelo || '',
        anoVeiculo: body.anoVeiculo || '',
        valorVeiculo: body.valorVeiculo || '',
        entradaVeiculo: body.entradaVeiculo || '',
      },
    }

    const gasResponse = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      body: JSON.stringify(gasPayload),
    })

    // Lê a resposta como texto primeiro (GAS pode retornar HTML em caso de erro)
    const responseText = await gasResponse.text()

    let gasData = {}
    try {
      gasData = JSON.parse(responseText)
    } catch {
      // GAS retornou algo que não é JSON — logar mas não falhar
      console.warn('GAS response não é JSON:', responseText.substring(0, 200))
    }

    if (!gasResponse.ok) {
      console.error('GAS retornou erro HTTP:', gasResponse.status, responseText.substring(0, 300))
      return NextResponse.json(
        { success: false, message: 'Erro ao enviar para o CRM' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Lead processado com sucesso' })
  } catch (error) {
    console.error('Erro na rota /api/lead:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Erro interno' },
      { status: 500 }
    )
  }
}
