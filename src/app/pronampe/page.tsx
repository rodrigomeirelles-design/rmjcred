import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Pronampe 2026 em Itajubá e Sul de Minas | Crédito para MPEs | RMJ",
  description: "Solicite o Pronampe 2026 com acompanhamento completo. Taxas a partir de Selic + 6% a.a., até R$ 150 mil para micro e pequenas empresas. Consultoria RMJ em Itajubá.",
};;

export default function Pronampe() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Crédito Pronampe",
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
    "name": "PRONAMPE em Itajubá",
    "description": "Crédito governamental facilitado com garantia do FGO para microempresas e empresas de pequeno porte com taxas controladas e carência.",
    "url": "https://rmjcred.com.br/pronampe"
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Qual a diferença entre Pronampe e empréstimo comum?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Pronampe possui taxas de juros limitadas por lei (Selic + 6% a.a.) e usa o FGO como garantia, tornando-o muito mais barato e acessível do que linhas de crédito comuns de mercado, que costumam passar de 25% a.a."
        }
      },
      {
        "@type": "Question",
        "name": "Quanto tempo leva para liberar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Com a documentação em dia e suporte da consultoria RMJ, o processo de aprovação e liberação na conta da sua empresa costuma ocorrer entre 5 e 10 dias úteis."
        }
      },
      {
        "@type": "Question",
        "name": "Posso usar o recurso para qualquer coisa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O recurso pode ser usado para qualquer atividade da empresa (capital de giro, pagamento de salários, compra de estoque, maquinário). É proibido usá-lo para distribuição de lucros entre os sócios."
        }
      },
      {
        "@type": "Question",
        "name": "Empresa com restrição pode solicitar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Empresas com restrições graves ou impostos federais atrasados geralmente não conseguem a CND (Certidão Negativa de Débitos), que é obrigatória para acessar o Pronampe. A RMJ pode orientar sobre a regularização prévia."
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
              <li style={{ color: '#fff' }}>Pronampe</li>
            </ol>
          </nav>
          <h1 className={styles.title}>Pronampe 2026: Crédito com as Melhores Condições para Micro e Pequenas Empresas</h1>
          <div className={styles.leadText}>
            <p style={{marginBottom: "1rem"}}>O Programa Nacional de Apoio às Microempresas e Empresas de Pequeno Porte (Pronampe) é a principal linha de crédito do Governo Federal para pequenos negócios. Com taxas subsidiadas, prazos estendidos e garantia do FGO (Fundo Garantidor de Operações), o Pronampe se tornou a opção mais acessível para empreendedores que precisam de capital de giro ou investimento.</p>
            <p>A RMJ Soluções de Crédito é especialista em Pronampe e auxilia empresas de Itajubá e região a acessar esse recurso com agilidade, desde a documentação até a liberação.</p>
          </div>
        </div>
      </section>

      {/* 2. Conteúdo Principal Denso */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-white)' }}>
        <div className="container page-grid">
          
          {/* Coluna do Artigo de Conteúdo */}
          <article style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div>
              <h2 style={{ fontSize: "2rem", color: "var(--primary-dark)", marginBottom: "1rem" }}>Condições Atualizadas do Pronampe 2026</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                O <strong>Programa Nacional de Apoio às Microempresas e Empresas de Pequeno Porte (PRONAMPE)</strong> foi criado originalmente pela Lei nº 13.999 em 2020 e tornou-se uma das linhas de crédito oficiais mais requisitadas por empresários do Brasil. O objetivo é assegurar liquidez e fluxo de fomento contínuo para o fortalecimento de pequenas corporações.
              </p>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                O grande diferencial do PRONAMPE é a segurança dada às instituições financeiras operadoras. Por meio do <strong>FGO (Fundo Garantidor de Operações)</strong>, o governo federal assegura até 100% da garantia da operação em caso de inadimplência. Com o risco mitigado, as instituições bancárias parceiras conseguem liberar limites de crédito substanciais a taxas substancialmente mais baratas e com menos barreiras burocráticas tradicionais.
              </p>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', padding: '1rem', borderLeft: '4px solid var(--secondary-color)', backgroundColor: 'var(--neutral-light)', fontStyle: 'italic' }}>
                <strong>Atenção sobre o perfil atendido:</strong> Embora a lei nacional do programa preveja a elegibilidade de diferentes categorias legais, a <strong>RMJ Soluções de Crédito assessora exclusivamente Microempresas (ME) e Empresas de Pequeno Porte (EPP)</strong>. Não prestamos consultoria ou atendimento para a categoria de Microempreendedores Individuais (MEI) nesta linha.
              </p>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Quem Pode Solicitar o Pronampe</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                Para acessar o Pronampe, sua empresa precisa atender aos seguintes requisitos: ser microempresa (faturamento anual de até R$ 360 mil) ou empresa de pequeno porte (faturamento de até R$ 4,8 milhões), estar com CNPJ ativo há pelo menos 1 ano, não possuir restrições graves no CNPJ, e estar em dia com obrigações fiscais e trabalhistas. MEIs também podem solicitar, com limite proporcional ao faturamento.
              </p>
            </div>


            {/* Comparativo de Taxas e Vantagens */}
            <div style={{ margin: '2rem 0', padding: '2rem', backgroundColor: 'var(--neutral-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-border)' }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>PRONAMPE vs Capital de Giro Comum</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--neutral-border)' }}>
                      <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Benefício</th>
                      <th style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>Fomento PRONAMPE</th>
                      <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Giro Tradicional Varejo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Taxa de Juros Máxima</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Selic + 6% ao ano (máx)</td>
                      <td style={{ padding: '0.75rem' }}>Taxas de mercado (muitas vezes superiores a 25% a.a.)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Período de Carência</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Até 12 meses</td>
                      <td style={{ padding: '0.75rem' }}>De 0 a 60 dias máximo</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Exigência de Fiador / Bens</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Mitigada (FGO cobre)</td>
                      <td style={{ padding: '0.75rem' }}>Exigência de avais robustos ou imóveis</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Uso do Capital</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Livre (Investimento e Giro)</td>
                      <td style={{ padding: '0.75rem' }}>Pode exigir vinculações comerciais</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Como funcionam as regras de limite e requisitos do PRONAMPE?</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                Os valores liberados dependem diretamente do comportamento fiscal da empresa. As regras básicas de enquadramento consistem em:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.25rem', color: 'var(--neutral-muted)', lineHeight: '1.6' }}>
                <li><strong>Limite Máximo por Contrato:</strong> O empréstimo é limitado a até <strong>30% da receita bruta anual</strong> declarada à Receita Federal no ano anterior. Por exemplo, uma empresa que registrou faturamento de R$ 1 milhão pode simular uma captação de até R$ 300 mil.</li>
                <li><strong>Empresas Recém-criadas:</strong> Para empresas operando com menos de um ano de atividade, o limite de fomento pode ser estabelecido em até 50% do capital social integralizado ou até 30% da média de faturamento mensal histórico.</li>
                <li><strong>Compromisso de Empregos:</strong> A empresa tomadora assume legalmente o compromisso de manter o número total de empregados registrados em patamar igual ou superior ao do encerramento do ano anterior ao contrato, durante toda a vigência da operação.</li>
                <li><strong>Compartilhamento Tributário (e-CAC):</strong> Para que os bancos parceiros façam a verificação cadastral e liberem a contratação, é obrigatório realizar a autorização de compartilhamento de dados fiscais através do portal e-CAC da Receita Federal.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Passo a passo para obter fomento PRONAMPE com a assessoria da RMJ</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                Contamos com um método direto e ágil de intermediação digital, garantindo resposta rápida nos bancos operantes parceiros:
              </p>
              <ol style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.25rem', color: 'var(--neutral-muted)', lineHeight: '1.6' }}>
                <li><strong>Formulário e Simulação Inicial:</strong> Insira os dados corporativos da sua ME ou EPP no formulário de contato abaixo ou envie diretamente pelo WhatsApp da RMJ.</li>
                <li><strong>Autorização no Portal e-CAC:</strong> Nosso consultor ajuda você a conceder permissão de compartilhamento de informações fiscais à instituição financeira operadora na Receita Federal de forma 100% segura.</li>
                <li><strong>Retorno e Negociação de Taxas:</strong> Analisamos os bancos de fomento com maiores limites pré-aprovados e que ofereçam a melhor modelagem de carência e pagamento para a sua empresa.</li>
                <li><strong>Assinatura Digital e Depósito:</strong> Após a verificação cadastral e formalização eletrônica da operação, o dinheiro é creditado diretamente na conta corrente PJ da sua empresa em poucos dias.</li>
              </ol>
            </div>

            {/* Perguntas Frequentes (FAQs) */}
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>Perguntas Frequentes sobre o PRONAMPE</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Quais tipos de empresas a RMJ atende no Pronampe?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Nós focamos nosso atendimento estritamente em microempresas (com faturamento até R$ 360 mil/ano) e empresas de pequeno porte (com faturamento até R$ 4,8 milhões/ano). Nós não atendemos a categoria MEI.
                  </p>
                </div>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Qual o prazo total para pagar o Pronampe?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    O prazo de pagamento do fomento é de até 48 meses (4 anos) no total. Este período já inclui o prazo de carência contratual escolhido de até 12 meses.
                  </p>
                </div>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Como funciona o compartilhamento no e-CAC?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    O e-CAC é o Centro Virtual de Atendimento da Receita Federal. O empresário deve fazer login com a conta gov.br (nível prata ou ouro) ou certificado digital, acessar a aba de compartilhamento de dados e selecionar o banco parceiro, permitindo que a instituição veja as informações de faturamento do negócio para validar os requisitos legais.
                  </p>
                </div>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>É necessário oferecer bens em garantia física?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Normalmente não. O FGO (Fundo Garantidor de Operações) serve exatamente para prestar essa garantia para os bancos operadores. Apenas em situações específicas pode ser requerida a garantia pessoal do proprietário (aval do sócio majoritário).
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
            <h2>Aproveite a Linha de Crédito PRONAMPE para PMEs</h2>
            <p className={styles.leadText} style={{ color: "var(--neutral-muted)" }}>
              Preencha os dados abaixo e nosso time credenciado analisará a linha de fomento ideal para a sua empresa de forma rápida.
            </p>
          </div>
          <div>
            <LeadForm defaultService="PRONAMPE" />
          </div>
        </div>
      </section>
    </>
  );
}
