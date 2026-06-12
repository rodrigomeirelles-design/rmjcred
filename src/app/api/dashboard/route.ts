import { NextResponse } from "next/server";
import db from "@/lib/db";
import { syncGoogleSheetsToCrm } from "@/lib/crmSync";

// GET /api/dashboard - Aggregated stats for dashboard
export async function GET() {
  try {
    // Sincroniza dados da planilha do Google em background/realtime
    await syncGoogleSheetsToCrm();

    // Total stats
    const totalPropostas = db.prepare("SELECT COUNT(*) as count FROM oportunidades").get() as { count: number };
    const totalEmpresas = db.prepare("SELECT COUNT(*) as count FROM empresas").get() as { count: number };
    
    const valorSolicitado = db.prepare("SELECT COALESCE(SUM(valor_solicitado), 0) as total FROM oportunidades").get() as { total: number };
    const valorAprovado = db.prepare("SELECT COALESCE(SUM(valor_aprovado), 0) as total FROM oportunidades WHERE valor_aprovado IS NOT NULL").get() as { total: number };
    const valorLiberado = db.prepare("SELECT COALESCE(SUM(valor_aprovado), 0) as total FROM oportunidades WHERE coluna_kanban = 'liberado'").get() as { total: number };
    const comissaoTotal = db.prepare("SELECT COALESCE(SUM(comissao_esperada), 0) as total FROM oportunidades").get() as { total: number };
    const comissaoRecebida = db.prepare("SELECT COALESCE(SUM(comissao_esperada), 0) as total FROM oportunidades WHERE status_repasse = 'recebido'").get() as { total: number };

    // Pipeline distribution
    const pipeline = db.prepare(`
      SELECT coluna_kanban, COUNT(*) as count, COALESCE(SUM(valor_solicitado), 0) as total_valor
      FROM oportunidades
      GROUP BY coluna_kanban
    `).all();

    // Canal distribution
    const canais = db.prepare(`
      SELECT COALESCE(canal, 'Capital de Giro BDMG') as canal, COUNT(*) as count, COALESCE(SUM(valor_solicitado), 0) as total_valor
      FROM oportunidades
      GROUP BY canal
    `).all();

    // Pending tasks count
    const tarefasPendentes = db.prepare("SELECT COUNT(*) as count FROM tarefas WHERE concluida = 0").get() as { count: number };
    const tarefasVencidas = db.prepare("SELECT COUNT(*) as count FROM tarefas WHERE concluida = 0 AND data_vencimento < date('now')").get() as { count: number };

    // Recent opportunities
    const recentes = db.prepare(`
      SELECT o.*, e.razao_social, e.cnpj
      FROM oportunidades o
      LEFT JOIN empresas e ON o.empresa_id = e.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `).all();

    // Conversion rate
    const aprovadas = db.prepare("SELECT COUNT(*) as count FROM oportunidades WHERE coluna_kanban IN ('aprovada', 'liberado')").get() as { count: number };
    const conversao = totalPropostas.count > 0 ? ((aprovadas.count / totalPropostas.count) * 100).toFixed(1) : "0.0";

    return NextResponse.json({
      totalPropostas: totalPropostas.count,
      totalEmpresas: totalEmpresas.count,
      valorSolicitado: valorSolicitado.total,
      valorAprovado: valorAprovado.total,
      valorLiberado: valorLiberado.total,
      comissaoTotal: comissaoTotal.total,
      comissaoRecebida: comissaoRecebida.total,
      pipeline,
      canais,
      tarefasPendentes: tarefasPendentes.count,
      tarefasVencidas: tarefasVencidas.count,
      recentes,
      conversao: parseFloat(conversao)
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
