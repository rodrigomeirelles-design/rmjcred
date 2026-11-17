import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import styles from "./page.module.css";
import BfHeroForm from "./BfHeroForm";
import BfSlideIn from "./BfSlideIn";
import WhatsAppCta from "./WhatsAppCta";

export const metadata: Metadata = {
  title: "Black Friday Crédito BDMG | Taxas a partir de Selic + 4,0% a.a. | RMJ Soluções de Crédito",
  description: "Aproveite a Black Friday do BDMG com a RMJ: taxas promocionais a partir de Selic + 4,0% a.a., até 12 meses de carência e prazo de até 72 meses. Análise gratuita em 24h para empresas de Minas Gerais.",
  alternates: {
    canonical: "https://rmjcred.com.br/black-friday-bdmg",
  },
  openGraph: {
    title: "Black Friday Crédito BDMG | Taxas a partir de Selic + 4,0% a.a. | RMJ Soluções",
    description: "Condição histórica de crédito empresarial no BDMG. Taxas a partir de Selic + 4,0% a.a., até 12 meses de carência e assessoria gratuita da RMJ.",
    url: "https://rmjcred.com.br/black-friday-bdmg",
    type: "website",
  },
};

const STEPS = [
  {
    title: "Você fala com a RMJ",
    text: "Preencha o formulário rápido ou chame no WhatsApp. Leva menos de 1 minuto para dar início à sua solicitação da Black Friday.",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 9h8M8 13h5" />
      </svg>
    ),
  },
  {
    title: "Diagnóstico da empresa",
    text: "Analisamos o perfil, faturamento e momento da sua empresa para enquadrar na melhor linha com a taxa promocional da Black Friday.",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
        <path d="M8 11h6M11 8v6" />
      </svg>
    ),
  },
  {
    title: "Estruturação da proposta",
    text: "Reunimos e organizamos toda a documentação necessária e estruturamos o processo junto ao BDMG sem você precisar sair da empresa.",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5" />
        <path d="m9 15 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Acompanhamento da análise",
    text: "Fazemos o acompanhamento direto junto aos analistas do banco, acelerando respostas e solucionando pendências em até 24h.",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    title: "Contratação e liberação",
    text: "Com a proposta aprovada nas condições da Black Friday, o contrato é assinado e o crédito liberado direto na conta bancária da sua empresa.",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
  "Atendimento presencial e dedicado — você fala com o Rodrigo, não com um robô",
  "Análise gratuita e diagnóstico do perfil da sua empresa em até 24h",
  "Suporte completo com a documentação — nós montamos todo o processo para você",
  "Sem venda casada — você contrata somente o crédito, sem produtos adicionais obrigatórios",
  "Correspondente bancário autorizado BDMG com mais de 20 anos de credibilidade",
];

