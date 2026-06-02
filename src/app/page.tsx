import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <>
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={`${styles.heroContainer} container`}>
          <div className={styles.heroContent}>
            <div className={styles.heroPartnerIntegrated}>
              <Image
                src="/assets/logo-bdmg-preto.png"
                alt="Logo Oficial Parceiro BDMG"
                width={150}
                height={92}
                className={styles.heroPartnerLogo}
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <h1 className={styles.heroTitle}>
              Crédito BDMG Inteligente para <span className={styles.heroTitleHighlight}>Pequenos Negócios</span>
            </h1>
            <p className={styles.heroDescription}>
              Tenha acesso a crédito empresarial descomplicado, com os melhores prazos, taxas competitivas e menos burocracia. Potencialize o crescimento do seu negócio sem precisar adquirir produtos casados.
            </p>
            <div className={styles.heroButtons}>
              <Link href="#simular" className="btn btn-primary">
                Simular Crédito Agora
              </Link>
              <Link href="#como-funciona" className="btn btn-outline">
                Como Funciona?
              </Link>
            </div>
          </div>
          <div className={styles.heroRightSpacer}></div>
        </div>
      </section>

      {/* 2. Destaques / Benefícios de Carência */}
      <section className={styles.highlightsBar}>
        <div className={`${styles.highlightsContainer} container`}>
          <div className={styles.highlightItem}>
            <span className={styles.highlightNumber}>12</span>
            <span className={styles.highlightLabel}>Meses de Carência</span>
            <span className={styles.highlightDesc}>Comece a pagar somente após 1 ano</span>
          </div>
          <div className={styles.highlightItem}>
            <span className={styles.highlightNumber}>72</span>
            <span className={styles.highlightLabel}>Meses de Prazo</span>
            <span className={styles.highlightDesc}>Opções flexíveis de amortização e pagamento</span>
          </div>
          <div className={styles.highlightItem}>
            <span className={styles.highlightNumber}>0%</span>
            <span className={styles.highlightLabel}>Venda Casada</span>
            <span className={styles.highlightDesc}>Sem exigência de adesão a cartões ou outros produtos</span>
          </div>
        </div>
      </section>

      {/* 3. Nossos Serviços (Grid de Cards) */}
      <section className={`${styles.services} section`} id="servicos">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Nossas Soluções</span>
            <h2 className={styles.sectionTitle}>Crédito na Medida para Seus Objetivos</h2>
            <p className={styles.sectionDesc}>
              Como um hub financeiro integrado, conectamos você e sua empresa às melhores linhas de crédito em mais de 150 instituições parceiras.
            </p>
          </div>

          <div className="grid grid-3">
            {/* Card 1: BDMG */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>Capital de Giro BDMG</h3>
              <p className={styles.serviceDesc}>
                Crédito empresarial com taxa de fomento subsidiada para faturamento em Minas Gerais. Carência de 12 meses e até 72 meses de prazo.
              </p>
              <Link href="/credito-bdmg" className={styles.serviceLink}>
                Saber Mais &rarr;
              </Link>
            </div>

            {/* Card 2: Imobiliário */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>Crédito Imobiliário</h3>
              <p className={styles.serviceDesc}>
                Compare e financie imóveis residenciais, comerciais ou lotes urbanos. Taxas competitivas com os principais bancos em um só lugar.
              </p>
              <Link href="/credito-imovel" className={styles.serviceLink}>
                Saber Mais &rarr;
              </Link>
            </div>

            {/* Card 3: Home Equity */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8l-4 4h8z"></path>
                  <path d="M12 12v4"></path>
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>Home Equity</h3>
              <p className={styles.serviceDesc}>
                Use seu imóvel quitado ou semi-quitado como garantia e tenha acesso a taxas baixas com prazos de até 20 anos para pagar.
              </p>
              <Link href="/home-equity" className={styles.serviceLink}>
                Saber Mais &rarr;
              </Link>
            </div>

            {/* Card 4: Veículos */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>Financiamento de Veículos</h3>
              <p className={styles.serviceDesc}>
                Conquiste seu carro novo ou seminovo com taxas diferenciadas e parcelas que cabem perfeitamente no orçamento da sua família.
              </p>
              <Link href="/financiamento-veiculos" className={styles.serviceLink}>
                Saber Mais &rarr;
              </Link>
            </div>

            {/* Card 5: Garantia de Veículos */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>Garantia de Veículo</h3>
              <p className={styles.serviceDesc}>
                Use seu veículo (quitado ou financiado) como garantia e tenha acesso a crédito ágil com taxas reduzidas mantendo a posse do bem.
              </p>
              <Link href="/credito-garantia-veiculo" className={styles.serviceLink}>
                Saber Mais &rarr;
              </Link>
            </div>

            {/* Card 6: PRONAMPE */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>Fomento PRONAMPE</h3>
              <p className={styles.serviceDesc}>
                Crédito federal facilitado com taxas controladas e garantia de fundo governamental FGO para micro e pequenas empresas (MPE).
              </p>
              <Link href="/pronampe" className={styles.serviceLink}>
                Saber Mais &rarr;
              </Link>
            </div>

            {/* Card 7: ProCred 360 */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>ProCred 360</h3>
              <p className={styles.serviceDesc}>
                Linha de fomento exclusiva com juros bonificados para microempreendedores individuais (MEI) e empresas com faturamento até R$ 360 mil.
              </p>
              <Link href="/procred-360" className={styles.serviceLink}>
                Saber Mais &rarr;
              </Link>
            </div>

            {/* Card 8: Consórcios */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>Consórcios</h3>
              <p className={styles.serviceDesc}>
                Planeje a aquisição de bens com taxas administrativas reduzidas. Opções inteligentes para quem quer investir a médio e longo prazo.
              </p>
              <Link href="/consorcios" className={styles.serviceLink}>
                Saber Mais &rarr;
              </Link>
            </div>

            {/* Card 6: Outros Serviços */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>Outros Serviços</h3>
              <p className={styles.serviceDesc}>
                Soluções customizadas como empréstimo consignado, antecipação de recebíveis, cartões corporativos e assessoria de caixa.
              </p>
              <Link href="/nossos-parceiros" className={styles.serviceLink}>
                Conhecer Parceiros &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Como Funciona (Passo a Passo) */}
      <section className={`${styles.howItWorks} section`} id="como-funciona">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Transparência</span>
            <h2 className={styles.sectionTitle}>Como Funciona a Contratação?</h2>
            <p className={styles.sectionDesc}>
              Passo a passo simples, rápido e transparente para aprovação do seu crédito BDMG.
            </p>
          </div>

          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>Solicitação e Autorização</h4>
                <p className={styles.stepDesc}>
                  Preencha o formulário abaixo para registrar seus dados e faça a autorização de consulta de crédito recebida por e-mail.
                </p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>Análise Rápida de Crédito</h4>
                <p className={styles.stepDesc}>
                  Em poucas horas analisamos sua linha e você já conhece a taxa de juros aproximada, parcelas e o limite pré-aprovado.
                </p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>Estruturação da Proposta</h4>
                <p className={styles.stepDesc}>
                  Entramos em contato para coletar documentos adicionais da empresa e dos sócios e finalizar o preenchimento oficial da proposta.
                </p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>Assinatura do Contrato</h4>
                <p className={styles.stepDesc}>
                  Orientamos todo o processo de assinatura do contrato e envio seguro da documentação final de fechamento.
                </p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.stepNumber}>5</div>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>Recurso Liberado</h4>
                <p className={styles.stepDesc}>
                  Pronto! Após a validação das assinaturas, o dinheiro é depositado diretamente na conta corrente da sua empresa em até 5 dias úteis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Para que serve o Crédito (Necessidades) */}
      <section className={`${styles.needs} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Objetivo</span>
            <h2 className={styles.sectionTitle}>Potencialize a Saúde do seu Negócio</h2>
            <p className={styles.sectionDesc}>
              O crédito estruturado e planejado serve como ferramenta de alavancagem para diversas necessidades empresariais.
            </p>
          </div>

          <div className={`${styles.needsList} grid grid-3`}>
            <div className={styles.needItem}>
              <span className={styles.needCheck}>✓</span>
              <span className={styles.needText}>Expandir o seu negócio</span>
            </div>
            <div className={styles.needItem}>
              <span className={styles.needCheck}>✓</span>
              <span className={styles.needText}>Equilibrar fluxo de caixa</span>
            </div>
            <div className={styles.needItem}>
              <span className={styles.needCheck}>✓</span>
              <span className={styles.needText}>Comprar equipamentos</span>
            </div>
            <div className={styles.needItem}>
              <span className={styles.needCheck}>✓</span>
              <span className={styles.needText}>Reorganizar e unificar dívidas</span>
            </div>
            <div className={styles.needItem}>
              <span className={styles.needCheck}>✓</span>
              <span className={styles.needText}>Acessar taxas subsidiadas diferenciadas</span>
            </div>
            <div className={styles.needItem}>
              <span className={styles.needCheck}>✓</span>
              <span className={styles.needText}>Adquirir insumos e estoques</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Simulador / Captação de Leads */}
      <section className={`${styles.simulator} section`} id="simular">
        <div className={`${styles.simulatorContainer} container`}>
          <div className={styles.simulatorInfo}>
            <span className={styles.sectionSubtitle}>Simulador Grátis</span>
            <h2 className={styles.sectionTitle}>Diga Adeus às Taxas Abusivas</h2>
            <p className={styles.heroDescription}>
              A RMJ Soluções de Crédito faz toda a intermediação, análise e consultoria. Nós estruturamos sua pasta e buscamos as melhores oportunidades de captação de recursos governamentais ou de instituições privadas.
            </p>
            <div className={styles.infoCard}>
              <h4>Atendimento Humano</h4>
              <p>Trabalhamos com transparência e clareza, desmistificando o processo de contratação e garantindo suporte total do início ao fim.</p>
            </div>
            <div className={styles.infoCard}>
              <h4>Diagnóstico Gratuito</h4>
              <p>Nossa primeira análise de perfil de crédito e fluxo de caixa não tem custo algum para sua empresa.</p>
            </div>
          </div>
          <div>
            <LeadForm defaultService="BDMG" />
          </div>
        </div>
      </section>

      {/* 6.5. Avaliações de Clientes (Depoimentos) */}
      <section className={`${styles.testimonials} section`} id="avaliacoes">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Depoimentos</span>
            <h2 className={styles.sectionTitle}>O que Nossos Clientes Dizem</h2>
            <p className={styles.sectionDesc}>
              A satisfação dos nossos clientes é o nosso maior indicador de sucesso. Confira avaliações reais de empresas e parceiros locais.
            </p>
          </div>

          <div className={styles.testimonialsGrid}>
            {/* Depoimento 1 */}
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={styles.starIcon} viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <div className={styles.googleBadge}>
                  <svg className={styles.googleIcon} viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
              </div>
              <p className={styles.testimonialText}>
                "O Rodrigo me atendeu de forma espetacular. Conseguimos a liberação do capital de giro do BDMG com taxas muito abaixo do mercado tradicional. Processo ágil e transparente. Recomendo fortemente a RMJ!"
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>MS</div>
                <div>
                  <h4 className={styles.authorName}>Marcos Silva</h4>
                  <span className={styles.authorTitle}>Microempresário, Itajubá - MG</span>
                </div>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={styles.starIcon} viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <div className={styles.googleBadge}>
                  <svg className={styles.googleIcon} viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
              </div>
              <p className={styles.testimonialText}>
                "Profissionais técnicos e de extrema confiança. Fizeram todo o diagnóstico do nosso caixa e indicaram a melhor linha de fomento para a nossa expansão comercial. Excelente trabalho consultivo."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>AC</div>
                <div>
                  <h4 className={styles.authorName}>Ana Paula Costa</h4>
                  <span className={styles.authorTitle}>Comerciante, Pouso Alegre - MG</span>
                </div>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={styles.starIcon} viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <div className={styles.googleBadge}>
                  <svg className={styles.googleIcon} viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
              </div>
              <p className={styles.testimonialText}>
                "Processo de contratação super transparente e humanizado. A Jô traduz todas as burocracias para nós e nos acompanha de perto em todas as etapas, desde a simulação até a liberação do dinheiro na conta."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>CS</div>
                <div>
                  <h4 className={styles.authorName}>Carlos A. Souza</h4>
                  <span className={styles.authorTitle}>Produtor Local, Itajubá - MG</span>
                </div>
              </div>
            </div>

            {/* Depoimento 4 */}
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={styles.starIcon} viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <div className={styles.googleBadge}>
                  <svg className={styles.googleIcon} viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
              </div>
              <p className={styles.testimonialText}>
                "Fiz o financiamento do meu veículo utilitário com a RMJ e a agilidade foi impressionante. Em poucas horas a proposta foi aprovada junto ao banco parceiro com parcelas que se encaixam no meu orçamento."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>JM</div>
                <div>
                  <h4 className={styles.authorName}>Juliana Mendes</h4>
                  <span className={styles.authorTitle}>Profissional Liberal, Itajubá - MG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Nossos Parceiros (Carrossel / Logomarcas) */}
      <section className={`${styles.partners} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Instituições</span>
            <h2 className={styles.sectionTitle}>Com Quem Trabalhamos</h2>
            <p className={styles.sectionDesc}>
              Temos conexões integradas com os principais bancos e fintechs do país para garantir que você sempre receba a melhor taxa possível.
            </p>
          </div>

          <div className={styles.partnersGrid}>
            <div className={styles.partnerLogoWrapper}>
              <Image
                src="/assets/logo-bdmg-simples.png"
                alt="Logo BDMG"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={styles.partnerLogoWrapper}>
              <Image
                src="/assets/logo-bndes.png"
                alt="Logo BNDES"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={styles.partnerLogoWrapper}>
              <Image
                src="/assets/logo-santander.png"
                alt="Logo Santander"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={styles.partnerLogoWrapper}>
              <Image
                src="/assets/logo-itau.png"
                alt="Logo Itaú"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={styles.partnerLogoWrapper}>
              <Image
                src="/assets/logo-daycoval.png"
                alt="Logo Banco Daycoval"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={styles.partnerLogoWrapper}>
              <Image
                src="/assets/logo-c6bank.png"
                alt="Logo C6 Bank"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={styles.partnerLogoWrapper}>
              <Image
                src="/assets/logo-creditas.png"
                alt="Logo Creditas"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={styles.partnerLogoWrapper}>
              <Image
                src="/assets/logo-bv.png"
                alt="Logo BV Financeira"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={styles.partnerLogoWrapper}>
              <Image
                src="/assets/logo-bradesco.png"
                alt="Logo Bradesco"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          
          <div className={styles.partnersCTA}>
            <Link href="/nossos-parceiros" className="btn btn-outline">
              Ver Todos os Parceiros
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
