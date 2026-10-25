import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consórcio Imobiliário em Itajubá e Sul de Minas | RMJ",
  description: "Planeje a compra, construção ou reforma do seu imóvel residencial ou comercial sem juros com assessoria consultiva da RMJ em Itajubá e num raio de 200 km.",
  alternates: {
    canonical: "https://rmjcred.com.br/consorcio-imobiliario",
  },
  openGraph: {
    title: "Consórcio Imobiliário em Itajubá e Sul de Minas | RMJ",
    description: "Planeje a compra, construção ou reforma do seu imóvel residencial ou comercial sem juros com assessoria consultiva da RMJ em Itajubá e num raio de 200 km.",
    url: "https://rmjcred.com.br/consorcio-imobiliario",
    siteName: "RMJ Soluções de Crédito",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-rmj.jpg",
        width: 1200,
        height: 630,
        alt: "Consórcio Imobiliário em Itajubá e Sul de Minas | RMJ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Consórcio Imobiliário em Itajubá e Sul de Minas | RMJ",
    description: "Planeje a compra, construção ou reforma do seu imóvel residencial ou comercial sem juros com assessoria consultiva da RMJ em Itajubá e num raio de 200 km.",
    images: ["/og-rmj.jpg"],
  },
};

export default function ConsorcioImobiliarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
