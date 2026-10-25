import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ficha de Financiamento Imobiliário | RMJ Soluções de Crédito",
  description: "Preencha seus dados para simular e solicitar seu financiamento imobiliário com as melhores taxas na RMJ Soluções de Crédito.",
  alternates: {
    canonical: "https://rmjcred.com.br/cadastro/financiamento-imobiliario",
  },
  openGraph: {
    title: "Ficha de Financiamento Imobiliário | RMJ Soluções de Crédito",
    description: "Preencha seus dados para simular e solicitar seu financiamento imobiliário com as melhores taxas na RMJ Soluções de Crédito.",
    url: "https://rmjcred.com.br/cadastro/financiamento-imobiliario",
    siteName: "RMJ Soluções de Crédito",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-rmj.jpg",
        width: 1200,
        height: 630,
        alt: "Ficha de Financiamento Imobiliário | RMJ Soluções de Crédito",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ficha de Financiamento Imobiliário | RMJ Soluções de Crédito",
    description: "Preencha seus dados para simular e solicitar seu financiamento imobiliário com as melhores taxas na RMJ Soluções de Crédito.",
    images: ["/og-rmj.jpg"],
  },
};

export default function CadastroFinanciamentoImobiliarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
