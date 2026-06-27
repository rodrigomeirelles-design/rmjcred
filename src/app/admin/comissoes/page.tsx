import { getPropostas } from "@/lib/sheets";
import { Proposta } from "@/types";
import ComissoesClient from "./ComissoesClient";
import { requireAuth } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ComissoesPage() {
  await requireAuth();
  let propostas: Proposta[] = [];
  try {
    propostas = await getPropostas();
  } catch (error) {
    console.error("Erro ao carregar propostas:", error);
  }
  return <ComissoesClient propostas={propostas} />;
}
