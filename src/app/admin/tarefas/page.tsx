import { requireAuth } from "@/lib/serverAuth";
import { getPropostasImovel, getPropostasVeiculo } from "@/lib/sheets";
import TarefasClient from "./TarefasClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPainelPage() {
  await requireAuth();
  
  let imoveis: any[] = [];
  let veiculos: any[] = [];
  try {
    [imoveis, veiculos] = await Promise.all([
      getPropostasImovel(),
      getPropostasVeiculo()
    ]);
  } catch (e) {
    console.error("Erro ao carregar propostas para o painel:", e);
  }

  const aniversarios: any[] = [];

  const addAniversario = (nome: string, doc: string, nascimento: string) => {
    if (!nascimento) return;
    const parts = nascimento.split("/"); // DD/MM/YYYY
    if (parts.length === 3) {
      aniversarios.push({
        nome: nome,
        documento: doc,
        dia: parseInt(parts[0], 10),
        mes: parseInt(parts[1], 10),
        anoNascimento: parseInt(parts[2], 10)
      });
    }
  };

  for (const p of imoveis) {
    addAniversario(p.nome, p.cpf, p.nascimento);
  }
  for (const p of veiculos) {
    addAniversario(p.nome, p.cpf, p.nascimento);
  }

  return <TarefasClient aniversarios={aniversarios} />;
}
