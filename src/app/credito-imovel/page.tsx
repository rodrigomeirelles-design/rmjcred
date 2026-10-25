import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Crédito Imobiliário em Itajubá e Sul de Minas | RMJ Soluções de Crédito",
  description: "A melhor opção de crédito imobiliário para você e sua empresa em Itajubá e Sul de Minas. Simule agora com a RMJ Soluções de Crédito.",
  alternates: {
    canonical: "https://rmjcred.com.br/credito-imovel",
  },
  openGraph: {
    title: "Crédito Imobiliário em Itajubá e Sul de Minas | RMJ Soluções de Crédito",
    description: "A melhor opção de crédito imobiliário para você e sua empresa em Itajubá e Sul de Minas. Simule agora com a RMJ Soluções de Crédito.",
    url: "https://rmjcred.com.br/credito-imovel",
    siteName: "RMJ Soluções de Crédito",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-rmj.jpg",
        width: 1200,
        height: 630,
        alt: "Crédito Imobiliário em Itajubá e Sul de Minas | RMJ Soluções de Crédito",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crédito Imobiliário em Itajubá e Sul de Minas | RMJ Soluções de Crédito",
    description: "A melhor opção de crédito imobiliário para você e sua empresa em Itajubá e Sul de Minas. Simule agora com a RMJ Soluções de Crédito.",
    images: ["/og-rmj.jpg"],
  },
};

