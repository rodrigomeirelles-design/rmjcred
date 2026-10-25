import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consórcio de Veículos em Itajubá e Sul de Minas | RMJ",
  description: "Consórcio planejado sem juros para carros novos e seminovos, motos, caminhões, máquinas agrícolas e frota empresarial em Itajubá e num raio de 200 km.",
  alternates: {
    canonical: "https://rmjcred.com.br/consorcio-de-veiculos",
  },
  openGraph: {
    title: "Consórcio de Veículos em Itajubá e Sul de Minas | RMJ",
    description: "Consórcio planejado sem juros para carros novos e seminovos, motos, caminhões, máquinas agrícolas e frota empresarial em Itajubá e num raio de 200 km.",
    url: "https://rmjcred.com.br/consorcio-de-veiculos",
    siteName: "RMJ Soluções de Crédito",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-rmj.jpg",
        width: 1200,
        height: 630,
        alt: "Consórcio de Veículos em Itajubá e Sul de Minas | RMJ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Consórcio de Veículos em Itajubá e Sul de Minas | RMJ",
    description: "Consórcio planejado sem juros para carros novos e seminovos, motos, caminhões, máquinas agrícolas e frota empresarial em Itajubá e num raio de 200 km.",
    images: ["/og-rmj.jpg"],
  },
};

export default function ConsorcioDeVeiculosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
