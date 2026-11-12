import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cartas Contempladas em Itajubá e Sul de Minas | RMJ Soluções de Crédito",
  description: "Compra e venda de cartas de crédito contempladas com análise, validação e acompanhamento completo da RMJ Soluções de Crédito em Itajubá e Sul de Minas.",
  alternates: {
    canonical: "https://rmjcred.com.br/cartas-contempladas",
  },
  openGraph: {
    title: "Cartas Contempladas | RMJ Soluções de Crédito",
    description: "Crédito já liberado para uso imediato — compra, venda e suporte documental completo.",
    url: "https://rmjcred.com.br/cartas-contempladas",
    type: "website",
    images: [
      {
        url: "/assets/ci_hero_chaves.jpg",
        width: 1200,
        height: 630,
        alt: "Cartas Contempladas em Itajubá e Sul de Minas | RMJ Soluções de Crédito",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cartas Contempladas | RMJ Soluções de Crédito",
    description: "Crédito já liberado para uso imediato — compra, venda e suporte documental completo.",
    images: ["/assets/ci_hero_chaves.jpg"],
  },
};

export default function CartasContempladasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
