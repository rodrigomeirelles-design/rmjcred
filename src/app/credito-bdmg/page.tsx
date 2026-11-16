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
    title: "Você fala com a RMJ",
    text: "Preencha o formulário ou chame no WhatsApp. Leva menos de 1 minuto e você já fala com quem vai cuidar do seu crédito.",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 9h8M8 13h5" />
      </svg>
    ),
  },
  {
    title: "Diagnóstico da empresa",
    text: "Levantamos as informações do negócio — faturamento, necessidade e momento da empresa — e identificamos a linha BDMG mais adequada.",
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
    text: "Reunimos e conferimos a documentação, montamos a proposta e a encaminhamos ao BDMG. Você não precisa preencher nada no banco.",
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
    text: "Acompanhamos a análise de crédito, respondemos às exigências do banco e mantemos você informado em cada etapa.",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    title: "Contratação e liberação",
    text: "Com a proposta aprovada, conduzimos a assinatura do contrato e o crédito é liberado na conta da sua empresa.",
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
              <Image src="/assets/selo-parceiro-bdmg-negativo.png" alt="Selo Parceiro BDMG" width={150} height={85} priority style={{ objectFit: "contain", height: "auto" }} />
            </div>
            <h1 className={styles.heroTitle}>Crédito BDMG para Empresas em Itajubá e Sul de Minas</h1>
            <p className={styles.heroSubtitle}>
              Acesse linhas com taxas a partir de 1,2% a.m., carência de até 12 meses e prazo de até 72 meses. Análise gratuita e sem compromisso.
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

      {/* 3. Como Funciona — fluxo de contratação */}
      <section className={`${styles.stepsSection} section`} id="como-funciona">
        <div className="container">
          <h2 className={styles.sectionTitle} style={{ marginBottom: "0.75rem" }}>Como Funciona a Contratação com a RMJ</h2>
          <p className={styles.sectionSubtitle}>
            Do primeiro contato à liberação do crédito, a RMJ cuida de todo o processo para a sua empresa.
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
            <a href="#simular" className="btn btn-primary">Quero minha análise gratuita</a>
            <WhatsAppCta location="card" />
          </div>
        </div>
      </section>

      {/* 4. Linhas de crédito (mantida) */}
      <section className="section" style={{ backgroundColor: "var(--neutral-white)" }}>
        <div className="container page-grid">
          <article style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <h2 style={{ fontSize: "2rem", color: "var(--primary-dark)", marginBottom: "1rem" }}>Linhas de Crédito BDMG Disponíveis</h2>
              <ul style={{ color: "var(--neutral-muted)", fontSize: "1.05rem", lineHeight: "1.7", marginLeft: "1.5rem", marginBottom: "1rem" }}>
                <li><strong>BDMG Capital de Giro</strong> — recursos para manter o fluxo de caixa saudável, com carência de até 12 meses</li>
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
            <Image src="/assets/selo-parceiro-bdmg-cor.png" alt="Selo Parceiro BDMG" width={190} height={107} style={{ objectFit: "contain", height: "auto" }} />
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