export default function CreditoImovel() {
  return (
    <>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Crédito Imobiliário",
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
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
            <ol style={{ display: 'flex', listStyle: 'none', gap: '0.5rem', padding: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
              <li><Link href="/" style={{ color: 'inherit' }}>Início</Link></li>
              <li>/</li>
              <li style={{ color: '#fff' }}>Crédito Imobiliário</li>
            </ol>
          </nav>
          <h1 className={styles.title}>
            Crédito e Financiamento <span className={styles.italicTitle}>Imobiliário</span> em Itajubá
          </h1>
          <p className={styles.leadText}>
            Adquira seu imóvel residencial, comercial ou lote com a assessoria independente da RMJ. Pesquisamos e aprovamos a menor taxa de juros em todos os grandes bancos nacionais.
          </p>
        </div>
      </section>

      {/* 2. Conteúdo Principal Denso */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-white)' }}>
        <div className="container page-grid">
          
          {/* Coluna do Artigo de Conteúdo */}
          <article style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Como a RMJ acelera sua aprovação de Crédito Imobiliário?</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                Comprar um imóvel é uma das decisões mais importantes da vida de uma pessoa ou do planejamento estratégico de expansão de uma empresa. No entanto, lidar diretamente com gerentes de bancos em busca das melhores taxas de juros é cansativo, demorado e muitas vezes resulta em taxas de juros inflacionadas e imposições de seguros e vendas casadas.
              </p>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                A <strong>RMJ Soluções de Crédito</strong> funciona como uma assessoria imobiliária independente. Conectamos seu perfil de renda com mais de 150 instituições financeiras e simulamos simultaneamente nos maiores bancos nacionais — como Caixa Econômica Federal, Itaú, Bradesco, Santander e Banco do Brasil. Cuidamos de todo o processo documental digital para você do início até a assinatura da escritura.
              </p>
            </div>

            {/* Comparativo de Sistemas de Amortização com Imagem Lateral */}
            <div className="comparison-card">
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>SAC vs Price: Escolha o Modelo Ideal</h3>
              <div className={styles.sacPriceSplit}>
                <div className={styles.sacPriceImageBox}>
                  <Image
                    src="/assets/blog/blog_sac_price_v2.png"
                    alt="Casal planejando financiamento imobiliário e comparando tabelas SAC e Price na mesa de casa"
                    width={500}
                    height={500}
                    loading="lazy"
                    className={styles.squareImage}
                  />
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--neutral-border)' }}>
                        <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Característica</th>
                        <th style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>Tabela SAC (Sistema de Amortização Constante)</th>
                        <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Tabela PRICE (Sistema Francês)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                        <td style={{ padding: '0.75rem' }}><strong>Comportamento das Parcelas</strong></td>
                        <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Decrescentes (iniciam maiores e diminuem)</td>
                        <td style={{ padding: '0.75rem' }}>Constantes (fixas do início ao fim)</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                        <td style={{ padding: '0.75rem' }}><strong>Amortização do Saldo Devedor</strong></td>
                        <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Rápida desde o início do financiamento</td>
                        <td style={{ padding: '0.75rem' }}>Lenta nos primeiros anos</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                        <td style={{ padding: '0.75rem' }}><strong>Custo Total de Juros</strong></td>
                        <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Menor custo financeiro total de juros acumulados</td>
                        <td style={{ padding: '0.75rem' }}>Maior custo de juros ao fim do prazo</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                        <td style={{ padding: '0.75rem' }}><strong>Recomendação</strong></td>
                        <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Para quem busca economia a longo prazo</td>
                        <td style={{ padding: '0.75rem' }}>Para quem precisa de parcelas iniciais menores</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modalidades de Crédito Imobiliário com Imagens nos Cards */}
            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Modalidades de Crédito Imobiliário Atendidas</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                Seja qual for o seu objetivo de aquisição, possuímos linhas de fomento adequadas para cada cenário:
              </p>
              <div className={styles.modalidadesGrid}>
                <div className={styles.modalidadeCard}>
                  <div className={styles.modalidadeImageWrap}>
                    <Image
                      src="/assets/ci_tipo_residencial.jpg"
                      alt="Fachada de casa residencial brasileira moderna com jardim"
                      fill
                      loading="lazy"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.modalidadeCardBody}>
                    <strong>Financiamento Residencial:</strong> Compra de casas ou apartamentos novos ou usados com a possibilidade de financiar até 80% do valor avaliado do imóvel.
                  </div>
                </div>

                <div className={styles.modalidadeCard}>
                  <div className={styles.modalidadeImageWrap}>
                    <Image
                      src="/assets/ci_tipo_comercial.jpg"
                      alt="Fachada de sala comercial e clínica moderna com vidro e madeira"
                      fill
                      loading="lazy"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.modalidadeCardBody}>
                    <strong>Imóvel Comercial:</strong> Crédito dedicado a profissionais liberais, médicos, advogados e comerciantes para aquisição de escritórios, consultórios ou galpões comerciais.
                  </div>
                </div>

                <div className={styles.modalidadeCard}>
                  <div className={styles.modalidadeImageWrap}>
                    <Image
                      src="/assets/ci_tipo_lotes.jpg"
                      alt="Vista de loteamento residencial e condomínio fechado no Sul de Minas"
                      fill
                      loading="lazy"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.modalidadeCardBody}>
                    <strong>Lotes e Terrenos Urbanos:</strong> Financiamento do lote desejado em loteamentos ou condomínios fechados, inclusive com planos associados para financiamento da construção.
                  </div>
                </div>

                <div className={styles.modalidadeCard}>
                  <div className={styles.modalidadeImageWrap}>
                    <Image
                      src="/assets/ci_tipo_planta.jpg"
                      alt="Edifício residencial moderno em construção e uso do FGTS"
                      fill
                      loading="lazy"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.modalidadeCardBody}>
                    <strong>Uso do FGTS:</strong> Suporte completo para utilização de saldos de FGTS para amortizar parcelas, quitar contratos ou compor o valor exigido de entrada.
                  </div>
                </div>
              </div>
            </div>

            {/* Passo a Passo da Aprovação com Imagem Lateral */}
            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>Passo a Passo da Aprovação do Imóvel</h2>
              <div className={styles.processoSplit}>
                <div className={styles.processoImageBox}>
                  <Image
                    src="/assets/ci_processo_sala.jpg"
                    alt="Interior de casa brasileira moderna e aconchegante com sofá, violão e escada contemporânea"
                    width={600}
                    height={750}
                    loading="lazy"
                    className={styles.processoImage}
                  />
                </div>
                <div>
                  <ol style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.25rem', color: 'var(--neutral-muted)', lineHeight: '1.6', margin: 0 }}>
                    <li><strong>Simulação Comparada:</strong> Enviamos uma estimativa detalhada das parcelas e taxas comparadas dos maiores bancos com base na sua renda familiar.</li>
                    <li><strong>Aprovação de Crédito:</strong> Submetemos a pasta digital com seus documentos aos bancos escolhidos para aprovação de carta de crédito.</li>
                    <li><strong>Avaliação do Imóvel:</strong> Um engenheiro credenciado pelo banco faz a vistoria física e laudo do imóvel pretendido.</li>
                    <li><strong>Escritura e Liberação:</strong> Com a documentação validada jurídica e fisicamente, o contrato é emitido para assinatura e registro em cartório, efetuando o pagamento ao vendedor.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>Perguntas Frequentes sobre Crédito Imobiliário</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Qual o valor de entrada mínimo exigido no financiamento imobiliário?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Em geral, os bancos financiam até o limite máximo de 80% do valor avaliado do imóvel. Logo, é exigido um valor de entrada de ao menos 20% do valor do bem. Este valor de entrada pode ser composto utilizando o saldo total do seu FGTS, caso preencha os requisitos do SFH.
                  </p>
                </div>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Como compor renda familiar para aprovação do crédito?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    É possível somar a renda de cônjuges, parceiros em união estável, pais, filhos e, em algumas instituições parceiras, até mesmo de terceiros sem grau de parentesco para aumentar o limite máximo aprovado de crédito.
                  </p>
                </div>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>O que é o Custo Efetivo Total (CET)?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    O CET é a taxa real consolidada que você pagará. Ele engloba não apenas a taxa de juros nominal do financiamento, mas todas as taxas de administração bancária mensal, seguros de morte ou invalidez permanente (MIP) e danos físicos ao imóvel (DFI), além de impostos (IOF). Nós sempre focamos em reduzir o CET final.
                  </p>
                </div>
              </div>
            </div>

          </article>

          {/* Barra Lateral */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--neutral-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-border)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Serviços Relacionados</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link href="/home-equity" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Home Equity (Garantia) &rarr;</Link></li>
                <li><Link href="/consorcios" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Consórcios Imobiliários &rarr;</Link></li>
                <li><Link href="/credito-bdmg" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Capital de Giro BDMG &rarr;</Link></li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'var(--primary-dark)', color: '#fff', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>Simule Conosco</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                Consulte as taxas e simule em todos os bancos do mercado pelo WhatsApp com o Rodrigo.
              </p>
              <a href="https://wa.me/5535991084513" target="_blank" rel="noopener noreferrer" className="btn btn-accent" style={{ width: '100%', fontSize: '0.9rem' }}>
                Chamar no WhatsApp
              </a>
            </div>
          </aside>

        </div>
      </section>

      {/* Seção de Artigos do Blog ("Saiba Mais") */}
      <section className={`${styles.contentsSection} section`}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2rem", color: "var(--primary-dark)", fontWeight: 800, marginBottom: "0.5rem" }}>
              Saiba Mais sobre Financiamento Imobiliário
            </h2>
            <p style={{ color: "var(--neutral-muted)", fontSize: "1.05rem", margin: 0 }}>
              Artigos do nosso blog para você planejar a conquista do seu imóvel com segurança.
            </p>
          </div>

          <div className={styles.contentsGrid}>
            <Link href="/blog/diferenca-sac-price-financiamento-imobiliario" className={styles.contentCard} style={{ textDecoration: "none", color: "inherit" }}>
              <div className={styles.cardImageWrapper}>
                <Image
                  src="/assets/blog/blog_sac_price_v2.png"
                  alt="Tabela SAC ou Tabela Price no financiamento imobiliário"
                  fill
                  loading="lazy"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.cardBody}>
                <h4>Tabela SAC ou Tabela Price: Qual a Melhor Opção?</h4>
                <p>Compare os sistemas de amortização de parcelas decrescentes e fixas para o seu orçamento.</p>
                <span className={styles.cardLink}>Leia mais &rarr;</span>
              </div>
            </Link>

            <Link href="/blog/usar-fgts-no-financiamento-imobiliario" className={styles.contentCard} style={{ textDecoration: "none", color: "inherit" }}>
              <div className={styles.cardImageWrapper}>
                <Image
                  src="/assets/blog/blog_fgts_imovel_v2.jpg"
                  alt="Como usar o FGTS no financiamento de imóveis com chaves de casa sobre a mesa"
                  fill
                  loading="lazy"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.cardBody}>
                <h4>Como Usar o FGTS no Financiamento de Imóveis</h4>
                <p>Transforme o saldo do seu Fundo de Garantia na entrada da casa própria ou reduza suas parcelas.</p>
                <span className={styles.cardLink}>Leia mais &rarr;</span>
              </div>
            </Link>

            <Link href="/blog/passo-a-passo-comprar-imovel-financiado" className={styles.contentCard} style={{ textDecoration: "none", color: "inherit" }}>
              <div className={styles.cardImageWrapper}>
                <Image
                  src="/assets/blog/blog_passo_imovel_v2.jpg"
                  alt="Família realizando o sonho da casa própria financiada com segurança"
                  fill
                  loading="lazy"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.cardBody}>
                <h4>Passo a Passo para Comprar seu Imóvel Financiado</h4>
                <p>Entenda todas as fases da aquisição habitacional, da simulação até o registro no Cartório.</p>
                <span className={styles.cardLink}>Leia mais &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Seção de Simulação */}
      <section className={`${styles.ctaSection} section`} id="simular">
        <div className={`${styles.ctaContainer} container`}>
          <div className={styles.titleContainer}>
            <span className={styles.backLink} style={{ color: "var(--secondary-color)" }}>Simulação Gratuita</span>
            <h2>Compre seu Imóvel com a Menor Taxa de Juros</h2>
            <p className={styles.leadText} style={{ color: "var(--neutral-muted)" }}>
              Preencha os dados e receba as simulações comparadas com as menores taxas do mercado imobiliário.
            </p>
          </div>
          <div>
            <LeadForm defaultService="Imobiliário" />
          </div>
        </div>
      </section>
    </>
  );
}

