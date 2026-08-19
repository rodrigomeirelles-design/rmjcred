import { redirect } from "next/navigation";

export default function CreditoBdmgPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Redireciona para /cadastro/bdmg preservando todos os UTM params
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string") params.set(key, value);
  });
  const query = params.toString();
  redirect(`/cadastro/bdmg${query ? `?${query}` : ""}`);
}
