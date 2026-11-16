import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import styles from "./page.module.css";
import BdmgHeroForm from "./BdmgHeroForm";
import BdmgSlideIn from "./BdmgSlideIn";
import WhatsAppCta from "./WhatsAppCta";

export const metadata: Metadata = {
  title: "Crédito BDMG para Empresas em Itajubá | RMJ Soluções de Crédito",
  description: "Acesse linhas de crédito BDMG com taxas a partir de 1,2% a.m. para sua empresa em Itajubá e região. Análise gratuita e atendimento presencial. Fale com a RMJ.",
  alternates: {
    canonical: "https://rmjcred.com.br/credito-bdmg",
  },
  openGraph: {
    title: "Crédito BDMG para Empresas em Itajubá | RMJ Soluções de Crédito",
    description: "Acesse linhas de crédito BDMG com taxas a partir de 1,2% a.m. para sua empresa em Itajubá e região. Análise gratuita e atendimento presencial. Fale com a RMJ.",
    url: "https://rmjcred.com.br/credito-bdmg",
    type: "website",
  },
};

const STEPS = [
  {
    title: "Sua empresa pede",
    text: "Preencha o formulário ou fale no WhatsApp. Leva menos de 1 minuto.",
    icon: (
      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 3.5h6v2.5H9z" />
        <path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" />
      </svg>
    ),
  },
  {
    title: "RMJ orienta",
    text: "Nossa equipe analisa o perfil da sua empresa e indica a melhor linha BDMG, sem custo.",
    icon: (
      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
        <path d="m21 3 1 11h-2" />
        <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
        <path d="M3 4h8" />
      </svg>
    ),
  },
  {
    title: "BDMG aprova",
    text: "Com a documentação pronta, o crédito é liberado direto na conta da sua empresa.",
    icon: (
      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 3v18" />
        <path d="M15 7H9.5a3 3 0 0 0 0 6h3a3 3 0 0 1 2.4 1.2" />
        <path d="M5 17h6" />
        <circle cx="18" cy="18" r="4" />
        <path d="m16.4 18 1.1 1.1 2.1-2.2" />
      </svg>
    ),
  },
];

const VANTAGENS = [
  "Atendimento presencial — você fala com o Rodrigo, não com um robô",
  "Análise gratuita do perfil da sua empresa em 24h",
  "Suporte completo com a documentação — nós montamos o processo para você",
  "Sem venda casada — você contrata só o crédito",
];

