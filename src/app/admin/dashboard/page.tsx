import { requireAuth } from "@/lib/serverAuth";
import { getPropostas, getPropostasImovel, getPropostasVeiculo } from "@/lib/sheets";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  await requireAuth();

  let propostasPj: any[] = [];
  let propostasImovel: any[] = [];
  let propostasVeiculo: any[] = [];

  try {
    [propostasPj, propostasImovel, propostasVeiculo] = await Promise.all([
      getPropostas(),
      getPropostasImovel(),
      getPropostasVeiculo(),
    ]);
  } catch (error) {
    console.error("Erro ao buscar dados para o Dashboard:", error);
  }

  return (
    <div className="h-full">
      <DashboardClient
        propostasPj={propostasPj}
        propostasImovel={propostasImovel}
        propostasVeiculo={propostasVeiculo}
      />
    </div>
  );
}
