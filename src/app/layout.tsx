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
  title: "RMJ Soluções de Crédito — Inteligência e Fomento Financeiro",
  description: "Hub financeiro completo em Itajubá - MG. Crédito BDMG para pequenos negócios, Financiamento Imobiliário, Home Equity, Veículos e Consórcios.",
  keywords: "crédito, BDMG, financiamento, imobiliário, home equity, consórcios, veículos, empréstimo, Itajubá, Minas Gerais",
  authors: [{ name: "RMJ Soluções de Crédito" }],
  icons: {
    icon: "/assets/ea111fdf9358a37c013843e46181e048.png",
    shortcut: "/assets/82a0558dcc302ec4d795b5e25bf80899.png",
    apple: "/assets/48b891dd6e65f9c7e893c3fa2fcccf82.png",
  },
  openGraph: {
    title: "RMJ Soluções de Crédito",
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
