import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consórcios em Itajubá e Sul de Minas | RMJ Soluções de Crédito",
  description: "A melhor opção de consórcios para você e sua empresa em Itajubá e Sul de Minas. Simule agora com a RMJ Soluções de Crédito.",
};

export default function ConsorciosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
