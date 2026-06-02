import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export const metadata = {
  title: "Sobre Nós — RMJ Soluções de Crédito",
  description: "Conheça a RMJ Soluções de Crédito, nosso time liderado por Rodrigo Meirelles e Jô, e nossa expertise de 20 anos em fomento comercial e hub de crédito.",
};

export default function SobreNos() {
  return (
    <>
      {/* Cabeçalho */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <h1 className={styles.title}>Sobre a RMJ</h1>
          <p className={styles.leadText}>
            Expertise de ponta e atendimento consultivo humanizado para transformar o crédito em uma ferramenta real de alavancagem, segurança e crescimento.
          </p>
        </div>
      </section>

      {/* História da Empresa */}
      <section className={`${styles.historySection} section`}>
        <div className={`${styles.historyGrid} container`}>
          {/* Coluna 1: Texto */}
          <div className={styles.historyContent}>
            <h2>Propósito Estratégico</h2>
            <p>
              A RMJ Soluções de Crédito nasceu para potencializar empresas que buscam estruturação de capital de giro e captação de investimentos via linhas de desenvolvimento subsidiadas pelo governo, com foco especial nos recursos de fomento do <strong>BDMG</strong> (Banco de Desenvolvimento de Minas Gerais) e do <strong>BNDES</strong> (Banco Nacional de Desenvolvimento Econômico e Social).
            </p>
            <p>
              A atuação da RMJ transcende a simples intermediação bancária. Entregamos um diagnóstico técnico e estratégico completo do caixa do cliente, alinhando prazos, carências e objetivos à realidade de cada negócio, garantindo que o crédito atue como um acelerador e não um gargalo.
            </p>
            <p>
              Com o tempo, nos consolidamos também como um hub financeiro integrado multimarcas. Por meio de parcerias estratégicas com mais de 150 bancos e instituições financeiras privadas, oferecemos soluções completas sob medida em crédito imobiliário, home equity, consórcios e veículos, garantindo taxas competitivas para o empresário e sua família.
            </p>
          </div>

          {/* Coluna 2: Imagem */}
          <div className={styles.imageWrapper}>
            <Image
              src="/assets/rodrigo_jo_event.jpg"
              alt="Rodrigo e Jô em evento estratégico da RMJ Soluções de Crédito"
              width={600}
              height={400}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </section>

      {/* Os Fundadores */}
      <section className={`${styles.foundersSection} section`}>
        <div className="container">
          <h2 className={styles.foundersTitle}>Liderança e Compromisso</h2>
          
          <div className={styles.foundersGrid}>
            {/* Fundador 1: Rodrigo */}
            <div className={styles.founderCard}>
              <div className={styles.founderImageWrapper}>
                <Image
                  src="/assets/rodrigo_portrait_real.png"
                  alt="Foto do sócio-fundador Rodrigo Meirelles"
                  fill
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                />
              </div>
              <div className={styles.founderInfo}>
                <h3 className={styles.founderName}>Rodrigo Meirelles</h3>
                <span className={styles.founderRole}>Sócio-Fundador &amp; Diretor de Crédito</span>
                <p className={styles.founderBio}>
                  Soma mais de 20 anos de expertise em grandes instituições bancárias e de fomento do país, com profundo domínio em análise de risco, fluxo de caixa e estruturação de operações financeiras complexas para empresas de diversos portes.
                </p>
              </div>
            </div>

            {/* Fundador 2: Jô */}
            <div className={styles.founderCard}>
              <div className={styles.founderImageWrapper}>
                <Image
                  src="/assets/jo_portrait_real.png"
                  alt="Foto da sócia-fundadora Jô"
                  fill
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                />
              </div>
              <div className={styles.founderInfo}>
                <h3 className={styles.founderName}>Jô</h3>
                <span className={styles.founderRole}>Sócia-Fundadora &amp; Diretora Comercial</span>
                <p className={styles.founderBio}>
                  Lidera a força comercial e o relacionamento humanizado da RMJ. Traduz toda a complexidade técnica e burocracia bancária para a linguagem simples do cliente, garantindo um acompanhamento próximo e transparente desde a consulta até a liberação do recurso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className={`${styles.valuesSection} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Diferenciais</span>
            <h2 className={styles.sectionTitle}>Nossos Princípios Fundamentais</h2>
            <p className={styles.sectionDesc}>
              A forma como conduzimos nossos serviços reflete nosso compromisso ético e técnico com o sucesso de nossos clientes.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <div className={styles.valueIconContainer}>
                <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.valueIconSvg}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h4 className={styles.valueTitle}>Atendimento Humanizado</h4>
              <p className={styles.valueDesc}>
                Acreditamos que por trás de cada CNPJ existem pessoas e sonhos. Ouvimos suas reais necessidades para oferecer a melhor estrutura de crédito.
              </p>
            </div>

            <div className={styles.valueItem}>
              <div className={styles.valueIconContainer}>
                <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.valueIconSvg}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h4 className={styles.valueTitle}>Transparência Absoluta</h4>
              <p className={styles.valueDesc}>
                Sem pegadinhas ou entrelinhas. Explicamos detalhadamente o Custo Efetivo Total (CET), indexadores e parcelas antes de qualquer fechamento.
              </p>
            </div>

            <div className={styles.valueItem}>
              <div className={styles.valueIconContainer}>
                <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.valueIconSvg}>
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
              <h4 className={styles.valueTitle}>Isenção Comercial</h4>
              <p className={styles.valueDesc}>
                Como hub multimarcas, analisamos os bancos parceiros de forma neutra, recomendando apenas a opção que for financeiramente mais vantajosa para o cliente.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
