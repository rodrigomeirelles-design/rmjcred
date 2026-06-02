import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Financiamento de Veículos — RMJ Soluções de Crédito",
  description: "Simule e financie carros novos, seminovos e veículos comerciais com as melhores taxas do mercado através da RMJ Soluções de Crédito.",
};

export default function FinanciamentoVeiculos() {
  return (
    <>
      {/* 1. Cabeçalho da Página */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <h1 className={styles.title}>
            Financiamento de <span className={styles.italicTitle}>Veículos</span>
          </h1>
          <p className={styles.leadText}>
            Adquira o seu carro novo, seminovo ou utilitário de forma rápida e segura. A RMJ pesquisa e negocia as melhores taxas de financiamento de veículos junto às maiores financeiras do mercado.
          </p>
        </div>
      </section>

      {/* 2. Seção de Inspiração: Slogan & Intermediação (Tabs CSS) */}
      <section className={`${styles.negotiateSection} section`}>
        <div className="container">
          <div className={styles.negotiateHeader}>
            <h2 className={styles.negotiateSlogan}>
              Negocie com quem você conhece. <span className={styles.italicTitle}>Compre com quem você confia.</span>
            </h2>
            <p className={styles.negotiateSubtitle}>
              A RMJ conecta compradores e vendedores particulares, oferecendo toda a assessoria de crédito e a segurança de um contrato formal para a compra e venda de veículos.
            </p>
          </div>

          {/* Estrutura de Abas Pure CSS */}
          <div className={styles.tabsContainer}>
            <input type="radio" id="tab-comprador" name="vehicle-tabs" defaultChecked className={styles.tabRadio} />
            <input type="radio" id="tab-vendedor" name="vehicle-tabs" className={styles.tabRadio} />
            <input type="radio" id="tab-contrato" name="vehicle-tabs" className={styles.tabRadio} />

            <div className={styles.tabHeaders}>
              <label htmlFor="tab-comprador" className={styles.tabLabel}>Quero Comprar</label>
              <label htmlFor="tab-vendedor" className={styles.tabLabel}>Quero Vender</label>
              <label htmlFor="tab-contrato" className={styles.tabLabel}>Refinanciar / Portar</label>
            </div>

            <div className={styles.tabContentWrapper}>
              {/* Conteúdo Comprador */}
              <div className={`${styles.tabContent} ${styles.contentComprador}`}>
                <p className={styles.tabIntro}>
                  Financiamento particular rápido e seguro entre pessoas físicas. Confira todas as vantagens e faça uma simulação agora mesmo.
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <h4>Negociação direta</h4>
                    <p>Facilidade de negociação com uma pessoa física a qualquer momento, sem intermediários comissionados.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                        <line x1="12" y1="4" x2="12" y2="20"></line>
                      </svg>
                    </div>
                    <h4>Pagamento simples</h4>
                    <p>Realizamos o pagamento para o vendedor de forma facilitada, direta e 100% segura após a aprovação.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <h4>Praticidade</h4>
                    <p>Faça a compra do seu veículo de onde quiser de forma rápida e segura, com assessoria contratual digital.</p>
                  </div>
                  <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className={`${styles.advantageCard} ${styles.whatsappCard}`}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <h4>Atendimento no WhatsApp</h4>
                    <p>Você conta com atendimento humano e personalizado direto com o Rodrigo pelo número <strong>(35) 99724-8658</strong>.</p>
                  </a>
                </div>
              </div>

              {/* Conteúdo Vendedor */}
              <div className={`${styles.tabContent} ${styles.contentVendedor}`}>
                <p className={styles.tabIntro}>
                  Venda seu veículo para um particular de forma garantida. A RMJ financia o comprador e paga o valor à vista para você.
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <h4>Garantia de recebimento</h4>
                    <p>Você recebe o valor total da venda do veículo à vista, diretamente na sua conta corrente após a assinatura.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <h4>Segurança contra fraudes</h4>
                    <p>Análise documental completa do comprador e do contrato de financiamento para assegurar que você faça uma venda sem riscos.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <h4>Quitação facilitada</h4>
                    <p>Se o seu veículo ainda possuir parcelas abertas ou saldo devedor, a RMJ cuida de todo o trâmite de quitação e liberação.</p>
                  </div>
                  <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className={`${styles.advantageCard} ${styles.whatsappCard}`}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <h4>Fale com o Consultor</h4>
                    <p>Tire suas dúvidas sobre documentação e processos de venda pelo WhatsApp <strong>(35) 99724-8658</strong>.</p>
                  </a>
                </div>
              </div>

              {/* Conteúdo Já tenho contrato */}
              <div className={`${styles.tabContent} ${styles.contentContrato}`}>
                <p className={styles.tabIntro}>
                  Busque taxas menores ou levante dinheiro em mãos refinanciando seu veículo atual com o suporte consultivo da RMJ.
                </p>
                <div className={styles.advantagesGrid}>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                      </svg>
                    </div>
                    <h4>Redução de parcelas</h4>
                    <p>Trabalhamos na portabilidade ou reestruturação do seu contrato atual buscando taxas de juros mais baixas do mercado.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <h4>Refinanciamento (Troco na troca)</h4>
                    <p>Use seu veículo quitado como garantia para obter dinheiro de forma rápida, mantendo a posse do carro.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="7"></circle>
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                      </svg>
                    </div>
                    <h4>Análise de portabilidade</h4>
                    <p>Avaliamos se o seu financiamento antigo é elegível para portabilidade de taxa nos principais bancos parceiros.</p>
                  </div>
                  <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className={`${styles.advantageCard} ${styles.whatsappCard}`}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <h4>Simule sua Taxa</h4>
                    <p>Envie as condições básicas do seu contrato atual e buscaremos uma opção melhor via WhatsApp <strong>(35) 99724-8658</strong>.</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Conteúdo Detalhado (Benefícios Gerais) */}
      <section className={`${styles.productDetails} section`}>
        <div className={`${styles.detailsGrid} container`}>
          {/* Coluna 1: Nova Imagem Gerada por IA */}
          <div className={styles.imageWrapper}>
            <Image
              src="/assets/car_key_handover.png"
              alt="Entrega de chaves e aperto de mão simbolizando financiamento de veículo seguro na RMJ"
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
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                Condições de Financiamento
              </h3>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Veículos Novos e Usados:</strong> Crédito disponível para carros zero quilômetro e seminovos com até 10 anos de fabricação.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Taxas Competitivas:</strong> Parcerias de grande escala com BV, Santander, Itaú, Bradesco e Safra para buscar a menor taxa para seu score de crédito.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Prazos Flexíveis:</strong> Prazos de pagamento que vão de 12 até 60 meses (5 anos) para amortização.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Financiamento de até 100%:</strong> Possibilidade de financiar o valor total do veículo sem necessidade de entrada, sujeito a análise de perfil.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Agilidade na Aprovação:</strong> Retorno da análise de crédito em poucos minutos, permitindo que você feche o negócio com rapidez.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Consulte Nossos Conteúdos */}
      <section className={`${styles.contentsSection} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Dicas e Guias</span>
            <h2 className={styles.sectionTitle}>Consulte Nossos Conteúdos</h2>
            <p className={styles.sectionDesc}>
              Aprenda mais sobre o mercado de financiamento de veículos e tome a decisão financeira mais inteligente.
            </p>
          </div>

          <div className={styles.contentsGrid}>
            {/* Card 1 */}
            <div className={styles.contentCard}>
              <div className={styles.cardImageWrapper}>
                <Image
                  src="/assets/car_key_handover.png"
                  alt="Financiamento entre particulares"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.cardBody}>
                <h4>Financiamento entre particulares</h4>
                <p>Saiba como funciona a compra e venda de veículos diretamente entre pessoas físicas com o suporte de crédito e a garantia contratual da RMJ.</p>
                <Link href="#simular" className={styles.cardLink}>Saiba mais &rarr;</Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className={styles.contentCard}>
              <div className={styles.cardImageWrapper}>
                <Image
                  src="/assets/happy_family_car.png"
                  alt="Vantagens de financiar veículo particular"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.cardBody}>
                <h4>Vantagens de financiar um veículo particular</h4>
                <p>Descubra as vantagens financeiras e de taxas ao optar por um carro usado direto com o proprietário, fugindo das margens de lucro elevadas das concessionárias.</p>
                <Link href="#simular" className={styles.cardLink}>Saiba mais &rarr;</Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className={styles.contentCard}>
              <div className={styles.cardImageWrapper}>
                <Image
                  src="/assets/new_car_showroom.png"
                  alt="Carros novos ou usados"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.cardBody}>
                <h4>Carros novos ou usados: qual a melhor escolha para o seu bolso?</h4>
                <p>Um guia completo e detalhado para ajudar você a decidir entre a emoção do cheiro de carro novo e a inteligência financeira do melhor custo-benefício de um seminovo.</p>
                <Link href="#simular" className={styles.cardLink}>Saiba mais &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Seção de CTA + Formulário */}
      <section className={`${styles.ctaSection} section`} id="simular">
        <div className={`${styles.ctaContainer} container`}>
          <div className={styles.titleContainer}>
            <span className={styles.backLink} style={{ color: "var(--secondary-color)" }}>Simulação Gratuita</span>
            <h2>Saia de Carro Novo com a Melhor Taxa</h2>
            <p className={styles.leadText} style={{ color: "var(--neutral-muted)" }}>
              Preencha os dados e nosso time buscará nos bancos parceiros a melhor taxa pré-aprovada para você ou sua empresa.
            </p>
          </div>
          <div>
            <LeadForm defaultService="Veículos" />
          </div>
        </div>
      </section>
    </>
  );
}
