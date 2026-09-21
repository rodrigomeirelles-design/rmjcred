import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rmjcred.com.br"),
  title: "RMJ Soluções de Crédito — Inteligência e Fomento Financeiro",
  description: "Com mais de 20 anos de experiência, a RMJ é o seu hub financeiro completo. Crédito BDMG, Financiamento Imobiliário, Home Equity, Veículos e Consórcios em Itajubá e região.",
  keywords: "crédito, BDMG, financiamento imobiliário, home equity, consórcios, veículos, empréstimo, capital de giro, Itajubá, Minas Gerais, 20 anos de experiência, correspondente bancário",
  authors: [{ name: "RMJ Soluções de Crédito" }],
  icons: {
    icon: "/assets/ea111fdf9358a37c013843e46181e048.png",
    shortcut: "/assets/82a0558dcc302ec4d795b5e25bf80899.png",
    apple: "/assets/48b891dd6e65f9c7e893c3fa2fcccf82.png",
  },
  openGraph: {
    title: "RMJ Soluções de Crédito | 20 Anos de Mercado",
    description: "Expertise e atendimento estratégico para impulsionar negócios e viabilizar conquistas financeiras.",
    url: "https://www.rmjcred.com.br",
    siteName: "RMJ Soluções de Crédito",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable}`}
      style={{ height: "100%" }}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["FinancialService", "LocalBusiness"],
              "@id": "https://www.rmjcred.com.br/#organization",
              "legalName": "RMJ Representações",
              "alternateName": "RMJ Soluções de Crédito",
              "url": "https://www.rmjcred.com.br",
              "description": "Correspondente bancário parceiro oficial do BDMG no sul de Minas Gerais, oferecendo capital de giro, financiamento imobiliário e estruturação de crédito.",
              "sameAs": [
                "https://cnpj.biz/57115632000118",
                "https://www.linkedin.com/company/rmj-solu%C3%A7%C3%B5es-de-cr%C3%A9dito-rmj-cred/"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Itajubá",
                "addressRegion": "MG",
                "addressCountry": "BR"
              },
              "areaServed": "Minas Gerais"
            })
          }}
        />
      </head>
      <body style={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh",
        paddingTop: "70px" /* Espaço para a Navbar fixa */
      }}>
        <Navbar />
        <main style={{ flex: "1 0 auto" }}>
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
