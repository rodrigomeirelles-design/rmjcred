import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";
import {
  Percent,
  CalendarClock,
  Car,
  BadgeDollarSign,
  FileCheck2,
  UserCheck,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

export const metadata = {
  title: "Crédito com Garantia de Veículo (Auto Equity) | RMJ Soluções de Crédito",
  description: "Crédito com garantia de veículo (Auto Equity) — libere até 90% da Tabela FIPE com taxas baixas, até 60 meses para pagar e continue usando seu carro. Simule grátis com a RMJ.",
  alternates: {
    canonical: "https://rmjcred.com.br/credito-garantia-veiculo",
  },
  openGraph: {
    title: "Crédito com Garantia de Veículo (Auto Equity) | RMJ Soluções de Crédito",
    description: "Crédito com garantia de veículo (Auto Equity) — libere até 90% da Tabela FIPE com taxas baixas, até 60 meses para pagar e continue usando seu carro. Simule grátis com a RMJ.",
    url: "https://rmjcred.com.br/credito-garantia-veiculo",
    siteName: "RMJ Soluções de Crédito",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-rmj.jpg",
        width: 1200,
        height: 630,
        alt: "Crédito com Garantia de Veículo (Auto Equity) | RMJ Soluções de Crédito",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crédito com Garantia de Veículo (Auto Equity) | RMJ Soluções de Crédito",
    description: "Crédito com garantia de veículo (Auto Equity) — libere até 90% da Tabela FIPE com taxas baixas, até 60 meses para pagar e continue usando seu carro. Simule grátis com a RMJ.",
    images: ["/og-rmj.jpg"],
  },
};

export default function CreditoGarantiaVeiculo() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "O veículo oferecido em garantia precisa estar quitado?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Não necessariamente. O ideal é que o veículo esteja quitado, mas se ainda houver parcelas em aberto, estruturamos a operação onde parte do novo crédito quita o saldo devedor atual e a diferença (o troco) é depositada à vista na sua conta."
                }
              },
              {
                "@type": "Question",
                "name": "Eu continuo usando meu veículo normalmente durante o contrato?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sim, 100%. O veículo fica apenas alienado fiduciariamente no documento (gravame) ao banco parceiro como garantia da operação, mas a posse e o uso diário do carro permanecem integralmente com você."
                }
              },
              {
                "@type": "Question",
                "name": "Quais veículos são aceitos como garantia?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "São aceitos carros de passeio e utilitários leves com até 15 anos de fabricação, em bom estado de conservação e sem histórico de sinistro grave (perda total) ou bloqueios judiciais."
                }
              },
              {
                "@type": "Question",
                "name": "Qual o valor mínimo e máximo do Crédito com Garantia de Veículo?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Você pode obter até 90% do valor do seu veículo na Tabela FIPE, dependendo do ano de fabricação, perfil de crédito e instituição escolhida. A RMJ simula em diversos bancos parceiros para buscar o maior limite com a menor taxa."
                }
              },
              {
                "@type": "Question",
                "name": "Quanto tempo leva para o dinheiro cair na conta?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "O Crédito com Garantia de Veículo é uma das linhas mais rápidas do mercado. Como a vistoria e a assinatura do contrato são 100% digitais, a liberação do recurso costuma ocorrer entre 24 e 72 horas úteis após a aprovação."
                }
              },
              {
                "@type": "Question",
                "name": "Posso contratar o Crédito com Garantia de Veículo mesmo com restrições no nome?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Depende da instituição financeira parceira. Algumas instituições analisam propostas com apontamentos leves, desde que o veículo atenda aos critérios de garantia e haja capacidade de pagamento comprovada. Fale com a RMJ para uma análise individual."
                }
              },
              {
                "@type": "Question",
                "name": "Empresas (PJ) também podem usar veículos como garantia?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sim. Empresários podem usar veículos registrados em nome da pessoa física (sócio) ou da própria empresa (CNPJ) para levantar capital de giro rápido, organizar o fluxo de caixa ou investir no negócio com taxas reduzidas."
                }
              }
            ]
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Crédito com Garantia de Veículo",
            "provider": {
              "@id": "https://rmjcred.com.br/#organizacao"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Brasil"
            }
          })
        }}
      />

      {/* 1. Cabeçalho da Página */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
            <ol style={{ display: "flex", listStyle: "none", gap: "0.5rem", padding: 0, fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>
              <li><Link href="/" style={{ color: "inherit" }}>Início</Link></li>
              <li>/</li>
              <li style={{ color: "#fff" }}>Crédito com Garantia de Veículo</li>
            </ol>
          </nav>
          <h1 className={styles.title}>
            Crédito com Garantia de <span className={styles.italicTitle}>Veículo</span>: Dinheiro Rápido com as Menores Taxas
          </h1>
          <div className={styles.leadText}>
            <p style={{ marginBottom: "1rem" }}>
              Use seu veículo quitado ou financiado como garantia para obter até 90% do valor da Tabela FIPE direto na sua conta, mantendo a posse e o uso normal do carro no dia a dia.
            </p>
            <p>
              Na RMJ Soluções de Crédito, comparamos as condições dos maiores bancos e fintechs do país — BV, Santander, Itaú, Creditas, Safra e Bradesco — em um processo 100% digital, rápido e sem burocracia.
            </p>
          </div>
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
            <input type="radio" id="tab-comprador" name="vehicle-tabs" defaultChecked className={styles.tabRadio} />
            <input type="radio" id="tab-vendedor" name="vehicle-tabs" className={styles.tabRadio} />
            <input type="radio" id="tab-contrato" name="vehicle-tabs" className={styles.tabRadio} />

            <div className={styles.tabHeaders}>
              <label htmlFor="tab-comprador" className={styles.tabLabel}>Como Funciona</label>
              <label htmlFor="tab-vendedor" className={styles.tabLabel}>Veículo Financiado</label>
              <label htmlFor="tab-contrato" className={styles.tabLabel}>Vantagens RMJ</label>
            </div>

            <div className={styles.tabContentWrapper}>
              {/* Como Funciona */}
              <div className={`${styles.tabContent} contentComprador`}>
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
                  <a href="https://wa.me/5535991084513" target="_blank" rel="noopener noreferrer" className={`${styles.advantageCard} ${styles.whatsappCard}`}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <h4>Atendimento no WhatsApp</h4>
                    <p>Faça uma simulação imediata do seu veículo com o Rodrigo pelo número <strong>(35) 99108-4513</strong>.</p>
                  </a>
                </div>
              </div>

              {/* Veículo Financiado */}
              <div className={`${styles.tabContent} contentVendedor`}>
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
                  <a href="https://wa.me/5535991084513" target="_blank" rel="noopener noreferrer" className={`${styles.advantageCard} ${styles.whatsappCard}`}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <h4>Fale com o Consultor</h4>
                    <p>Tire suas dúvidas sobre refinanciamento de carros com parcelas em aberto pelo WhatsApp <strong>(35) 99108-4513</strong>.</p>
                  </a>
                </div>
              </div>

              {/* Vantagens RMJ */}
              <div className={`${styles.tabContent} contentContrato`}>
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
                    <h4>Melhores Bancos do Mercado</h4>
                    <p>Parcerias com as principais instituições do país (Itaú, BV, Santander, Creditas, Safra e Bradesco) para garantir que você tenha sempre a melhor proposta e a menor taxa de juros.</p>
                  </div>
                  <div className={styles.advantageCard}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <h4>20 Anos de Experiência</h4>
                    <p>Mais de duas décadas de expertise no mercado de crédito de veículos. A RMJ garante total segurança, transparência e agilidade na aprovação da sua operação.</p>
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
                  <a href="https://wa.me/5535991084513" target="_blank" rel="noopener noreferrer" className={`${styles.advantageCard} ${styles.whatsappCard}`}>
                    <div className={styles.advantageIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <h4>Simule sua Taxa</h4>
                    <p>Envie os dados do seu veículo e encontre a melhor proposta de crédito por WhatsApp: <strong>(35) 99108-4513</strong>.</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Conteúdo Principal Denso + Imagens + Documentos + FAQ */}
      <section className="section" style={{ backgroundColor: "var(--neutral-white)" }}>
        <div className="container page-grid">
          {/* Coluna Principal */}
          <article style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            <div>
              <h2 style={{ fontSize: "2rem", color: "var(--primary-dark)", marginBottom: "1rem" }}>
                Para Que Você Pode Usar o Crédito com Garantia de Veículo
              </h2>
              <p style={{ color: "var(--neutral-muted)", fontSize: "1.05rem", lineHeight: "1.7", marginBottom: "1rem" }}>
                O dinheiro liberado no Crédito com Garantia de Veículo (também conhecido como <strong>Auto Equity</strong> ou refinanciamento de veículo) é de uso 100% livre — você não precisa justificar ao banco onde vai aplicar o recurso. Os usos mais inteligentes entre nossos clientes incluem: quitar dívidas caras (cartão de crédito, cheque especial e empréstimos pessoais), levantar capital de giro rápido para a empresa, reformar a casa, investir em um negócio ou cobrir despesas imprevistas com parcelas que cabem no bolso.
              </p>
            </div>

            {/* Comparativo de Custos Financeiros */}
            <div className="comparison-card">
              <h3 style={{ fontSize: "1.4rem", color: "var(--primary-color)", marginBottom: "1.5rem" }}>
                Comparativo: Juros do Crédito com Garantia de Veículo vs Outras Linhas
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--neutral-border)" }}>
                      <th style={{ padding: "0.75rem", fontWeight: "bold" }}>Linha de Crédito</th>
                      <th style={{ padding: "0.75rem", fontWeight: "bold" }}>Taxa Média Mensal</th>
                      <th style={{ padding: "0.75rem", fontWeight: "bold", color: "var(--secondary-color)" }}>Prazo de Pagamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid var(--neutral-border)" }}>
                      <td style={{ padding: "0.75rem" }}><strong>Crédito com Garantia de Veículo (Auto Equity)</strong></td>
                      <td style={{ padding: "0.75rem", fontWeight: "600", color: "var(--secondary-color)" }}>A partir de 1,39% a 1,89% ao mês</td>
                      <td style={{ padding: "0.75rem", color: "var(--secondary-color)", fontWeight: "600" }}>De 12 até 60 meses (5 anos)</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--neutral-border)" }}>
                      <td style={{ padding: "0.75rem" }}><strong>Empréstimo Pessoal (Sem garantia)</strong></td>
                      <td style={{ padding: "0.75rem" }}>De 4% a 7% ao mês</td>
                      <td style={{ padding: "0.75rem" }}>Até 36 ou 48 meses</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--neutral-border)" }}>
                      <td style={{ padding: "0.75rem" }}><strong>Cheque Especial / Cartão Rotativo</strong></td>
                      <td style={{ padding: "0.75rem" }}>Acima de 8% a 14% ao mês</td>
                      <td style={{ padding: "0.75rem" }}>Imediato / Curto Prazo</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--neutral-border)" }}>
                      <td style={{ padding: "0.75rem" }}><strong>Capital de Giro Bancário (Sem garantia)</strong></td>
                      <td style={{ padding: "0.75rem" }}>De 2,5% a 4,5% ao mês</td>
                      <td style={{ padding: "0.75rem" }}>Até 24 ou 36 meses</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vantagens e Condições de Contratação com Imagem Lateral */}
            <div>
              <h2 style={{ fontSize: "1.75rem", color: "var(--primary-dark)", marginBottom: "1.25rem" }}>
                Vantagens e Condições de Contratação com a RMJ
              </h2>
              <div className={styles.splitSection}>
                <div className={styles.splitImageBox}>
                  <Image
                    src="/assets/cgv_vantagens_carro.jpg"
                    alt="Cliente dirigindo seu veículo normalmente enquanto utiliza o crédito com garantia de veículo"
                    width={600}
                    height={750}
                    loading="lazy"
                    className={styles.contextualImage}
                  />
                </div>
                <div className={styles.splitContentBox}>
                  <ul className={styles.advantagesList}>
                    <li className={styles.advantageItem}>
                      <span className={styles.advantageIconWrap}>
                        <Percent size={22} />
                      </span>
                      <div>
                        <strong>Juros reduzidos com garantia real:</strong> Ao oferecer o seu veículo como garantia na operação, o risco para o banco diminui drasticamente — permitindo taxas muito menores que as do crédito pessoal.
                      </div>
                    </li>
                    <li className={styles.advantageItem}>
                      <span className={styles.advantageIconWrap}>
                        <BadgeDollarSign size={22} />
                      </span>
                      <div>
                        <strong>Até 90% da Tabela FIPE em mãos:</strong> Carros de passeio e utilitários leves com até 15 anos de fabricação em bom estado podem liberar até 90% do seu valor de mercado.
                      </div>
                    </li>
                    <li className={styles.advantageItem}>
                      <span className={styles.advantageIconWrap}>
                        <CalendarClock size={22} />
                      </span>
                      <div>
                        <strong>Prazos flexíveis de 12 a 60 meses:</strong> Parcelas fixas planejadas para não comprometer o seu orçamento familiar ou o caixa da sua empresa.
                      </div>
                    </li>
                    <li className={styles.advantageItem}>
                      <span className={styles.advantageIconWrap}>
                        <Car size={22} />
                      </span>
                      <div>
                        <strong>Manutenção total da posse:</strong> O veículo fica alienado ao banco parceiro apenas no documento (CRLV), enquanto você continua dirigindo e utilizando o bem normalmente.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Etapas do Processo com Imagem Lateral */}
            <div>
              <h2 style={{ fontSize: "1.75rem", color: "var(--primary-dark)", marginBottom: "1.25rem" }}>
                Como funciona o processo de liberação?
              </h2>
              <div className={styles.splitSection}>
                <div className={styles.splitImageBox}>
                  <Image
                    src="/assets/cgv_etapas_celular.jpg"
                    alt="Cliente realizando a simulação e vistoria digital do veículo pelo celular em casa"
                    width={600}
                    height={750}
                    loading="lazy"
                    className={styles.contextualImage}
                  />
                </div>
                <div className={styles.splitContentBox}>
                  <ol style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingLeft: "1.25rem", color: "var(--neutral-muted)", lineHeight: "1.6", margin: 0 }}>
                    <li>
                      <strong>Simulação Cadastral e FIPE:</strong> Avaliamos os dados do seu veículo e seu perfil em múltiplos bancos parceiros (BV, Santander, Itaú, Creditas, Safra e Bradesco) para apresentar a menor taxa.
                    </li>
                    <li>
                      <strong>Vistoria Digital pelo Celular:</strong> Sem precisar levar o carro a um posto físico, você realiza a vistoria digital guiada diretamente pelo smartphone em poucos minutos.
                    </li>
                    <li>
                      <strong>Assinatura Digital do Contrato:</strong> Com o laudo validado, o contrato de crédito com garantia de veículo é assinado eletronicamente pelo celular com total validade jurídica.
                    </li>
                    <li>
                      <strong>Depósito Rápido na Conta:</strong> Registrado o gravame, o dinheiro cai direto na sua conta corrente (ou quita o saldo devedor anterior e libera o troco à vista).
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Seção: Documentos Necessários */}
            <div className={styles.docsSectionBox}>
              <div className={styles.docsHeader}>
                <span className={styles.docsHeaderIcon}>
                  <FileCheck2 size={26} />
                </span>
                <div>
                  <h2 style={{ fontSize: "1.75rem", color: "var(--primary-dark)", margin: 0 }}>
                    Documentos Necessários para o Crédito com Garantia de Veículo
                  </h2>
                  <p style={{ color: "var(--neutral-muted)", fontSize: "0.98rem", marginTop: "0.35rem", marginBottom: 0 }}>
                    Reúna a documentação abaixo para agilizar sua aprovação. Todo o envio é 100% digital.
                  </p>
                </div>
              </div>

              <div className={styles.docsGrid}>
                {/* Grupo 1 — Documentos Pessoais */}
                <div className={styles.docGroupCard}>
                  <h3 className={styles.docGroupTitle}>
                    <UserCheck size={20} className={styles.docGroupIcon} />
                    Documentos Pessoais
                  </h3>
                  <ul className={styles.docChecklist}>
                    <li>
                      <CheckCircle2 size={17} className={styles.docCheckIcon} />
                      <span>CNH válida (ou RG e CPF)</span>
                    </li>
                    <li>
                      <CheckCircle2 size={17} className={styles.docCheckIcon} />
                      <span>Comprovante de endereço atualizado (últimos 90 dias)</span>
                    </li>
                    <li>
                      <CheckCircle2 size={17} className={styles.docCheckIcon} />
                      <span>Comprovante de renda ou extratos bancários dos últimos 3 meses</span>
                    </li>
                    <li>
                      <CheckCircle2 size={17} className={styles.docCheckIcon} />
                      <span>Dados bancários de conta de mesma titularidade para o depósito</span>
                    </li>
                  </ul>
                </div>

                {/* Grupo 2 — Documentos do Veículo */}
                <div className={styles.docGroupCard}>
                  <h3 className={styles.docGroupTitle}>
                    <Car size={20} className={styles.docGroupIcon} />
                    Documentos do Veículo
                  </h3>
                  <ul className={styles.docChecklist}>
                    <li>
                      <CheckCircle2 size={17} className={styles.docCheckIcon} />
                      <span>CRLV-e atualizado (Certificado de Registro e Licenciamento do Veículo)</span>
                    </li>
                    <li>
                      <CheckCircle2 size={17} className={styles.docCheckIcon} />
                      <span>Veículo registrado no nome do solicitante (quitado ou financiado)</span>
                    </li>
                    <li>
                      <CheckCircle2 size={17} className={styles.docCheckIcon} />
                      <span>Fotos do veículo para a vistoria digital orientada pelo celular</span>
                    </li>
                    <li>
                      <CheckCircle2 size={17} className={styles.docCheckIcon} />
                      <span>Ausência de bloqueios judiciais (Renajud) ou sinistro de perda total</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className={styles.docsFooter}>
                <p className={styles.docsFooterText}>
                  A RMJ orienta você em cada etapa da documentação e da vistoria digital. Fale com nosso time pelo WhatsApp.
                </p>
                <a
                  href="https://wa.me/5535991084513?text=Olá,%20acessei%20o%20site%20da%20RMJ%20e%20tenho%20dúvidas%20sobre%20a%20documentação%20do%20Crédito%20com%20Garantia%20de%20Veículo."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Tirar Dúvidas no WhatsApp
                </a>
              </div>
            </div>

            {/* FAQs Expansíveis (7 Perguntas) com imagem decorativa acima */}
            <div style={{ marginTop: "0.5rem" }}>
              <div className={styles.faqBannerWrapper}>
                <Image
                  src="/assets/cgv_faq_chaves.jpg"
                  alt="Close de mão segurando a chave de um veículo moderno com carro estacionado ao fundo"
                  width={720}
                  height={405}
                  loading="lazy"
                  className={styles.faqBannerImage}
                />
              </div>
              <h2 style={{ fontSize: "1.75rem", color: "var(--primary-dark)", marginBottom: "1.25rem" }}>
                Perguntas Frequentes sobre Crédito com Garantia de Veículo
              </h2>
              <div className={styles.faqAccordionList}>
                <details className={styles.faqItem} open>
                  <summary className={styles.faqQuestion}>
                    <span>O veículo oferecido em garantia precisa estar quitado?</span>
                    <ChevronDown size={18} className={styles.faqChevron} />
                  </summary>
                  <p className={styles.faqAnswer}>
                    Não necessariamente. O ideal é que o veículo esteja quitado, mas se ainda houver parcelas em aberto, estruturamos a operação onde parte do novo crédito quita o saldo devedor atual e a diferença (o troco) é depositada à vista na sua conta.
                  </p>
                </details>

                <details className={styles.faqItem} open>
                  <summary className={styles.faqQuestion}>
                    <span>Eu continuo usando meu veículo normalmente durante o contrato?</span>
                    <ChevronDown size={18} className={styles.faqChevron} />
                  </summary>
                  <p className={styles.faqAnswer}>
                    Sim, 100%. O veículo fica apenas alienado fiduciariamente no documento (gravame) ao banco parceiro como garantia da operação, mas a posse e o uso diário do carro permanecem integralmente com você.
                  </p>
                </details>

                <details className={styles.faqItem} open>
                  <summary className={styles.faqQuestion}>
                    <span>Quais veículos são aceitos como garantia?</span>
                    <ChevronDown size={18} className={styles.faqChevron} />
                  </summary>
                  <p className={styles.faqAnswer}>
                    São aceitos carros de passeio e utilitários leves com até 15 anos de fabricação, em bom estado de conservação e sem histórico de sinistro grave (perda total) ou bloqueios judiciais.
                  </p>
                </details>

                <details className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    <span>Qual o valor mínimo e máximo do Crédito com Garantia de Veículo?</span>
                    <ChevronDown size={18} className={styles.faqChevron} />
                  </summary>
                  <p className={styles.faqAnswer}>
                    Você pode obter até 90% do valor do seu veículo na Tabela FIPE, dependendo do ano de fabricação, perfil de crédito e instituição escolhida. A RMJ simula em diversos bancos parceiros para buscar o maior limite com a menor taxa.
                  </p>
                </details>

                <details className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    <span>Quanto tempo leva para o dinheiro cair na conta?</span>
                    <ChevronDown size={18} className={styles.faqChevron} />
                  </summary>
                  <p className={styles.faqAnswer}>
                    O Crédito com Garantia de Veículo é uma das linhas mais rápidas do mercado. Como a vistoria e a assinatura do contrato são 100% digitais, a liberação do recurso costuma ocorrer entre 24 e 72 horas úteis após a aprovação.
                  </p>
                </details>

                <details className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    <span>Posso contratar o Crédito com Garantia de Veículo mesmo com restrições no nome?</span>
                    <ChevronDown size={18} className={styles.faqChevron} />
                  </summary>
                  <p className={styles.faqAnswer}>
                    Depende da instituição financeira parceira. Algumas instituições analisam propostas com apontamentos leves, desde que o veículo atenda aos critérios de garantia e haja capacidade de pagamento comprovada. Fale com a RMJ para uma análise individual.
                  </p>
                </details>

                <details className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    <span>Empresas (PJ) também podem usar veículos como garantia?</span>
                    <ChevronDown size={18} className={styles.faqChevron} />
                  </summary>
                  <p className={styles.faqAnswer}>
                    Sim. Empresários podem usar veículos registrados em nome da pessoa física (sócio) ou da própria empresa (CNPJ) para levantar capital de giro rápido, organizar o fluxo de caixa ou investir no negócio com taxas reduzidas.
                  </p>
                </details>
              </div>
            </div>
          </article>

          {/* Barra Lateral */}
          <aside style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ padding: "1.5rem", backgroundColor: "var(--neutral-light)", borderRadius: "var(--radius-md)", border: "1px solid var(--neutral-border)" }}>
              <h3 style={{ fontSize: "1.2rem", color: "var(--primary-dark)", marginBottom: "1rem" }}>Serviços Relacionados</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li><Link href="/financiamento-veiculos" style={{ fontSize: "0.95rem", color: "var(--primary-color)" }}>Financiamento de Veículos &rarr;</Link></li>
                <li><Link href="/home-equity" style={{ fontSize: "0.95rem", color: "var(--primary-color)" }}>Home Equity (Garantia de Imóvel) &rarr;</Link></li>
                <li><Link href="/credito-bdmg" style={{ fontSize: "0.95rem", color: "var(--primary-color)" }}>Capital de Giro BDMG &rarr;</Link></li>
                <li><Link href="/consorcios" style={{ fontSize: "0.95rem", color: "var(--primary-color)" }}>Consórcio de Veículos &rarr;</Link></li>
              </ul>
            </div>

            <div style={{ padding: "1.5rem", backgroundColor: "var(--primary-dark)", color: "#fff", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", color: "var(--accent-color)" }}>Simule seu Veículo</h3>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)", margin: 0 }}>
                Envie o modelo e o ano do seu veículo pelo WhatsApp para receber uma simulação gratuita em minutos.
              </p>
              <a
                href="https://wa.me/5535991084513?text=Olá,%20gostaria%20de%20simular%20o%20Crédito%20com%20Garantia%20de%20Veículo."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent"
                style={{ width: "100%", fontSize: "0.9rem" }}
              >
                Simular no WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* 4. Seção Saiba Mais (Artigos do Blog) */}
      <section className={`${styles.blogSection} section`}>
        <div className="container">
          <div className={styles.blogHeader}>
            <h2 className={styles.blogSectionTitle}>Saiba Mais sobre Crédito Automotivo</h2>
            <p className={styles.blogSectionSubtitle}>
              Artigos do nosso blog para você entender cada etapa antes de contratar.
            </p>
          </div>

          <div className={styles.blogCardsGrid}>
            {/* Card 1 */}
            <Link href="/blog/documentos-necessarios-financiamento-veiculo" className={styles.blogCard}>
              <div className={styles.blogCardImage}>
                <Image
                  src="/assets/blog/blog_documentos_veiculos_v2.jpg"
                  alt="Documentos Necessários para Crédito e Financiamento de Veículos"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.blogCardBody}>
                <h3 className={styles.blogCardTitle}>Documentos Necessários para Operações de Veículos</h3>
                <p className={styles.blogCardDesc}>
                  Veja o que preparar para aprovar seu crédito veicular sem atrasos.
                </p>
                <span className={styles.blogCardLink}>Leia mais &rarr;</span>
              </div>
            </Link>

            {/* Card 2 */}
            <Link href="/blog/como-funciona-vistoria-veiculo-financiado" className={styles.blogCard}>
              <div className={styles.blogCardImage}>
                <Image
                  src="/assets/happy_family_car.png"
                  alt="Como Funciona a Vistoria de Veículos nas Operações de Crédito"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.blogCardBody}>
                <h3 className={styles.blogCardTitle}>Como Funciona a Vistoria de Veículos no Crédito</h3>
                <p className={styles.blogCardDesc}>
                  Entenda os critérios avaliados na vistoria para liberação rápida do recurso.
                </p>
                <span className={styles.blogCardLink}>Leia mais &rarr;</span>
              </div>
            </Link>

            {/* Card 3 */}
            <Link href="/blog/vantagens-financiar-veiculo-particular" className={styles.blogCard}>
              <div className={styles.blogCardImage}>
                <Image
                  src="/assets/blog/blog_vantagens_veiculo_v2.jpg"
                  alt="Vantagens de Contar com Assessoria Independente no Crédito Veicular"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.blogCardBody}>
                <h3 className={styles.blogCardTitle}>Por Que Comparar Taxas com Assessoria Independente</h3>
                <p className={styles.blogCardDesc}>
                  Descubra a economia real ao simular em múltiplos bancos simultaneamente.
                </p>
                <span className={styles.blogCardLink}>Leia mais &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Seção de CTA + Formulário */}
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
