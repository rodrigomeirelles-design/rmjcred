import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Crédito Pronampe em Itajubá para PMEs e MEI | RMJ",
  description: "Acelere sua empresa com a linha de crédito federal facilitada do Pronampe. Menores taxas garantidas e assessoria consultiva completa da RMJ.",
};

export default function Pronampe() {
  return (
    <>
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <h1 className={styles.title}>
            Fomento <span className={styles.italicTitle}>PRONAMPE</span>
          </h1>
          <p className={styles.leadText}>
            Acelere sua microempresa ou empresa de pequeno porte com a linha de fomento do Programa Nacional de Apoio às Microempresas e Empresas de Pequeno Porte (Pronampe).
          </p>
        </div>
      </section>

      <section className={`${styles.negotiateSection} section`}>
        <div className="container">
          <div className={styles.negotiateHeader}>
            <h2 className={styles.negotiateSlogan}>
              Crédito com Garantia do FGO. <span className={styles.italicTitle}>Para alavancar seu negócio de forma segura.</span>
            </h2>
            <p className={styles.negotiateSubtitle}>
              O Pronampe oferece crédito garantido pelo Fundo Garantidor de Operações (FGO), o que reduz o risco bancário e garante taxas muito menores para o pequeno empresário.
            </p>
          </div>

          <div className={styles.tabsContainer}>
            <input type="radio" id="tab-como-funciona" name="vehicle-tabs" defaultChecked className={styles.tabRadio} />
            <input type="radio" id="tab-taxas" name="vehicle-tabs" className={styles.tabRadio} />
            <input type="radio" id="tab-requisitos" name="vehicle-tabs" className={styles.tabRadio} />

            <div className={styles.tabHeaders}>
              <label htmlFor="tab-como-funciona" className={styles.tabLabel}>Vantagens</label>
              <label htmlFor="tab-taxas" className={styles.tabLabel}>Taxas e Carência</label>
              <label htmlFor="tab-requisitos" className={styles.tabLabel}>Quem pode solicitar</label>
            </div>

            <div className={styles.tabContentWrapper}>
              <div className={`${styles.tabContent} ${styles.contentComprador}`}>
                <p className={styles.tabIntro}>
                  O Pronampe é um dos produtos de fomento empresarial mais procurados devido às facilidades de contratação.
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <h4>Taxa de Juros Limitada</h4>
                    <p>A taxa de juros do Pronampe é limitada por lei a Selic + 6% ao ano, eliminando oscilações abusivas.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <h4>Uso Livre</h4>
                    <p>O capital recebido pode ser direcionado livremente para investimentos em maquinário, reformas, marketing ou folha de pagamento.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <h4>Garantia FGO</h4>
                    <p>O Fundo de Garantia de Operações cobre até 100% da garantia exigida, facilitando para quem não tem imóveis de garantia.</p>
                  </div>
                </div>
              </div>

              <div className={`${styles.tabContent} ${styles.contentVendedor}`}>
                <p className={styles.tabIntro}>
                  Condições de amortização facilitadas para proteger a saúde financeira da sua microempresa.
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
                    <h4>Até 12 Meses de Carência</h4>
                    <p>Comece a quitar as parcelas do fomento apenas depois de 1 ano de assinatura contratual.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                      </svg>
                    </div>
                    <h4>Prazo de 48 Meses</h4>
                    <p>Prazo total de amortização de até 4 anos (48 meses), incluindo o período de carência.</p>
                  </div>
                </div>
              </div>

              <div className={`${styles.tabContent} ${styles.contentContrato}`}>
                <p className={styles.tabIntro}>
                  Sua empresa preenche estes requisitos? Fale conosco para iniciar a estruturação do limite.
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                    </div>
                    <h4>Faturamento elegível</h4>
                    <p>Microempresas (faturamento até R$ 360 mil) e Empresas de Pequeno Porte (faturamento até R$ 4,8 milhões).</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>
                    <h4>Compartilhamento da Receita</h4>
                    <p>A empresa deve autorizar o compartilhamento de dados fiscais (via Portal e-CAC) com as instituições financeiras parceiras.</p>
                  </div>
                  <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className={`${styles.advantageCard} ${styles.whatsappCard}`}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <h4>Dúvidas com o Rodrigo</h4>
                    <p>Saiba como compartilhar seus dados e simular as linhas de crédito federal no WhatsApp <strong>(35) 99724-8658</strong>.</p>
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
              alt="Assessor financeiro da RMJ apresentando as linhas de fomento do Pronampe"
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
                  <span><strong>Empresa nova pode pedir?</strong> Empresas recém-abertas com menos de 1 ano podem solicitar crédito proporcional à projeção ou capital social registrado de forma assistida.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Manutenção de Empregos:</strong> A empresa tomadora do crédito federal assume o compromisso de manter o quadro de funcionários durante o período do contrato.</span>
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
            <h2>Aproveite as Taxas Limitadas do Pronampe</h2>
            <p className={styles.leadText} style={{ color: "var(--neutral-muted)" }}>
              Preencha os dados e receba as simulações e o suporte para o compartilhamento de dados fiscais (Portal e-CAC).
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
