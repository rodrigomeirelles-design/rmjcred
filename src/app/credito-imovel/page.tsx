import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Financiamento Imobiliário e Lotes em Itajubá | RMJ",
  description: "Compre seu imóvel comercial, residencial ou lote com a menor taxa de juros. Simulamos e aprovamos seu crédito imobiliário rapidamente nos maiores bancos.",
};

export default function CreditoImovel() {
  return (
    <>
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <h1 className={styles.title}>
            Crédito <span className={styles.italicTitle}>Imobiliário</span>
          </h1>
          <p className={styles.leadText}>
            Simule e financie imóveis residenciais, comerciais ou lotes urbanos com agilidade. A RMJ pesquisa e negocia as melhores taxas nos maiores bancos do país em um só lugar.
          </p>
        </div>
      </section>

      <section className={`${styles.negotiateSection} section`}>
        <div className="container">
          <div className={styles.negotiateHeader}>
            <h2 className={styles.negotiateSlogan}>
              A chave do seu imóvel. <span className={styles.italicTitle}>Sem pagar taxas abusivas.</span>
            </h2>
            <p className={styles.negotiateSubtitle}>
              Seja para adquirir a casa própria, expandir a sede da sua empresa ou comprar um lote para construção, a RMJ oferece assessoria completa da simulação até a entrega das chaves.
            </p>
          </div>

          <div className={styles.tabsContainer}>
            <input type="radio" id="tab-como-funciona" name="vehicle-tabs" defaultChecked className={styles.tabRadio} />
            <input type="radio" id="tab-bancos" name="vehicle-tabs" className={styles.tabRadio} />
            <input type="radio" id="tab-vantagens" name="vehicle-tabs" className={styles.tabRadio} />

            <div className={styles.tabHeaders}>
              <label htmlFor="tab-como-funciona" className={styles.tabLabel}>Modalidades</label>
              <label htmlFor="tab-bancos" className={styles.tabLabel}>Bancos Parceiros</label>
              <label htmlFor="tab-vantagens" className={styles.tabLabel}>Vantagens RMJ</label>
            </div>

            <div className={styles.tabContentWrapper}>
              <div className={`${styles.tabContent} ${styles.contentComprador}`}>
                <p className={styles.tabIntro}>
                  Oferecemos diversas opções de linhas de crédito imobiliário sob medida para o seu perfil e momento de compra.
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      </svg>
                    </div>
                    <h4>Imóvel Residencial</h4>
                    <p>Financie até 80% do valor de avaliação de casas ou apartamentos novos e usados de forma simplificada.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                    </div>
                    <h4>Imóvel Comercial</h4>
                    <p>Linhas dedicadas para adquirir salas comerciais, galpões e escritórios para a sua própria sede de negócios.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <h4>Lotes e Construção</h4>
                    <p>Crédito estruturado para quem quer comprar o terreno e financiar também o orçamento da obra em parcelas controladas.</p>
                  </div>
                </div>
              </div>

              <div className={`${styles.tabContent} ${styles.contentVendedor}`}>
                <p className={styles.tabIntro}>
                  Fazemos uma varredura completa nos principais players de crédito imobiliário do mercado para encontrar sua aprovação.
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    </div>
                    <h4>Principais Bancos</h4>
                    <p>Simulamos em tempo real na Caixa, Itaú, Bradesco, Santander e Banco do Brasil para comparar taxas efetivas.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                    </div>
                    <h4>Modelos de Amortização</h4>
                    <p>Compare com clareza as vantagens da Tabela SAC (parcelas decrescentes) versus Tabela PRICE (parcelas fixas).</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <h4>Uso do FGTS</h4>
                    <p>Orientamos o resgate e o direcionamento correto do saldo de FGTS para abater a entrada ou amortizar as parcelas.</p>
                  </div>
                </div>
              </div>

              <div className={`${styles.tabContent} ${styles.contentContrato}`}>
                <p className={styles.tabIntro}>
                  Toda a facilidade de uma assessoria independente e focada na sua economia financeira.
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <h4>Assessoria Descomplicada</h4>
                    <p>Sem reuniões burocráticas em agências. Coletamos e organizamos sua pasta documental de forma 100% digital.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </div>
                    <h4>Sem Custo Extra</h4>
                    <p>A intermediação imobiliária e simulação prestada pela RMJ não acarreta nenhuma taxa adicional para o comprador.</p>
                  </div>
                  <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className={`${styles.advantageCard} ${styles.whatsappCard}`}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <h4>Fale com o Consultor</h4>
                    <p>Envie sua simulação ou tire dúvidas sobre a compra do imóvel no WhatsApp com o Rodrigo: <strong>(35) 99724-8658</strong>.</p>
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
              src="/assets/real_estate_handover.png"
              alt="Assinatura de financiamento imobiliário e entrega de chaves da casa nova"
              width={600}
              height={450}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
            />
          </div>

          <div className={styles.infoWrapper}>
            <div>
              <h3 className={styles.categoryTitle}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.categoryIcon}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                Regras de Aprovação
              </h3>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Comprometimento de Renda:</strong> O valor das parcelas mensais do financiamento imobiliário não pode comprometer mais que 30% da renda comprovada.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Análise Cadastral:</strong> Liberação sujeita a score de crédito saudável e sem restrições ativas no CPF ou CNPJ.</span>
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
            <h2>Conquiste seu Imóvel com Segurança</h2>
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
