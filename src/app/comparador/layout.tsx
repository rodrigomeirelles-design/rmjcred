import { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Comparador Consórcio x Financiamento x Home Equity | RMJ",
  description: "Compare o custo total estimado entre Consórcio, Financiamento Tradicional e Home Equity a partir do valor do crédito, prazo e taxas informados.",
  alternates: {
    canonical: "https://rmjcred.com.br/comparador",
  },
  openGraph: {
    title: "Comparador Consórcio x Financiamento x Home Equity | RMJ",
    description: "Compare o custo total estimado entre Consórcio, Financiamento Tradicional e Home Equity a partir do valor do crédito, prazo e taxas informados.",
    url: "https://rmjcred.com.br/comparador",
    siteName: "RMJ Soluções de Crédito",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-rmj.jpg",
        width: 1200,
        height: 630,
        alt: "Comparador Consórcio x Financiamento x Home Equity | RMJ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comparador Consórcio x Financiamento x Home Equity | RMJ",
    description: "Compare o custo total estimado entre Consórcio, Financiamento Tradicional e Home Equity a partir do valor do crédito, prazo e taxas informados.",
    images: ["/og-rmj.jpg"],
  },
};

export default function ComparadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
