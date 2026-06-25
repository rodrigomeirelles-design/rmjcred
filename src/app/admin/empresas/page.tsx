import { getPropostas } from "@/lib/sheets";
import EmpresasClient from "./EmpresasClient";
import { requireAuth } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EmpresasPage() {
  await requireAuth();
  let propostas: Awaited<ReturnType<typeof getPropostas>> = [];
  try {
    propostas = await getPropostas();
  } catch (error) {
    console.error("Erro ao carregar empresas:", error);
  }
  return <EmpresasClient initialPropostas={propostas} />;
}
