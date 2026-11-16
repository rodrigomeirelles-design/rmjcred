import { requireAuth } from "@/lib/serverAuth";
import { getPropostas } from "@/lib/sheets";
import { resolveTipoPessoa } from "@/types";
import ContatosClient from "./ContatosClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminContatosPage() {
  await requireAuth();
  
  let propostas: any[] = [];
  try {
    propostas = await getPropostas();
  } catch (e) {
    console.error("Erro ao carregar propostas para contatos:", e);
  }

  // Agrupar contatos por documento
  const contatosMap = new Map<string, any>();

  for (const p of propostas) {
    const doc = p.emp_cnpj ? p.emp_cnpj.replace(/\D/g, "") : "";
    if (!doc) continue;

    if (!contatosMap.has(doc)) {
      contatosMap.set(doc, {
        documento: doc,
        nome: p.emp_razao || "Sem Nome",
        email: p.emp_email || "",
        celular: p.emp_telefone || "",
        tipo: p.tipo_pessoa || resolveTipoPessoa(p.emp_cnpj, p.produto, p.emp_razao),
        produtos: []
      });
    }

    const c = contatosMap.get(doc);
    // Atualiza dados caso os anteriores estivessem vazios
    if (!c.email && p.emp_email) c.email = p.emp_email;
    if (!c.celular && p.emp_telefone) c.celular = p.emp_telefone;
    
    // Adiciona o produto à lista
    c.produtos.push({
      id: p.id_proposta,
      nome: p.produto || "Produto Desconhecido",
      data: p.timestamp_envio || "",
      etapa: p.coluna_kanban || ""
    });
  }

  const contatos = Array.from(contatosMap.values()).sort((a, b) => a.nome.localeCompare(b.nome));

  return <ContatosClient contatos={contatos} />;
}
