import { getPropostas } from "@/lib/sheets";
import AdminPropostasClient from "./AdminPropostasClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPropostasPage() {
  let propostas: Awaited<ReturnType<typeof getPropostas>> = [];
  try {
    propostas = await getPropostas();
  } catch (error) {
    console.error("Erro ao carregar propostas:", error);
  }
  return <AdminPropostasClient initialPropostas={propostas} />;
}
