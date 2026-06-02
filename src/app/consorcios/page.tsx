import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Consórcios Planejados — RMJ Soluções de Crédito",
  description: "Planeje a compra de imóveis, veículos ou serviços sem pagar juros abusivos. Conheça as cartas de crédito com taxas de administração competitivas da RMJ.",
};

export default function Consorcios() {
  return (
    <>
      {/* Cabeçalho da Página */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <h1 className={styles.title}>Consórcios</h1>
          <p className={styles.leadText}>
            Planejamento inteligente para conquistas sólidas. O consórcio é a melhor alternativa para quem deseja adquirir bens sem pagar taxas de juros, acumulando patrimônio de forma disciplinada.
          </p>
        </div>
      </section>

      {/* Conteúdo Detalhado */}
      <section className={`${styles.productDetails} section`}>
        <div className={`${styles.detailsGrid} container`}>
          {/* Coluna 1: Imagem */}
          <div className={styles.imageWrapper}>
            <Image
              src="/assets/8354789cc4e349318167ee2bb326e75b.jpg"
              alt="Investimento e Planejamento com Consórcios"
              width={600}
              height={450}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
            />
          </div>

          {/* Coluna 2: Informações de Benefícios */}
          <div className={styles.infoWrapper}>
            <div>
              <h3 className={styles.categoryTitle}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.categoryIcon}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
                Vantagens do Consórcio
              </h3>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Zero Juros:</strong> Ao contrário dos financiamentos comuns, o consórcio não cobra juros, cobrando apenas uma pequena taxa de administração diluída nas parcelas.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Cartas de Crédito Diversas:</strong> Grupos estruturados para aquisição de imóveis (residenciais, comerciais, construção, reforma), veículos (carros, motos, pesados, frotas) e serviços.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Liberdade de Escolha:</strong> Ao ser contemplado por sorteio ou lance, você recebe a carta de crédito em dinheiro para comprar o bem onde e de quem preferir, garantindo poder de barganha à vista.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Lances Flexíveis:</strong> Acelere sua contemplação oferecendo lances embutidos (usando parte da própria carta de crédito para pagar o lance), lances fixos ou livres.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Administradoras de Confiança:</strong> Trabalhamos apenas com as maiores e mais consolidadas administradoras do Brasil (Porto Seguro, Rodobens, Caixa, etc.), autorizadas pelo Banco Central.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de CTA + Formulário */}
      <section className={`${styles.ctaSection} section`} id="simular">
        <div className={`${styles.ctaContainer} container`}>
          <div className={styles.titleContainer}>
            <span className={styles.backLink} style={{ color: "var(--secondary-color)" }}>Simulação Gratuita</span>
            <h2>Planeje suas Conquistas com Segurança</h2>
            <p className={styles.leadText}>
              Preencha os dados e nosso time apresentará as melhores opções de grupos, prazos e lances que combinam com seu planejamento.
            </p>
          </div>
          <div>
            <LeadForm defaultService="Consórcios" />
          </div>
        </div>
      </section>
    </>
  );
}
