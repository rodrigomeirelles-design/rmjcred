import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AnalyticsProvider from "@/components/AnalyticsProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rmjcred.com.br"),
  title: "RMJ Soluções de Crédito — Inteligência e Fomento Financeiro",
  description: "Com mais de 20 anos de experiência, a RMJ é o seu hub financeiro completo. Crédito BDMG, Financiamento Imobiliário, Home Equity, Veículos e Consórcios em Itajubá e região.",
  authors: [{ name: "RMJ Soluções de Crédito" }],
  icons: {
    icon: "/assets/ea111fdf9358a37c013843e46181e048.png",
    shortcut: "/assets/82a0558dcc302ec4d795b5e25bf80899.png",
    apple: "/assets/48b891dd6e65f9c7e893c3fa2fcccf82.png",
  },
  openGraph: {
    title: "RMJ Soluções de Crédito | 20 Anos de Mercado",
    description: "Expertise e atendimento estratégico para impulsionar negócios e viabilizar conquistas financeiras.",
    url: "https://rmjcred.com.br",
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
              "@type": "FinancialService",
              "@id": "https://rmjcred.com.br/#organizacao",
              "name": "RMJ Soluções de Crédito",
              "legalName": "RMJ Representações",
              "alternateName": ["RMJ Cred", "RMJ Representações"],
              "taxID": "57.115.632/0001-18",
              "url": "https://rmjcred.com.br",
              "logo": "https://rmjcred.com.br/assets/logo-rmj-header.jpg",
              "image": "https://rmjcred.com.br/assets/rmj-office.jpg",
              "description": "Correspondente bancário e consultoria de crédito empresarial em Itajubá e Sul de Minas: capital de giro BDMG, PRONAMPE, ProCred 360, consórcios, financiamento de veículos e imobiliário.",
              "telephone": "+55-35-99108-4513",
              "email": "contato@rmjcred.com.br",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rua Felipe Pizutto, 193",
                "addressLocality": "Itajubá",
                "addressRegion": "MG",
                "postalCode": "37500-000",
                "addressCountry": "BR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-22.426",
                "longitude": "-45.453"
              },
              "hasMap": "https://maps.app.goo.gl/q3bXW81Tf1WXZX1k7",
              "areaServed": [
                { "@type": "City", "name": "Itajubá" },
                { "@type": "AdministrativeArea", "name": "Sul de Minas Gerais" },
                { "@type": "City", "name": "Pouso Alegre" },
                { "@type": "City", "name": "Santa Rita do Sapucaí" },
                { "@type": "City", "name": "São Lourenço" },
                { "@type": "City", "name": "Varginha" },
                { "@type": "City", "name": "Três Corações" },
                { "@type": "City", "name": "Poços de Caldas" },
                { "@type": "City", "name": "Extrema" },
                { "@type": "City", "name": "Lavras" }
              ],
              "founder": {
                "@type": "Person",
                "name": "Rodrigo Meirelles",
                "jobTitle": "Fundador"
              },
              "sameAs": [
                "https://www.instagram.com/rmjcred/",
                "https://www.facebook.com/people/RMJ-Solu%C3%A7%C3%B5es-de-Cr%C3%A9dito/61571346777005/"
              ]
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
        <AnalyticsProvider />
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
