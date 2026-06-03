import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "ProCred 360 em Itajubá: Fomento e Crédito para Microempresas | RMJ",
  description: "Acelere sua microempresa com a linha ProCred 360 em Itajubá. Taxas subsidiadas de Selic + 5% ao ano, carência diferenciada e suporte especializado da RMJ.",
};

export default function Procred360() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Fomento Financeiro ProCred",
    "provider": {
      "@type": "LocalBusiness",
      "name": "RMJ Soluções de Crédito",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rua Felipe Pizutto, 193",
        "addressLocality": "Itajubá",
        "addressRegion": "MG",
        "postalCode": "37500-000",
        "addressCountry": "BR"
      }
    },
    "areaServed": "Itajubá, Minas Gerais",
    "name": "ProCred 360 em Itajubá",
    "description": "Crédito diferenciado com taxas bonificadas e exclusivas para microempresas com faturamento anual de até R$ 360 mil. Selic + 5% ao ano.",
    "url": "https://rmjcred.com.br/procred-360"
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "O que é o ProCred 360 e como funciona?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O ProCred 360 é uma linha de crédito governamental de fomento instituída no âmbito do Programa Acredita. É focada no fortalecimento de microempresas (ME) com faturamento bruto anual de até R$ 360 mil, oferecendo taxas bonificadas de Selic + 5% ao ano e carência flexível."
        }
      },
      {
        "@type": "Question",
        "name": "A RMJ Soluções de Crédito atende MEI no ProCred 360?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Não. Para a linha ProCred 360, a RMJ assessora unicamente empresas enquadradas formalmente como Microempresa (ME), com faturamento anual comprovado. Nós não atendemos a categoria de Microempreendedores Individuais (MEI)."
        }
      },
      {
        "@type": "Question",
        "name": "Qual é a taxa de juros do ProCred 360?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A taxa máxima estipulada pelo regulamento do fomento federal do ProCred 360 é a taxa básica de juros (Selic) acrescida de 5% ao ano. Trata-se de uma taxa com bonificação de fomento extremamente barata frente a qualquer capital de giro comum no mercado."
        }
      },
      {
        "@type": "Question",
        "name": "Como simular o crédito ProCred 360?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Basta preencher o formulário no rodapé desta página ou falar diretamente com o Rodrigo no WhatsApp da RMJ. Nosso time de assessoria realizará a consulta de limite pré-aprovado junto aos bancos parceiros e guiará sua empresa no compartilhamento do e-CAC."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* 1. Cabeçalho da Página */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
            <ol style={{ display: 'flex', listStyle: 'none', gap: '0.5rem', padding: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
              <li><Link href="/" style={{ color: 'inherit' }}>Início</Link></li>
              <li>/</li>
              <li style={{ color: '#fff' }}>ProCred 360</li>
            </ol>
          </nav>
          <h1 className={styles.title}>
            Fomento <span className={styles.italicTitle}>ProCred 360</span> em Itajubá
          </h1>
          <p className={styles.leadText}>
            A linha de fomento governamental perfeita para impulsionar o comércio ou os serviços da sua microempresa. Juros limitados a taxa Selic + apenas 5% ao ano e carência flexível sob assessoria digital da RMJ.
          </p>
        </div>
      </section>

      {/* 2. Conteúdo Principal Denso */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-white)' }}>
        <div className="container page-grid">
          
          {/* Coluna do Artigo de Conteúdo */}
          <article style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>O que é o ProCred 360 e como ele auxilia sua microempresa?</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                Instituído no âmbito das novas políticas de fomento econômico nacional (como o Programa Acredita), o <strong>ProCred 360</strong> é uma linha de crédito governamental altamente atrativa, focada de forma exclusiva no crescimento de microempresas. Seu propósito é garantir sustentação financeira a negócios que muitas vezes encontram juros proibitivos nas linhas de varejo bancário tradicional.
              </p>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                A grande novidade do ProCred 360 é a sua **taxa bonificada**. Enquanto o crédito de giro empresarial no mercado livre flutua com spreads altíssimos, esta linha federal tem seus juros máximos tabelados em <strong>Selic + 5% ao ano</strong>. Isso garante parcelas previsíveis, fáceis de amortizar e perfeitamente compatíveis com a realidade operacional de pequenos empreendimentos comerciais ou de serviços.
              </p>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', padding: '1rem', borderLeft: '4px solid var(--secondary-color)', backgroundColor: 'var(--neutral-light)', fontStyle: 'italic' }}>
                <strong>Esclarecimento Importante sobre Elegibilidade:</strong> Na RMJ Soluções de Crédito, **prestamos assessoria exclusivamente para empresas enquadradas como Microempresa (ME)**. Não atendemos ou prestamos serviços a Microempreendedores Individuais (MEI) para esta linha de fomento.
              </p>
            </div>

            {/* Comparativo de Taxas e Vantagens */}
            <div style={{ margin: '2rem 0', padding: '2rem', backgroundColor: 'var(--neutral-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-border)' }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>ProCred 360 vs Financiamentos de Varejo</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--neutral-border)' }}>
                      <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Parâmetro</th>
                      <th style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>Fomento ProCred 360</th>
                      <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Capital de Giro Comercial</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Taxa de Juros Máxima</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Selic + 5% ao ano</td>
                      <td style={{ padding: '0.75rem' }}>Juros flutuantes e elevados de mercado</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Público-Alvo</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Microempresas (faturamento até R$ 360 mil/ano)</td>
                      <td style={{ padding: '0.75rem' }}>Qualquer porte, com maior barreira de aprovação</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Burocracia Cadastral</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Facilitada (Via e-CAC compartilhado)</td>
                      <td style={{ padding: '0.75rem' }}>Alta exigência de documentação e balanços complexos</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Tarifas Escondidas</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Regulamentadas e limitadas</td>
                      <td style={{ padding: '0.75rem' }}>Seguros embutidos e taxas de abertura elevadas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Requisitos de enquadramento e limites do ProCred 360</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                Para acessar as condições privilegiadas de fomento do ProCred 360, a sua microempresa deve observar os seguintes critérios técnicos:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.25rem', color: 'var(--neutral-muted)', lineHeight: '1.6' }}>
                <li><strong>Porte Empresarial e Faturamento:</strong> O programa atende microempresas que possuam receita bruta anual declarada de <strong>até R$ 360 mil</strong> no ano-calendário anterior ao pedido.</li>
                <li><strong>Regularidade de Dívidas Ativas:</strong> O CNPJ deve estar regularizado perante os órgãos de arrecadação do governo federal e estadual. Não é permitida a contratação por empresas com dívidas fiscais ativas não parceladas.</li>
                <li><strong>Diagnóstico pelo e-CAC:</strong> Assim como em outras linhas de fomento federais, a verificação e liberação do limite requerem o compartilhamento temporário seguro das informações de faturamento no portal e-CAC da Receita Federal com as instituições financeiras parceiras que operam a linha.</li>
                <li><strong>Garantias Complementares:</strong> O programa conta com fundos de garantia federais, porém o tomador (sócio majoritário) poderá prestar aval como garantia de conformidade contratual.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Como a assessoria da RMJ acelera sua liberação no ProCred 360?</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                A contratação de recursos públicos de fomento exige exatidão no preenchimento de cadastros e relacionamento com bancos operadores credenciados. A RMJ cuida de tudo para você:
              </p>
              <ol style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.25rem', color: 'var(--neutral-muted)', lineHeight: '1.6' }}>
                <li><strong>Análise Preliminar:</strong> Avaliamos o enquadramento do faturamento do seu CNPJ de maneira ágil.</li>
                <li><strong>Apoio no e-CAC:</strong> Instruímos o compartilhamento correto e seguro dos dados com os bancos operadores parceiros (como Banco do Brasil ou Caixa Econômica Federal) de forma rápida.</li>
                <li><strong>Montagem do Dossiê:</strong> Organizamos os cadastros dos sócios e da empresa para evitar recusas ou retornos por inconsistências burocráticas.</li>
                <li><strong>Acompanhamento até o Crédito:</strong> Monitoramos o status da proposta junto aos comitês de crédito até que o recurso de fomento bonificado seja integralmente creditado em sua conta corrente jurídica.</li>
              </ol>
            </div>

            {/* Perguntas Frequentes (FAQs) */}
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>Perguntas Frequentes sobre o ProCred 360</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Quais microempresas podem solicitar o ProCred 360?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Todas as microempresas (ME) sediadas no Brasil com faturamento bruto anual registrado de até R$ 360 mil, desde que estejam com as certidões negativas fiscais federais e estaduais ativas e regularizadas.
                  </p>
                </div>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>A RMJ Soluções de Crédito atende MEI nessa modalidade?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Não. Nós focamos exclusivamente no atendimento de empresas enquadradas como Microempresa (ME). Não atendemos Microempreendedores Individuais (MEI) para esta linha de fomento.
                  </p>
                </div>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>O que significa taxa Selic + 5% ao ano?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Significa que o custo anual do seu crédito será composto pelo valor da taxa básica de juros do Brasil (a taxa Selic definida pelo Banco Central) somada a uma margem (spread) fixa de apenas 5% ao ano. Trata-se de uma taxa subsidiada altamente vantajosa e muito inferior à praticada em cartões de crédito corporativo, cheque especial ou capital de giro tradicional sem incentivo estatal.
                  </p>
                </div>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Existe tarifa de abertura ou taxa cobrada pela RMJ?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Não. Nossos serviços de assessoria cadastral e simulação são 100% gratuitos para a sua empresa. Nossos honorários são pagos exclusivamente pelas instituições financeiras credenciadas após o fechamento da operação.
                  </p>
                </div>
              </div>
            </div>

          </article>

          {/* Barra Lateral (Sidebar de Navegação de Serviços Relacionados) */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--neutral-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-border)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Serviços Relacionados</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link href="/credito-bdmg" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Capital de Giro BDMG &rarr;</Link></li>
                <li><Link href="/pronampe" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Fomento PRONAMPE &rarr;</Link></li>
                <li><Link href="/home-equity" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Home Equity (Garantia) &rarr;</Link></li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'var(--primary-dark)', color: '#fff', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>Fale Conosco</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                Tire suas dúvidas sobre documentos fiscais, faturamento ou taxas com o Rodrigo.
              </p>
              <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className="btn btn-accent" style={{ width: '100%', fontSize: '0.9rem' }}>
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
            <h2>Aproveite as Taxas Bonificadas do ProCred 360</h2>
            <p className={styles.leadText} style={{ color: "var(--neutral-muted)" }}>
              Preencha os dados abaixo e nosso time credenciado analisará a linha de fomento ideal para a sua microempresa de forma rápida.
            </p>
          </div>
          <div>
            <LeadForm defaultService="ProCred 360" />
          </div>
        </div>
      </section>
    </>
  );
}
