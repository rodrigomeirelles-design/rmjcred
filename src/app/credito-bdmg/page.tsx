import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Crédito BDMG para Empresas em MG | Até R$ 500 mil | RMJ Soluções",
  description: "Acesse linhas de crédito BDMG com taxas a partir de 1,2% a.m. para empresas de Minas Gerais. Consultoria especializada RMJ em Itajubá. Solicite análise gratuita.",
};;

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
            "name": "Capital de Giro BDMG",
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
    
      {/* 1. Cabeçalho da Página */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <div className={styles.headerLogoWrapper}>
             <Image src="/assets/logo-bdmg-parceiro-244x150.png" alt="Parceiro BDMG" width={140} height={45} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </div>
          <h1 className={styles.title} style={{ maxWidth: "600px", fontSize: "3.5rem", lineHeight: "1.1", fontWeight: "800" }}>Crédito BDMG: Linhas Exclusivas para Empresas de Minas Gerais</h1>
          <div className={styles.leadText}>
            <p style={{marginBottom: "1rem"}}>O BDMG (Banco de Desenvolvimento de Minas Gerais) disponibilizou R$ 1 bilhão em crédito para micro e pequenas empresas em 2026. A RMJ Soluções de Crédito, em Itajubá, é correspondente autorizado e ajuda sua empresa a acessar essas linhas com condições diferenciadas — taxas a partir de 1,2% a.m. e prazos de até 60 meses.</p>
          </div>
          <div className={styles.headerButtons}>
            <Link href="#simular" className="btn btn-primary">Simular Crédito Agora</Link>
            <Link href="#como-funciona" className={styles.btnOutline}>Como Funciona?</Link>
          </div>
        </div>
      </section>

      {/* 2. Destaques / Benefícios de Carência */}
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

      {/* 2. Conteúdo Principal Denso */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-white)' }}>
        <div className="container page-grid">
          
          {/* Coluna do Artigo de Conteúdo */}
          <article style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Linhas de Crédito BDMG Disponíveis</h2>
              <ul style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginLeft: '1.5rem', marginBottom: '1rem' }}>
                <li><strong>BDMG Capital de Giro</strong> — recursos para manter o fluxo de caixa saudável, com carência de até 6 meses</li>
                <li><strong>BDMG Investimento Fixo</strong> — financiamento para máquinas, equipamentos e reforma de instalações</li>
                <li><strong>BDMG Inovação</strong> — linha específica para projetos de inovação e tecnologia</li>
                <li><strong>BDMG Exportação</strong> — capital de giro para empresas exportadoras mineiras</li>
              </ul>
            </div>
            
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Por Que Solicitar Crédito BDMG pela RMJ?</h2>
              <ul style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginLeft: '1.5rem', marginBottom: '1rem' }}>
                <li>Taxas a partir de 1,2% a.m. — abaixo da média dos bancos comerciais</li>
                <li>Prazos de até 60 meses para pagamento</li>
                <li>Carência de até 12 meses em algumas linhas</li>
                <li>Atendimento presencial em Itajubá e região (200 km)</li>
                <li>Análise de crédito gratuita e sem compromisso</li>
                <li>Suporte completo na documentação</li>
              </ul>
            </div>
          </article>

          {/* Barra Lateral (Sidebar de Navegação de Serviços Relacionados) */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--neutral-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-border)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Serviços Relacionados</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link href="/pronampe" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Fomento PRONAMPE &rarr;</Link></li>
                <li><Link href="/procred-360" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>ProCred 360 ME &rarr;</Link></li>
                <li><Link href="/home-equity" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Home Equity (Garantia) &rarr;</Link></li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'var(--primary-dark)', color: '#fff', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>Fale Conosco</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                Tire suas dúvidas sobre documentos fiscais, faturamento ou taxas com o Rodrigo.
              </p>
              <a href="https://wa.me/5535991084513" target="_blank" rel="noopener noreferrer" className="btn btn-accent" style={{ width: '100%', fontSize: '0.9rem' }}>
                Falar no WhatsApp
              </a>
            </div>
          </aside>

        </div>
      </section>

      {/* 3. Seção de Simulação / LeadForm */}
      <section className={`${styles.ctaSection} section`} id="simular">
        <div className={`${styles.ctaContainer} container`}>
          <div className={styles.titleContainer}>
            <span className={styles.backLink} style={{ color: "var(--secondary-color)" }}>Simulação Gratuita</span>
            <h2>Impulsione o Caixa da sua Empresa com o BDMG</h2>
            <p className={styles.leadText} style={{ color: "var(--neutral-muted)" }}>
              Preencha os dados abaixo e nosso time credenciado analisará a linha de fomento ideal para a sua empresa.
            </p>
          </div>
          <div>
            <LeadForm defaultService="BDMG" />
          </div>
        </div>
      </section>
    </>
  );
}
