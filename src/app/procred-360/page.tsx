import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "ProCred 360 em Itajubá: Crédito para Microempresas | RMJ",
  description: "Linha de crédito exclusiva para microempresas com faturamento anual de até R$ 360 mil. Taxas especiais e fomento à inovação com a parceria RMJ.",
};

export default function Procred360() {
  return (
    <>
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <h1 className={styles.title}>
            Fomento <span className={styles.italicTitle}>ProCred 360</span>
          </h1>
          <p className={styles.leadText}>
            A linha de crédito ideal com juros bonificados focada no fomento, crescimento e consolidação de Microempresas brasileiras.
          </p>
        </div>
      </section>

      <section className={`${styles.negotiateSection} section`}>
        <div className="container">
          <div className={styles.negotiateHeader}>
            <h2 className={styles.negotiateSlogan}>
              Taxas exclusivas para Microempresas. <span className={styles.italicTitle}>Para alavancar seu comércio ou prestação de serviços.</span>
            </h2>
            <p className={styles.negotiateSubtitle}>
              O programa ProCred 360 faz parte do programa federal de fomento financeiro e oferece taxas muito mais suaves para as empresas de menor porte crescerem com folga de caixa.
            </p>
          </div>

          <div className={styles.tabsContainer}>
            <input type="radio" id="tab-como-funciona" name="vehicle-tabs" defaultChecked className={styles.tabRadio} />
            <input type="radio" id="tab-taxas" name="vehicle-tabs" className={styles.tabRadio} />
            <input type="radio" id="tab-requisitos" name="vehicle-tabs" className={styles.tabRadio} />

            <div className={styles.tabHeaders}>
              <label htmlFor="tab-como-funciona" className={styles.tabLabel}>Benefícios</label>
              <label htmlFor="tab-taxas" className={styles.tabLabel}>Taxas e Carência</label>
              <label htmlFor="tab-requisitos" className={styles.tabLabel}>Quem pode pedir</label>
            </div>

            <div className={styles.tabContentWrapper}>
              <div className={`${styles.tabContent} ${styles.contentComprador}`}>
                <p className={styles.tabIntro}>
                  O ProCred 360 foi desenhado para facilitar a inserção financeira dos microempresários no mercado.
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <h4>Taxa Bonificada</h4>
                    <p>O ProCred 360 tem juros limitados a taxa Selic + apenas 5% ao ano, barateando as parcelas.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <h4>Crédito Produtivo</h4>
                    <p>Linha desenhada de forma simples, focada no fluxo de caixa ou investimento em equipamentos.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                    </div>
                    <h4>Bancos conveniados</h4>
                    <p>Operamos a aprovação junto ao Banco do Brasil e Caixa Econômica Federal de forma assistida.</p>
                  </div>
                </div>
              </div>

              <div className={`${styles.tabContent} ${styles.contentVendedor}`}>
                <p className={styles.tabIntro}>
                  Excelente carência e prazos flexíveis para dar estabilidade às pequenas operações de caixa.
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <h4>Período de Carência</h4>
                    <p>Com prazos flexíveis de carência para iniciar o pagamento conforme a sazonalidade e fluxo de caixa.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                      </svg>
                    </div>
                    <h4>Prazos Estendidos</h4>
                    <p>Pagamento dividido em planos que facilitam a sustentação e evitam o estrangulamento financeiro do caixa.</p>
                  </div>
                </div>
              </div>

              <div className={`${styles.tabContent} ${styles.contentContrato}`}>
                <p className={styles.tabIntro}>
                  Esta linha é desenhada de forma dedicada para as empresas de menor porte.
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <h4>Limite de Faturamento</h4>
                    <p>Microempresas com receita bruta anual registrada de até R$ 360 mil.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2H6a2 2 0 0 0-2 2v16"></path>
                      </svg>
                    </div>
                    <h4>Empresas Sem Dívidas Ativas</h4>
                    <p>Necessário apresentar situação fiscal ativa e regularizada junto aos órgãos de arrecadação do governo.</p>
                  </div>
                  <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className={`${styles.advantageCard} ${styles.whatsappCard}`}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <h4>Dúvidas com o Consultor</h4>
                    <p>Consulte se sua empresa é elegível para o ProCred 360 conversando no WhatsApp com o Rodrigo no <strong>(35) 99724-8658</strong>.</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.productDetails} section`}>
        <div className={`${styles.detailsGrid} container`}>
          <div className={styles.imageWrapper}>
            <Image
              src="/assets/sobre_nos_workspace.png"
              alt="Assessor financeiro da RMJ apresentando as linhas de fomento ProCred 360"
              width={600}
              height={450}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
            />
          </div>

          <div className={styles.infoWrapper}>
            <div>
              <h3 className={styles.categoryTitle}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.categoryIcon}>
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                Perguntas Frequentes
              </h3>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Há tarifas adicionais de abertura?</strong> A contratação do ProCred 360 conta com tarifas controladas por regulamentação federal, mitigando custos surpresas.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Selic + 5% ao ano:</strong> Trata-se de uma taxa com bonificação de fomento governamental muito competitiva.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.ctaSection} section`} id="simular">
        <div className={`${styles.ctaContainer} container`}>
          <div className={styles.titleContainer}>
            <span className={styles.backLink} style={{ color: "var(--secondary-color)" }}>Simulação Gratuita</span>
            <h2>Fomente sua Microempresa</h2>
            <p className={styles.leadText} style={{ color: "var(--neutral-muted)" }}>
              Preencha os dados e nosso time buscará nos bancos parceiros a liberação do ProCred 360 para sua operação.
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
