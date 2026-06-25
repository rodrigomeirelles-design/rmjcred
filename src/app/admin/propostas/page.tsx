import { getPropostas } from "@/lib/sheets";
import AdminPropostasClient from "./AdminPropostasClient";
import { requireAuth } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPropostasPage() {
  await requireAuth();
  let propostas: Awaited<ReturnType<typeof getPropostas>> = [];
  try {
    propostas = await getPropostas();
  } catch (error) {
    console.error("Erro ao carregar propostas:", error);
  }
  return <AdminPropostasClient initialPropostas={propostas} />;
}
