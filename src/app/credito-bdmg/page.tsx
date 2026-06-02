import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Crédito BDMG em Itajubá com 12 Meses de Carência | RMJ",
  description: "Impulsione sua empresa com a menor taxa do mercado. Crédito de fomento BDMG em Itajubá e região com até 72 meses de prazo e sem venda casada.",
};

export default function CreditoBdmg() {
  return (
    <>
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <h1 className={styles.title}>
            Capital de Giro <span className={styles.italicTitle}>BDMG</span>
          </h1>
          <p className={styles.leadText}>
            Tenha acesso a crédito empresarial descomplicado, com os melhores prazos, taxas competitivas e menos burocracia. Potencialize o crescimento do seu negócio sem precisar adquirir produtos casados.
          </p>
        </div>
      </section>

      <section className={`${styles.negotiateSection} section`}>
        <div className="container">
          <div className={styles.negotiateHeader}>
            <h2 className={styles.negotiateSlogan}>
              Fomento Financeiro de Verdade. <span className={styles.italicTitle}>Para sua empresa crescer sem travas.</span>
            </h2>
            <p className={styles.negotiateSubtitle}>
              O Banco de Desenvolvimento de Minas Gerais (BDMG) oferece linhas de crédito subsidiadas ideais para micro e pequenas empresas organizarem e alavancarem suas operações.
            </p>
          </div>

          <div className={styles.tabsContainer}>
            <input type="radio" id="tab-como-funciona" name="vehicle-tabs" defaultChecked className={styles.tabRadio} />
            <input type="radio" id="tab-prazos" name="vehicle-tabs" className={styles.tabRadio} />
            <input type="radio" id="tab-requisitos" name="vehicle-tabs" className={styles.tabRadio} />

            <div className={styles.tabHeaders}>
              <label htmlFor="tab-como-funciona" className={styles.tabLabel}>Como Funciona</label>
              <label htmlFor="tab-prazos" className={styles.tabLabel}>Carência e Prazos</label>
              <label htmlFor="tab-requisitos" className={styles.tabLabel}>Quem pode pedir</label>
            </div>

            <div className={styles.tabContentWrapper}>
              <div className={`${styles.tabContent} ${styles.contentComprador}`}>
                <p className={styles.tabIntro}>
                  Análise rápida e liberação simplificada. Como correspondentes credenciados do BDMG, cuidamos de toda a estruturação contratual digital.
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <h4>Liberação em até 5 dias</h4>
                    <p>Após aprovação do limite e assinatura do contrato digital, o dinheiro cai na conta PJ em até 5 dias úteis.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <h4>Taxa de fomento barata</h4>
                    <p>Juros anuais subsidiados e muito abaixo da média de bancos comerciais, focando no desenvolvimento regional.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                      </svg>
                    </div>
                    <h4>Sem venda casada</h4>
                    <p>Garantia de 0% de cobrança de produtos adicionais, seguros, cartões ou taxas escondidas para liberar o crédito.</p>
                  </div>
                  <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className={`${styles.advantageCard} ${styles.whatsappCard}`}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <h4>Simulação via WhatsApp</h4>
                    <p>Envie o CNPJ da sua empresa e consulte o limite disponível com o Rodrigo no <strong>(35) 99724-8658</strong>.</p>
                  </a>
                </div>
              </div>

              <div className={`${styles.tabContent} ${styles.contentVendedor}`}>
                <p className={styles.tabIntro}>
                  O crédito BDMG oferece a melhor estrutura de amortização e prazos para micro e pequenas empresas.
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
                    <h4>12 Meses de Carência</h4>
                    <p>Faça a contratação e comece a pagar a primeira parcela do financiamento somente após 1 ano.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                      </svg>
                    </div>
                    <h4>72 Meses de Prazo</h4>
                    <p>O prazo máximo total para pagar a linha de capital de giro chega a até 72 meses (6 anos de pagamento).</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>
                    <h4>Sem tarifas ocultas</h4>
                    <p>Todas as parcelas e encargos de IOF são declarados de forma aberta e transparente na emissão do contrato.</p>
                  </div>
                </div>
              </div>

              <div className={`${styles.tabContent} ${styles.contentContrato}`}>
                <p className={styles.tabIntro}>
                  Empresas formalizadas em Minas Gerais possuem acesso a essas taxas especiais de fomento financeiro.
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <h4>Micro e Pequenas Empresas (MPE)</h4>
                    <p>Empresas mineiras com faturamento fiscal bruto de até R$ 4,8 milhões de faturamento por ano.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <h4>Empresas Regulares</h4>
                    <p>Necessário apresentar situação cadastral regularizada e certidões negativas de débito federal e estadual ativas.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                    </div>
                    <h4>Setores Atendidos</h4>
                    <p>Linhas disponíveis para comércio, indústrias, empresas de prestação de serviços diversos e inovação tecnológica.</p>
                  </div>
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
              alt="Reunião de negócios com foco em crédito empresarial BDMG"
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
                  <span><strong>O que é carência?</strong> É o período em que a empresa não amortiza o saldo devedor principal do empréstimo BDMG, pagando apenas os juros mínimos mensais ou acumulando.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Quitação Antecipada:</strong> O contrato permite amortizações ou quitação total a qualquer momento com redução integral dos juros de forma simples.</span>
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
            <h2>Impulsione o Caixa da sua Empresa</h2>
            <p className={styles.leadText} style={{ color: "var(--neutral-muted)" }}>
              Preencha os dados e nosso time credenciado do BDMG buscará a melhor linha de fomento pré-aprovada para sua empresa.
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
