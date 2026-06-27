import { getPropostasImovel, getPropostas } from "@/lib/sheets";
import { KANBAN_COLUMNS } from "@/types";
import AdminPFClient from "./AdminPFClient";

export const dynamic = "force-dynamic";

export default async function PessoaFisicaPage() {
  const [propostasImovel, todasPropostas] = await Promise.all([
    getPropostasImovel(),
    getPropostas(),
  ]);

  const stageMap = new Map(
    todasPropostas
      .filter((p) => p.tipo_pessoa === "PF")
      .map((p) => [p.id_proposta, p.coluna_kanban])
  );

  const enriched = propostasImovel.map((p) => ({
    ...p,
    etapa_kanban: stageMap.get(p.id_proposta) ?? "novo_negocio",
    etapa_label: KANBAN_COLUMNS.find((c) => c.id === (stageMap.get(p.id_proposta) ?? "novo_negocio"))?.label ?? "Novo Negócio",
  }));

  return <AdminPFClient initialPropostas={enriched} />;
}