export default function BlackFridayBdmgPage() {
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
                "name": "Como funciona a Black Friday de Crédito do BDMG?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A Black Friday do BDMG é uma campanha por tempo limitado com taxas reduzidas a partir de Selic + 4,0% a.a., carência de até 12 meses e prazos de até 72 meses para empresas em Minas Gerais."
                }
              },
              {
                "@type": "Question",
                "name": "Quem pode solicitar a taxa da Black Friday BDMG?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Micro, pequenas e médias empresas com CNPJ ativo e sede ou operação em Minas Gerais. A RMJ realiza a análise prévia e gratuita em até 24h."
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
            "name": "Black Friday Crédito BDMG para Empresas",
            "provider": {
              "@id": "https://rmjcred.com.br/#organizacao"
            },
            "areaServed": [
              { "@type": "City", "name": "Itajubá" },
              { "@type": "AdministrativeArea", "name": "Minas Gerais" }
            ]
          })
        }}
      />

      {/* 1. HERO em duas colunas */}
      <section className={styles.headerSection} id="topo">
        <div className={`${styles.heroGrid} container`}>
          <div className={styles.heroCopy}>
            <div className={styles.headerLogoWrapper}>
              <Image 
                src="/assets/selo-parceiro-bdmg-negativo.png" 
                alt="Selo Parceiro BDMG" 
                width={150} 
                height={85} 
                priority 
                style={{ objectFit: "contain", height: "auto" }} 
              />
              <div className={styles.bfCampaignBadge}>
                <span>🔥</span> Campanha Oficial
              </div>
            </div>

            <h1 className={styles.heroTitle}>
              Crédito BDMG na Black Friday
              <span className={styles.heroTitleHighlight}>Taxas a partir de Selic + 4,0% a.a.</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Aproveite a condição mais vantajosa do ano para empresas em Minas Gerais. Acesse capital de giro e investimento com <strong>taxas reduzidas</strong>, carência de até 12 meses e prazo de até 72 meses. Análise 100% gratuita sem compromisso.
            </p>

            <div className={styles.headerButtons}>
              <a href="#simular" className={styles.btnPrimaryBf}>
                <span>⚡</span> Quero minha análise gratuita
              </a>
              <WhatsAppCta location="hero" />
            </div>
          </div>

          <BfHeroForm />
        </div>
      </section>

      {/* 2. Barra de números com destaque Black Friday */}
      <section className={styles.highlightsBar}>
        <div className={`${styles.highlightsContainer} container`}>
          <div className={styles.highlightItem}>
            <span className={styles.highlightNumber}>Selic + 4,0%</span>
            <span className={styles.highlightLabel}>A Partir de / a.a.</span>
            <span className={styles.highlightDesc}>Condição especial exclusiva da Black Friday</span>
          </div>
          <div className={styles.highlightItem}>
            <span className={styles.highlightNumber}>12</span>
            <span className={styles.highlightLabel}>Meses de Carência</span>
            <span className={styles.highlightDesc}>Comece a pagar somente após 1 ano</span>
          </div>
          <div className={styles.highlightItem}>
            <span className={styles.highlightNumber}>72</span>
            <span className={styles.highlightLabel}>Meses de Prazo</span>
            <span className={styles.highlightDesc}>Opções flexíveis de amortização sob medida</span>
          </div>
          <div className={styles.highlightItem}>
            <span className={styles.highlightNumber}>0%</span>
            <span className={styles.highlightLabel}>Venda Casada</span>
            <span className={styles.highlightDesc}>Sem adesão forçada a títulos, cartões ou taxas</span>
          </div>
        </div>
      </section>

      {/* 3. Como Funciona — fluxo de contratação com a RMJ */}
      <section className={`${styles.stepsSection} section`} id="como-funciona">
        <div className="container">
          <h2 className={styles.sectionTitle} style={{ marginBottom: "0.75rem" }}>
            Como Funciona a Contratação com a RMJ
          </h2>
          <p className={styles.sectionSubtitle}>
            Do primeiro contato até a liberação do recurso em conta, a RMJ cuida de toda a estruturação da sua empresa.
          </p>

          <ol className={styles.flow}>
            {STEPS.map((step, i) => (
              <li key={step.title} className={styles.flowStep}>
                <div className={styles.flowMarker}>
                  <span className={styles.flowIcon}>{step.icon}</span>
                  <span className={styles.flowNumber} aria-hidden="true">{i + 1}</span>
                </div>
                <div className={styles.flowBody}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className={styles.flowCta}>
            <a href="#simular" className={styles.btnPrimaryBf}>
              <span>⚡</span> Quero minha análise gratuita
            </a>
            <WhatsAppCta location="card" />
          </div>
        </div>
      </section>

      {/* 4. Linhas de crédito disponíveis */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container page-grid">
          <article style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <h2 style={{ fontSize: "2rem", color: "var(--primary-dark)", marginBottom: "1rem" }}>
                Linhas de Crédito BDMG na Black Friday
              </h2>
              <p style={{ color: "var(--neutral-muted)", fontSize: "1.05rem", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                Durante o período da campanha, você pode direcionar o crédito para o objetivo estratégico da sua empresa com condições diferenciadas:
              </p>
              <ul style={{ color: "var(--neutral-muted)", fontSize: "1.05rem", lineHeight: "1.8", marginLeft: "1.5rem", marginBottom: "1.5rem" }}>
                <li>
                  <strong style={{ color: "var(--primary-dark)" }}>BDMG Capital de Giro Black Friday:</strong> Ideal para reforço de caixa, reposição de estoque para o final de ano e pagamento de fornecedores com carência de até 12 meses.
                </li>
                <li>
                  <strong style={{ color: "var(--primary-dark)" }}>BDMG Investimento Fixo:</strong> Financiamento para aquisição de máquinas, veículos de carga, equipamentos industriais ou obras de ampliação.
                </li>
                <li>
                  <strong style={{ color: "var(--primary-dark)" }}>BDMG Inovação:</strong> Financiamento específico para desenvolvimento de novos produtos, automação e modernização tecnológica.
                </li>
                <li>
                  <strong style={{ color: "var(--primary-dark)" }}>BDMG Exportação:</strong> Apoio e fortalecimento às empresas mineiras com atuação ou foco no mercado internacional.
                </li>
              </ul>
            </div>
          </article>

          <aside style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ padding: "1.5rem", backgroundColor: "var(--neutral-light)", borderRadius: "var(--radius-md)", border: "1px solid var(--neutral-border)" }}>
              <h3 style={{ fontSize: "1.2rem", color: "var(--primary-dark)", marginBottom: "1rem" }}>Outras Soluções de Crédito</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li><Link href="/pronampe" style={{ fontSize: "0.95rem", color: "var(--primary-color)" }}>Fomento PRONAMPE &rarr;</Link></li>
                <li><Link href="/procred-360" style={{ fontSize: "0.95rem", color: "var(--primary-color)" }}>ProCred 360 ME &rarr;</Link></li>
                <li><Link href="/home-equity" style={{ fontSize: "0.95rem", color: "var(--primary-color)" }}>Home Equity (Garantia de Imóvel) &rarr;</Link></li>
                <li><Link href="/credito-bdmg" style={{ fontSize: "0.95rem", color: "var(--primary-color)" }}>Página Oficial Crédito BDMG &rarr;</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* 5. Por que solicitar crédito BDMG pela RMJ */}
      <section className={`${styles.whySection} section`}>
        <div className={`${styles.whyGrid} container`}>
          <div>
            <h2 className={styles.sectionTitle} style={{ textAlign: "left" }}>
              Por Que Contratar a Black Friday BDMG com a RMJ?
            </h2>
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
            <Image 
              src="/assets/selo-parceiro-bdmg-cor.png" 
              alt="Selo Parceiro BDMG" 
              width={190} 
              height={107} 
              style={{ objectFit: "contain", height: "auto" }} 
            />
            <span className={styles.badgeLabel}>Correspondente Autorizado BDMG</span>
            <span className={styles.badgeSub}>RMJ Soluções de Crédito · Itajubá/MG</span>
          </div>
        </div>
      </section>

      {/* 6. CTA final */}
      <section className={`${styles.finalCta} section`}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className={styles.finalCtaTitle}>
            Pronto para garantir as taxas da Black Friday BDMG?
          </h2>
          <WhatsAppCta location="cta_section" large />
          <p className={styles.finalCtaBack}>
            Prefere preencher o formulário? <a href="#topo">Volte ao topo e receba sua análise em 24h</a>
          </p>
        </div>
      </section>

      {/* 7. Slide-In Popup de Captação da Black Friday */}
      <BfSlideIn />
    </>
  );
}
