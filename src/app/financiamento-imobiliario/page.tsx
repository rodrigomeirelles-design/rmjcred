import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Financiamento Imobiliário — RMJ Soluções de Crédito",
  description: "Compare taxas de juros de diversos bancos e consiga o melhor financiamento para imóveis residenciais, comerciais ou terrenos com a RMJ.",
};

export default function FinanciamentoImobiliario() {
  return (
    <>
      {/* Cabeçalho da Página */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <h1 className={styles.title}>Financiamento Imobiliário</h1>
          <p className={styles.leadText}>
            Na RMJ, você não fica preso a uma única proposta. Nós comparamos e analisamos as condições de financiamento imobiliário de vários bancos em um só lugar. Economize tempo, reduza custos e garanta o melhor negócio.
          </p>
        </div>
      </section>

      {/* Conteúdo Detalhado */}
      <section className={`${styles.productDetails} section`}>
        <div className={`${styles.detailsGrid} container`}>
          {/* Coluna 1: Imagem */}
          <div className={styles.imageWrapper}>
            <Image
              src="/assets/real_estate_handover.png"
              alt="Financiamento Imobiliário e Conquista da Casa Própria"
              width={600}
              height={800}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
            />
          </div>

          {/* Coluna 2: Informações de Categorias */}
          <div className={styles.infoWrapper}>
            {/* Categoria 1: Residencial */}
            <div className={styles.category}>
              <h3 className={styles.categoryTitle}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.categoryIcon}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Imóveis Residenciais
              </h3>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Taxas Competitivas:</strong> A partir de 11,99% a.a. + TR (Taxa Referencial).</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Financiamento Amplo:</strong> Financie até 80% do valor de avaliação do imóvel.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Longo Prazo:</strong> Até 420 meses (35 anos) para pagar.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Amortização Flexível:</strong> Opções via tabela SAC (parcelas decrescentes) ou tabela PRICE (parcelas fixas).</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Valores Mínimos:</strong> Imóvel com valor a partir de R$ 90.000,00 e financiamento mínimo de R$ 60.000,00.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Composição de Renda:</strong> Possibilidade de compor renda com cônjuges, familiares ou sócios.</span>
                </li>
              </ul>
            </div>

            {/* Categoria 2: Comercial */}
            <div className={styles.category}>
              <h3 className={styles.categoryTitle}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.categoryIcon}>
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                  <line x1="9" y1="22" x2="9" y2="16"></line>
                  <line x1="15" y1="22" x2="15" y2="16"></line>
                  <line x1="9" y1="16" x2="15" y2="16"></line>
                  <path d="M8 6h.01"></path>
                  <path d="M16 6h.01"></path>
                  <path d="M8 10h.01"></path>
                  <path d="M16 10h.01"></path>
                </svg>
                Imóveis Comerciais
              </h3>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Financiamento:</strong> Financie até 70% do valor do imóvel comercial.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Prazo de Pagamento:</strong> Prazos de 12 até 240 meses (20 anos).</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Flexibilidade:</strong> Sistemas de amortização SAC e tabela PRICE disponíveis.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Limites:</strong> Imóvel com valor a partir de R$ 90.000,00 e financiamento mínimo de R$ 60.000,00.</span>
                </li>
              </ul>
            </div>

            {/* Categoria 3: Lotes e Terrenos */}
            <div className={styles.category}>
              <h3 className={styles.categoryTitle}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.categoryIcon}>
                  <line x1="6" y1="3" x2="6" y2="21"></line>
                  <line x1="18" y1="3" x2="18" y2="21"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                Lotes e Terrenos Urbanos
              </h3>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Taxas Especiais:</strong> Taxa de juros a partir de 16% a.a.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Financiamento de Terreno:</strong> Financie até 70% do valor do lote urbano.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Prazo Estendido:</strong> Prazos flexíveis de até 240 meses.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Exclusividade:</strong> Operação estruturada em parceria com o Banco Bradesco.</span>
                </li>
              </ul>
            </div>

            {/* Aviso Importante */}
            <div className={styles.infoBox}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.infoBoxIcon}>
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                <line x1="9" y1="18" x2="15" y2="18"></line>
                <line x1="10" y1="22" x2="14" y2="22"></line>
              </svg>
              <strong>Dica RMJ:</strong> Em todas as modalidades acima, você tem a opção de embutir o valor dos impostos municipais (ITBI) e dos custos cartorários diretamente nas parcelas do financiamento, reduzindo seu desembolso inicial!
            </div>
          </div>
        </div>
      </section>

      {/* Seção de CTA + Formulário */}
      <section className={`${styles.ctaSection} section`} id="simular">
        <div className={`${styles.ctaContainer} container`}>
          <div className={styles.titleContainer}>
            <span className={styles.backLink} style={{ color: "var(--secondary-color)" }}>Simulação Gratuita</span>
            <h2>Pronto para Dar o Próximo Passo?</h2>
            <p className={styles.leadText}>
              Preencha o formulário e nosso time fará o levantamento das taxas de juros de mercado e retornará com um comparativo de viabilidade detalhado.
            </p>
          </div>
          <div>
            <LeadForm defaultService="Crédito Imobiliário" />
          </div>
        </div>
      </section>
    </>
  );
}
