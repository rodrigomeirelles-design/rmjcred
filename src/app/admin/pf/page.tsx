import { getPropostasImovel, getPropostasVeiculo, getPropostas } from "@/lib/sheets";
import { KANBAN_COLUMNS } from "@/types";
import { KANBAN_COLUMNS_VEICULO } from "@/types/veiculo";
import AdminPFClient from "./AdminPFClient";

export const dynamic = "force-dynamic";

export default async function PessoaFisicaPage() {
  const [propostasImovel, propostasVeiculo, todasPropostas] = await Promise.all([
    getPropostasImovel(),
    getPropostasVeiculo(),
    getPropostas(),
  ]);

  // Mapa de etapa kanban pelo id da proposta (kanban principal)
  const stageMapPrincipal = new Map(
    todasPropostas
      .filter((p) => p.tipo_pessoa === "PF")
      .map((p) => [p.id_proposta, p.coluna_kanban])
  );

  // Enriquecer imóvel
  const enrichedImovel = propostasImovel.map((p) => ({
    ...p,
    tipo_ficha: "imovel" as const,
    etapa_kanban: stageMapPrincipal.get(p.id_proposta) ?? "novo_negocio",
    etapa_label: KANBAN_COLUMNS.find(
      (c) => c.id === (stageMapPrincipal.get(p.id_proposta) ?? "novo_negocio")
    )?.label ?? "Novo Negócio",
    // campo unificado para exibição na tabela
    nome_display: p.nome,
    cpf_display: p.cpf,
    valor_display: p.valorFinanciamento,
    produto_display: p.produto,
    timestamp_display: p.timestamp_envio,
  }));

  // Enriquecer veículo com etapa do kanban de veículos (coluna_kanban está na própria proposta)
  const enrichedVeiculo = propostasVeiculo.map((p) => ({
    ...p,
    tipo_ficha: "veiculo" as const,
    etapa_kanban: p.coluna_kanban ?? "novo_lead",
    etapa_label: KANBAN_COLUMNS_VEICULO.find(
      (c) => c.id === (p.coluna_kanban ?? "novo_lead")
    )?.label ?? "Novo Lead",
    // campo unificado para exibição na tabela
    nome_display: p.nome,
    cpf_display: p.cpf,
    valor_display: p.valor_financiamento,
    produto_display: p.produto,
    timestamp_display: p.timestamp_envio,
  }));

  // Unificar as duas listas e ordenar pela mais recente
  const todasPF = [...enrichedImovel, ...enrichedVeiculo].sort((a, b) => {
    const tA = a.timestamp_display ? new Date(a.timestamp_display).getTime() : 0;
    const tB = b.timestamp_display ? new Date(b.timestamp_display).getTime() : 0;
    return tB - tA;
  });

  return <AdminPFClient initialPropostas={todasPF} />;
}