export default function CreditoBdmg() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Quais empresas podem solicitar crédito BDMG?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Micro, pequenas e médias empresas com CNPJ ativo e sede ou operação em Minas Gerais podem solicitar crédito BDMG. A RMJ Soluções faz a análise prévia gratuita."
                }
              },
              {
                "@type": "Question",
                "name": "Qual a taxa de juros do crédito BDMG?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "As taxas do BDMG começam em 1,2% a.m., variando conforme a linha e o perfil da empresa. Consulte a RMJ para uma simulação personalizada."
                }
              }
            ]
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Crédito BDMG para Empresas",
            "provider": {
              "@id": "https://rmjcred.com.br/#organizacao"
            },
            "areaServed": [
              { "@type": "City", "name": "Itajubá" },
              { "@type": "AdministrativeArea", "name": "Sul de Minas Gerais" }
            ]
          })
        }}
      />

      {/* 1. HERO em duas colunas */}
      <section className={styles.headerSection} id="topo">
        <div className={`${styles.heroGrid} container`}>
          <div className={styles.heroCopy}>
            <div className={styles.headerLogoWrapper}>
              <Image src="/assets/logo-bdmg-parceiro-244x150.png" alt="Parceiro BDMG" width={140} height={45} style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
            </div>
            <h1 className={styles.heroTitle}>Crédito BDMG para Empresas em Itajubá e Sul de Minas</h1>
            <p className={styles.heroSubtitle}>
              Acesse linhas com taxas a partir de 1,2% a.m., carência de até 12 meses e prazo de até 60 meses. Análise gratuita e sem compromisso.
            </p>
            <div className={styles.headerButtons}>
              <a href="#simular" className="btn btn-primary">Quero minha análise gratuita</a>
              <WhatsAppCta location="hero" />
            </div>
          </div>
          <BdmgHeroForm />
        </div>
      </section>

      {/* 2. Barra de números (mantida) */}
      <section className={styles.highlightsBar}>
        <div className={`${styles.highlightsContainer} container`}>
          <div className={styles.highlightItem}>
            <span className={styles.highlightNumber}>12</span>
            <span className={styles.highlightLabel}>Meses de Carência</span>
            <span className={styles.highlightDesc}>Comece a pagar somente após 1 ano</span>
          </div>
          <div className={styles.highlightItem}>
            <span className={styles.highlightNumber}>72</span>
            <span className={styles.highlightLabel}>Meses de Prazo</span>
            <span className={styles.highlightDesc}>Opções flexíveis de amortização e pagamento</span>
          </div>
          <div className={styles.highlightItem}>
            <span className={styles.highlightNumber}>0%</span>
            <span className={styles.highlightLabel}>Venda Casada</span>
            <span className={styles.highlightDesc}>Sem exigência de adesão a cartões ou outros produtos</span>
          </div>
        </div>
      </section>

      {/* 3. Como Funciona */}
      <section className={`${styles.stepsSection} section`} id="como-funciona">
        <div className="container">
          <h2 className={styles.sectionTitle}>Como Funciona</h2>
          <ol className={styles.stepsGrid}>
            {STEPS.map((step, i) => (
              <li key={step.title} className={styles.stepCard}>
                <span className={styles.stepNumber} aria-hidden="true">{i + 1}</span>
                <span className={styles.stepIcon}>{step.icon}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                {i < STEPS.length - 1 && <span className={styles.stepArrow} aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Linhas de crédito (mantida) */}
      <section className="section" style={{ backgroundColor: "var(--neutral-white)" }}>
        <div className="container page-grid">
          <article style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <h2 style={{ fontSize: "2rem", color: "var(--primary-dark)", marginBottom: "1rem" }}>Linhas de Crédito BDMG Disponíveis</h2>
              <ul style={{ color: "var(--neutral-muted)", fontSize: "1.05rem", lineHeight: "1.7", marginLeft: "1.5rem", marginBottom: "1rem" }}>
                <li><strong>BDMG Capital de Giro</strong> — recursos para manter o fluxo de caixa saudável, com carência de até 6 meses</li>
                <li><strong>BDMG Investimento Fixo</strong> — financiamento para máquinas, equipamentos e reforma de instalações</li>
                <li><strong>BDMG Inovação</strong> — linha específica para projetos de inovação e tecnologia</li>
                <li><strong>BDMG Exportação</strong> — capital de giro para empresas exportadoras mineiras</li>
              </ul>
            </div>
          </article>

          <aside style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ padding: "1.5rem", backgroundColor: "var(--neutral-light)", borderRadius: "var(--radius-md)", border: "1px solid var(--neutral-border)" }}>
              <h3 style={{ fontSize: "1.2rem", color: "var(--primary-dark)", marginBottom: "1rem" }}>Serviços Relacionados</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li><Link href="/pronampe" style={{ fontSize: "0.95rem", color: "var(--primary-color)" }}>Fomento PRONAMPE &rarr;</Link></li>
                <li><Link href="/procred-360" style={{ fontSize: "0.95rem", color: "var(--primary-color)" }}>ProCred 360 ME &rarr;</Link></li>
                <li><Link href="/home-equity" style={{ fontSize: "0.95rem", color: "var(--primary-color)" }}>Home Equity (Garantia) &rarr;</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* 5. Por que solicitar pela RMJ */}
      <section className={`${styles.whySection} section`}>
        <div className={`${styles.whyGrid} container`}>
          <div>
            <h2 className={styles.sectionTitle} style={{ textAlign: "left" }}>Por Que Solicitar Crédito BDMG pela RMJ?</h2>
            <ul className={styles.whyList}>
              {VANTAGENS.map((item) => (
                <li key={item}>
                  <span className={styles.whyCheck} aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.badge}>
            <Image src="/assets/logo-bdmg-parceiro-244x150.png" alt="Logo BDMG" width={160} height={98} style={{ objectFit: "contain" }} />
            <span className={styles.badgeLabel}>Correspondente Autorizado BDMG</span>
            <span className={styles.badgeSub}>RMJ Soluções de Crédito · Itajubá/MG</span>
          </div>
        </div>
      </section>

      {/* 7. CTA final */}
      <section className={`${styles.finalCta} section`}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className={styles.finalCtaTitle}>Pronto para acessar o crédito BDMG?</h2>
          <WhatsAppCta location="cta_section" large />
          <p className={styles.finalCtaBack}>
            Prefere o formulário? <a href="#topo">Volte ao topo</a>
          </p>
        </div>
      </section>

      {/* 8. Slide-in de captação */}
      <BdmgSlideIn />
    </>
  );
}
