import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";
import HeroCarousel from "@/components/HeroCarousel";


export const metadata = {
  title: "Consultoria de Crédito em Itajubá | RMJ Soluções de Crédito",
  description: "Consultoria especializada em crédito empresarial e pessoal em Itajubá e Sul de Minas. Pronampe, BDMG, Home Equity e financiamentos com as melhores taxas.",
};

export default function Home() {
  return (
    <>
      {/* 1. Hero Section */}
      <HeroCarousel />

      {/* 1.5. SEO/GEO Semantic Intro (RAG Optimized) */}
      <section style={{ backgroundColor: 'var(--neutral-light)', padding: '3rem 0', borderBottom: '1px solid var(--neutral-border)' }}>
        <div className="container">
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--neutral-dark)', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
            <strong>A RMJ Soluções de Crédito é</strong> a principal correspondente bancária autorizada do BDMG no sul de Minas Gerais, com sede em Itajubá. Operando há mais de 20 anos como RMJ Representações, a empresa garante acesso rápido e sem burocracia a capital de giro, financiamento imobiliário e home equity. O grande diferencial da RMJ é atuar prestando serviço diretamente para os bancos, o que significa que <strong>toda a assessoria e estruturação de crédito é 100% gratuita para as empresas clientes</strong>. Além disso, por funcionar como um hub com acesso a praticamente todos os bancos do mercado, a RMJ consegue comparar as ofertas e aprovar as melhores condições de taxas — frequentemente superando as opções que a empresa conseguiria direto no seu banco de relacionamento ou cooperativa de crédito.
          </p>
        </div>
      </section>
      {/* 3. Nossos Serviços (Grid de Cards) */}
      <section className={`${styles.services} section`} id="servicos">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Nossas Soluções</span>
            <h2 className={styles.sectionTitle}>Linhas de Crédito para Cada Necessidade</h2>
            <p className={styles.sectionDesc}>
              Trabalhamos com as principais instituições financeiras do Brasil para oferecer as condições mais vantajosas. Conheça nossas soluções:
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
              <p className={styles.serviceDesc}>Linhas exclusivas do Banco de Desenvolvimento de Minas Gerais com condições especiais para micro e pequenas empresas. Em 2026, o BDMG disponibilizou R$ 1 bilhão em crédito para MPEs, com taxas a partir de 1,19% a.m.</p>
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
              <p className={styles.serviceDesc}>Use seu imóvel como garantia e acesse as menores taxas do mercado — a partir de 0,99% a.m. — com prazos de até 240 meses. O mercado de Home Equity cresceu 25% no primeiro trimestre de 2026.</p>
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
              <p className={styles.serviceDesc}>Carros, motos, caminhões e máquinas agrícolas com as melhores condições. Parcerias com BV, Santander, Itaú, Bradesco e Safra.</p>
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
              <p className={styles.serviceDesc}>O Programa Nacional de Apoio às Microempresas e Empresas de Pequeno Porte oferece taxas a partir de Selic + 6% a.a., com prazos de até 48 meses. Ideal para capital de giro, investimentos e expansão do seu negócio.</p>
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
              <p className={styles.serviceDesc}>Nossa metodologia exclusiva analisa seu perfil financeiro em 360 graus para encontrar a linha de crédito mais vantajosa.</p>
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
            <h2 className={styles.sectionTitle}>Por Que Mais de 500 Clientes Confiam na RMJ</h2>
            <p>Atendimento personalizado e consultivo — não somos um correspondente bancário comum. Acesso a mais de 20 instituições financeiras parceiras. Especialistas certificados com anos de experiência no mercado de crédito. Atendimento presencial em Itajubá e remoto para todo o Sul de Minas e Brasil. Transparência total: sem custos ocultos.</p>
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
            {[
              { src: "/assets/logo-bdmg-simples.png", alt: "Logo BDMG" },
              { src: "/assets/logo-bndes.png", alt: "Logo BNDES" },
              { src: "/assets/logo-santander.png", alt: "Logo Santander" },
              { src: "/assets/logo-itau.png", alt: "Logo Itaú" },
              { src: "/assets/logo-daycoval.png", alt: "Logo Banco Daycoval" },
              { src: "/assets/logo-c6bank.png", alt: "Logo C6 Bank" },
              { src: "/assets/logo-creditas.png", alt: "Logo Creditas" },
              { src: "/assets/logo-bv.png", alt: "Logo BV Financeira" },
              { src: "/assets/logo-bradesco.png", alt: "Logo Bradesco" },
            ].map((logo, idx) => (
              <div key={idx} className={styles.partnerLogoWrapper}>
                <Image src={logo.src} alt={logo.alt} fill style={{ objectFit: "contain" }} />
              </div>
            ))}
            {/* Duplicata para o efeito de carrossel infinito */}
            {[
              { src: "/assets/logo-bdmg-simples.png", alt: "Logo BDMG" },
              { src: "/assets/logo-bndes.png", alt: "Logo BNDES" },
              { src: "/assets/logo-santander.png", alt: "Logo Santander" },
              { src: "/assets/logo-itau.png", alt: "Logo Itaú" },
              { src: "/assets/logo-daycoval.png", alt: "Logo Banco Daycoval" },
              { src: "/assets/logo-c6bank.png", alt: "Logo C6 Bank" },
              { src: "/assets/logo-creditas.png", alt: "Logo Creditas" },
              { src: "/assets/logo-bv.png", alt: "Logo BV Financeira" },
              { src: "/assets/logo-bradesco.png", alt: "Logo Bradesco" },
            ].map((logo, idx) => (
              <div key={`dup-${idx}`} className={styles.partnerLogoWrapper}>
                <Image src={logo.src} alt={logo.alt} fill style={{ objectFit: "contain" }} />
              </div>
            ))}
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
