import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consórcios em Itajubá e Sul de Minas | RMJ Soluções de Crédito",
  description: "A melhor opção de consórcios para você e sua empresa em Itajubá e Sul de Minas. Simule agora com a RMJ Soluções de Crédito.",
  alternates: {
    canonical: "https://rmjcred.com.br/consorcios",
  },
  openGraph: {
    title: "Consórcios em Itajubá e Sul de Minas | RMJ Soluções de Crédito",
    description: "A melhor opção de consórcios para você e sua empresa em Itajubá e Sul de Minas. Simule agora com a RMJ Soluções de Crédito.",
    url: "https://rmjcred.com.br/consorcios",
    siteName: "RMJ Soluções de Crédito",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-rmj.jpg",
        width: 1200,
        height: 630,
        alt: "Consórcios em Itajubá e Sul de Minas | RMJ Soluções de Crédito",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Consórcios em Itajubá e Sul de Minas | RMJ Soluções de Crédito",
    description: "A melhor opção de consórcios para você e sua empresa em Itajubá e Sul de Minas. Simule agora com a RMJ Soluções de Crédito.",
    images: ["/og-rmj.jpg"],
  },
};

export default function ConsorciosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
