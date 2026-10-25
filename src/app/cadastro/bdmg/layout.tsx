import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro Crédito BDMG | RMJ Soluções de Crédito",
  description: "Preencha sua ficha cadastral para simulação e solicitação de capital de giro BDMG com a RMJ Soluções de Crédito.",
  alternates: {
    canonical: "https://rmjcred.com.br/cadastro/bdmg",
  },
  openGraph: {
    title: "Cadastro Crédito BDMG | RMJ Soluções de Crédito",
    description: "Preencha sua ficha cadastral para simulação e solicitação de capital de giro BDMG com a RMJ Soluções de Crédito.",
    url: "https://rmjcred.com.br/cadastro/bdmg",
    siteName: "RMJ Soluções de Crédito",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-rmj.jpg",
        width: 1200,
        height: 630,
        alt: "Cadastro Crédito BDMG | RMJ Soluções de Crédito",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cadastro Crédito BDMG | RMJ Soluções de Crédito",
    description: "Preencha sua ficha cadastral para simulação e solicitação de capital de giro BDMG com a RMJ Soluções de Crédito.",
    images: ["/og-rmj.jpg"],
  },
};

export default function CadastroBdmgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
