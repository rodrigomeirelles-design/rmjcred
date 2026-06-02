import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Crédito com Garantia de Veículo — RMJ Soluções de Crédito",
  description: "Use seu carro ou utilitário como garantia e tenha acesso a crédito rápido com taxas baixas. Dinheiro liberado de maneira ágil, com o veículo financiado ou não.",
};

export default function CreditoGarantiaVeiculo() {
  return (
    <>
      {/* 1. Cabeçalho da Página */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <h1 className={styles.title}>
            Crédito com Garantia de <span className={styles.italicTitle}>Veículo</span>
          </h1>
          <p className={styles.leadText}>
            Use seu veículo quitado ou financiado como garantia para obter dinheiro em mãos de forma rápida, mantendo a posse e o uso do carro. A RMJ garante taxas baixas e prazos flexíveis.
          </p>
        </div>
      </section>

      {/* 2. Benefícios Principais (Tabs CSS Adaptadas) */}
      <section className={`${styles.negotiateSection} section`}>
        <div className="container">
          <div className={styles.negotiateHeader}>
            <h2 className={styles.negotiateSlogan}>
              Dinheiro rápido no bolso. <span className={styles.italicTitle}>Sem precisar vender seu carro.</span>
            </h2>
            <p className={styles.negotiateSubtitle}>
              O Refinanciamento de Veículos (Auto Equity) é um produto excelente e de liberação ágil, ideal para quem precisa de liquidez imediata com as menores taxas do mercado.
            </p>
          </div>

          <div className={styles.tabsContainer}>
            <input type="radio" id="tab-como-funciona" name="vehicle-tabs" defaultChecked className={styles.tabRadio} />
            <input type="radio" id="tab-requisitos" name="vehicle-tabs" className={styles.tabRadio} />
            <input type="radio" id="tab-vantagens" name="vehicle-tabs" className={styles.tabRadio} />

            <div className={styles.tabHeaders}>
              <label htmlFor="tab-como-funciona" className={styles.tabLabel}>Como Funciona</label>
              <label htmlFor="tab-requisitos" className={styles.tabLabel}>Veículo Financiado</label>
              <label htmlFor="tab-vantagens" className={styles.tabLabel}>Vantagens RMJ</label>
            </div>

            <div className={styles.tabContentWrapper}>
              {/* Como Funciona */}
              <div className={`${styles.tabContent} ${styles.contentComprador}`}>
                <p className={styles.tabIntro}>
                  O processo é simples e totalmente digital. Você continua dirigindo seu veículo normalmente enquanto utiliza o crédito.
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <h4>Avaliação digital</h4>
                    <p>Fazemos a pré-avaliação do seu veículo com base na tabela FIPE de forma rápida através dos canais de atendimento digital.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <h4>Crédito de até 90%</h4>
                    <p>Obtenha em dinheiro até 90% do valor de avaliação do seu veículo, com depósito rápido direto em sua conta corrente.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                    </div>
                    <h4>Sem burocracia</h4>
                    <p>Assessoria completa da RMJ para lidar com todos os trâmites do gravame e liberação contratual digital.</p>
                  </div>
                  <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className={`${styles.advantageCard} ${styles.whatsappCard}`}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <h4>Atendimento no WhatsApp</h4>
                    <p>Faça uma simulação imediata do seu veículo com o Rodrigo pelo número <strong>(35) 99724-8658</strong>.</p>
                  </a>
                </div>
              </div>

              {/* Veículo Financiado */}
              <div className={`${styles.tabContent} ${styles.contentVendedor}`}>
                <p className={styles.tabIntro}>
                  O seu veículo atual ainda possui parcelas abertas? Nós também conseguimos fazer a operação de forma simples.
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <h4>Quitação do saldo devedor</h4>
                    <p>Parte do novo valor de crédito aprovado é utilizado para quitar o financiamento atual, e o troco é depositado à vista para você.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                      </svg>
                    </div>
                    <h4>Troco na Troca de Dívida</h4>
                    <p>Muitas vezes, a nova taxa de juros da garantia é menor que a do seu financiamento atual, gerando economia mensal.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>
                    <h4>Intermediação Completa</h4>
                    <p>Nós lidamos com o banco atual do seu financiamento para obter o boleto de quitação, sem dor de cabeça para você.</p>
                  </div>
                  <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className={`${styles.advantageCard} ${styles.whatsappCard}`}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <h4>Fale com o Consultor</h4>
                    <p>Tire suas dúvidas sobre refinanciamento de carros com parcelas em aberto pelo WhatsApp <strong>(35) 99724-8658</strong>.</p>
                  </a>
                </div>
              </div>

              {/* Vantagens RMJ */}
              <div className={`${styles.tabContent} ${styles.contentContrato}`}>
                <p className={styles.tabIntro}>
                  Por que contratar seu Crédito com Garantia de Veículo através da assessoria da RMJ Soluções de Crédito?
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="7"></circle>
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                      </svg>
                    </div>
                    <h4>Melhores Bancos do País</h4>
                    <p>Parcerias com Itaú, BV, Santander, Creditas, Safra e Bradesco para garantir que você tenha a melhor proposta de juros.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <h4>Dinheiro sem Destinação</h4>
                    <p>Diferente de um financiamento tradicional, você pode usar o dinheiro da garantia para o que quiser: quitar dívidas, viajar, reformar ou investir.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                    </div>
                    <h4>Taxas muito mais baixas</h4>
                    <p>Por oferecer o veículo como garantia, as taxas de juros são drasticamente menores do que empréstimo pessoal ou cartão de crédito.</p>
                  </div>
                  <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className={`${styles.advantageCard} ${styles.whatsappCard}`}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <h4>Simule sua Taxa</h4>
                    <p>Envie os dados do seu veículo e encontre a melhor proposta de crédito por WhatsApp: <strong>(35) 99724-8658</strong>.</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Condições Detalhadas */}
      <section className={`${styles.productDetails} section`}>
        <div className={`${styles.detailsGrid} container`}>
          <div className={styles.imageWrapper}>
            <Image
              src="/assets/car_key_handover.png"
              alt="Entrega de chaves simbolizando crédito rápido com garantia de veículo na RMJ"
              width={600}
              height={450}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
            />
          </div>

          <div className={styles.infoWrapper}>
            <div>
              <h3 className={styles.categoryTitle}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.categoryIcon}>
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                Condições de Contratação
              </h3>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Veículos Elegíveis:</strong> Carros de passeio e utilitários leves com até 15 anos de fabricação em perfeito estado.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Liberação ágil:</strong> Todo o processo de vistoria e emissão do contrato é digital, agilizando o depósito do recurso.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Prazos Flexíveis:</strong> Planos de pagamento flexíveis que variam de 12 até 60 meses.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Manutenção de Posse:</strong> O veículo é alienado ao banco parceiro como garantia, mas você continua com o direito total de uso do bem.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Seção de CTA + Formulário */}
      <section className={`${styles.ctaSection} section`} id="simular">
        <div className={`${styles.ctaContainer} container`}>
          <div className={styles.titleContainer}>
            <span className={styles.backLink} style={{ color: "var(--secondary-color)" }}>Simulação Gratuita</span>
            <h2>Transforme seu Veículo em Capital de Giro</h2>
            <p className={styles.leadText} style={{ color: "var(--neutral-muted)" }}>
              Preencha os dados e nosso time buscará nos bancos parceiros a melhor taxa de refinanciamento para seu perfil.
            </p>
          </div>
          <div>
            <LeadForm defaultService="Garantia de Veículo" />
          </div>
        </div>
      </section>
    </>
  );
}
