import { getPropostas } from "@/lib/sheets";
import EditarClient from "./EditarClient";
import { notFound } from "next/navigation";

export default async function EditarPropostaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const propostas = await getPropostas();
  const proposta = propostas.find((p) => p.id_proposta === id);
  if (!proposta) notFound();
  return <EditarClient proposta={proposta} />;
}
