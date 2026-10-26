import { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Simulador de Consórcio em Etapas | RMJ Soluções de Crédito",
  description: "Simule seu consórcio de imóvel, veículo, moto, máquinas ou frota empresarial passo a passo com a RMJ Soluções de Crédito em Itajubá e Sul de Minas.",
  alternates: {
    canonical: "https://rmjcred.com.br/simulador-consorcio",
  },
  openGraph: {
    title: "Simulador de Consórcio em Etapas | RMJ Soluções de Crédito",
    description: "Simule seu consórcio de imóvel, veículo, moto, máquinas ou frota empresarial passo a passo com a RMJ Soluções de Crédito em Itajubá e Sul de Minas.",
    url: "https://rmjcred.com.br/simulador-consorcio",
    siteName: "RMJ Soluções de Crédito",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-rmj.jpg",
        width: 1200,
        height: 630,
        alt: "Simulador de Consórcio em Etapas | RMJ Soluções de Crédito",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simulador de Consórcio em Etapas | RMJ Soluções de Crédito",
    description: "Simule seu consórcio de imóvel, veículo, moto, máquinas ou frota empresarial passo a passo com a RMJ Soluções de Crédito em Itajubá e Sul de Minas.",
    images: ["/og-rmj.jpg"],
  },
};

export default function SimuladorConsorcioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
