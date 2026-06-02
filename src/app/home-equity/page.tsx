import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Home Equity — RMJ Soluções de Crédito",
  description: "Faça um empréstimo com garantia de imóvel com taxas a partir de 1,09% a.m. + IPCA. Prazos de até 20 anos e carência de até 90 dias.",
};

export default function HomeEquity() {
  return (
    <>
      {/* Cabeçalho da Página */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <h1 className={styles.title}>Home Equity</h1>
          <p className={styles.leadText}>
            O crédito com garantia de imóvel (Home Equity) é a modalidade ideal para quem precisa de capital de forma planejada, com taxas substancialmente menores que as de empréstimos convencionais e prazos estendidos.
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
              alt="Uso de imóvel como garantia de crédito estruturado (Home Equity)"
              width={600}
              height={600}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
            />
          </div>

          {/* Coluna 2: Informações de Benefícios */}
          <div className={styles.infoWrapper}>
            <div>
              <h3 className={styles.categoryTitle}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.categoryIcon}>
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                </svg>
                Vantagens do Home Equity
              </h3>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>O imóvel continua sendo seu:</strong> Você mantém o direito de propriedade total do imóvel, podendo residir nele, alugar ou utilizá-lo para suas atividades comerciais normalmente durante toda a vigência do contrato.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Prazos Estendidos:</strong> Até 240 meses (20 anos) para amortização, permitindo parcelas menores que se ajustam confortavelmente no orçamento.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Altos Limites de Crédito:</strong> Captações de R$ 50.000,00 até R$ 3.000,000,00 de acordo com a avaliação do bem.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Carência Confortável:</strong> Prazo de carência de até 90 dias (3 meses) para começar a pagar a primeira parcela.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Refinanciamento de Imóvel Financiado:</strong> Se pelo menos 50% do seu imóvel já estiver quitado, a RMJ assume o saldo devedor restante junto ao outro banco e libera o saldo devedor restante como dinheiro na sua conta!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tabela Comparativa de Taxas */}
      <section className={`${styles.comparisonSection} section`}>
        <div className="container">
          <h2 className={styles.comparisonTitle}>Comparativo Visual de Taxas de Juros</h2>
          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>Modalidade de Crédito</th>
                <th>Taxa de Juros Média</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.rowHighlight}>
                <td>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline-block' }}>
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                  </svg>
                  Home Equity (RMJ Crédito)
                </td>
                <td>A partir de 1,09% a.m. *</td>
              </tr>
              <tr>
                <td>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline-block' }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Empréstimo Pessoal
                </td>
                <td>Cerca de 8,00% a.m.</td>
              </tr>
              <tr>
                <td>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline-block' }}>
                    <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                  Cheque Especial
                </td>
                <td>Cerca de 6,10% a.m.</td>
              </tr>
            </tbody>
          </table>
          <p className={styles.noteText}>
            * Taxa indexada a partir de 1,09% a.m. + IPCA. Sujeito à análise cadastral e avaliação de garantia. Fonte das taxas médias comparativas: Banco Central do Brasil (Novembro/2025).
          </p>
        </div>
      </section>

      {/* Seção de CTA + Formulário */}
      <section className={`${styles.ctaSection} section`} id="simular">
        <div className={`${styles.ctaContainer} container`}>
          <div className={styles.titleContainer}>
            <span className={styles.backLink} style={{ color: "var(--secondary-color)" }}>Simulação Gratuita</span>
            <h2>Seu imóvel te garante mais dinheiro na conta</h2>
            <p className={styles.leadText}>
              Preencha os dados abaixo. Nós analisaremos as condições de avaliação do seu imóvel e apresentaremos o plano ideal.
            </p>
          </div>
          <div>
            <LeadForm defaultService="Home Equity" />
          </div>
        </div>
      </section>
    </>
  );
}
