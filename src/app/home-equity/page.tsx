import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";
import {
  Percent,
  CalendarClock,
  Home,
  BadgeDollarSign,
  FileCheck2,
  UserCheck,
  Building2,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

export const metadata = {
  title: "Home Equity em Itajubá e Sul de Minas | Empréstimo com Garantia de Imóvel | RMJ",
  description: "Home Equity em Itajubá e Sul de Minas — taxas a partir de 1,0% ao mês. Simule seu empréstimo com garantia de imóvel com a RMJ Soluções de Crédito.",
};

export default function HomeEquity() {
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
                "name": "O imóvel oferecido de garantia precisa estar quitado?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "O ideal é que o imóvel esteja quitado. No entanto, se o seu imóvel ainda possui parcelas abertas de financiamento, podemos estruturar a operação onde o novo crédito de Home Equity quita o saldo devedor atual e a diferença (o troco) é creditada à vista para você."
                }
              },
              {
                "@type": "Question",
                "name": "Eu corro o risco de perder meu imóvel no Home Equity?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Como em qualquer empréstimo, o imóvel atua como garantia contratual. No entanto, por contar com prazos estendidos de até 20 anos e juros extremamente baixos, as parcelas são muito suaves, minimizando os riscos de inadimplência. Além disso, a RMJ assessora você para estruturar uma parcela saudável que caiba perfeitamente no seu fluxo de caixa."
                }
              },
              {
                "@type": "Question",
                "name": "Quais tipos de imóveis são aceitos no refinanciamento?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "São aceitos imóveis residenciais de alvenaria (casas e apartamentos) e imóveis comerciais (salas, lajes corporativas, galpões). Terrenos e lotes em condomínios também podem ser avaliados dependendo da instituição parceira escolhida."
                }
              },
              {
                "@type": "Question",
                "name": "Qual o valor mínimo e máximo do Home Equity?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "O valor mínimo é de R$ 50 mil. O máximo pode chegar a 60% do valor de avaliação do imóvel, podendo ultrapassar R$ 1 milhão dependendo do bem. A RMJ simula com diversas instituições para encontrar a melhor condição para o seu caso."
                }
              },
              {
                "@type": "Question",
                "name": "Quanto tempo leva para o crédito ser liberado?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "O prazo médio é de 20 a 45 dias, contando desde a entrega dos documentos até o depósito em conta. As etapas que mais influenciam o prazo são a avaliação do imóvel pelo perito e o registro do contrato em cartório."
                }
              },
              {
                "@type": "Question",
                "name": "Posso usar o Home Equity mesmo com restrições no nome?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Depende da instituição. Algumas parceiras da RMJ trabalham com clientes que possuem restrições, desde que o imóvel tenha valor compatível e a capacidade de pagamento seja demonstrada. Consulte nosso time para uma análise individualizada."
                }
              },
              {
                "@type": "Question",
                "name": "O Home Equity serve para pessoa jurídica?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sim. Empresários podem usar imóveis em nome da pessoa física ou da empresa como garantia para obter capital de giro, quitar dívidas empresariais ou investir na expansão do negócio. As condições são semelhantes às da pessoa física."
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
            "name": "Home Equity",
            "provider": {
              "@id": "https://rmjcred.com.br/#organizacao"
            },
            "areaServed": [
              { "@type": "City", "name": "Itajubá" },
              { "@type": "AdministrativeArea", "name": "Sul de Minas Gerais" }
            ]
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
            <ol style={{ display: 'flex', listStyle: 'none', gap: '0.5rem', padding: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
              <li><Link href="/" style={{ color: 'inherit' }}>Início</Link></li>
              <li>/</li>
              <li style={{ color: '#fff' }}>Home Equity</li>
            </ol>
          </nav>
          <h1 className={styles.title}>Home Equity: Empréstimo com Garantia de Imóvel com as Menores Taxas do Mercado</h1>
          <div className={styles.leadText}>
            <p style={{marginBottom: "1rem"}}>O Home Equity é a modalidade de crédito que mais cresce no Brasil. Com crescimento de 25% só no primeiro trimestre de 2026, essa linha permite que você use seu imóvel quitado ou financiado como garantia para acessar empréstimos com as menores taxas do mercado — muito abaixo do crédito pessoal ou do cheque especial.</p>
            <p>Na RMJ Soluções de Crédito, somos especialistas em Home Equity e ajudamos dezenas de clientes em Itajubá e no Sul de Minas a transformar o patrimônio imobiliário em capital de trabalho, investimento ou reestruturação financeira.</p>
          </div>
        </div>
      </section>

      {/* 2. Conteúdo Principal Denso */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-white)' }}>
        <div className="container page-grid">
          
          {/* Coluna do Artigo de Conteúdo */}
          <article style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Para Que Você Pode Usar o Home Equity</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                O recurso liberado pelo Home Equity é de uso livre. Os usos mais comuns entre nossos clientes incluem: quitação de dívidas com juros altos (cartão de crédito, cheque especial, empréstimos pessoais), capital de giro para o negócio, investimento em expansão da empresa, reforma ou construção, aquisição de outro imóvel ou veículo, e educação ou tratamentos médicos.
              </p>
            </div>

            {/* Comparativo de Custos Financeiros */}
            <div className="comparison-card">
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Comparativo: Juros de Home Equity vs Outras Linhas</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--neutral-border)' }}>
                      <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Linha de Crédito</th>
                      <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Taxa Média Nominal</th>
                      <th style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>Prazo Máximo para Pagamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Home Equity (Com Garantia de Imóvel)</strong></td>
                      <td style={{ padding: '0.75rem', fontWeight: '600', color: 'var(--secondary-color)' }}>A partir de 1,0% a 1,5% ao mês</td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Até 240 meses (20 anos)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Empréstimo Pessoal (Sem garantia)</strong></td>
                      <td style={{ padding: '0.75rem' }}>De 4% a 7% ao mês</td>
                      <td style={{ padding: '0.75rem' }}>Até 48 ou 60 meses</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Cheque Especial / Rotativo</strong></td>
                      <td style={{ padding: '0.75rem' }}>Acima de 8% a 12% ao mês</td>
                      <td style={{ padding: '0.75rem' }}>Imediato / Curto Prazo</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Giro de Caixa (Bancos Tradicionais)</strong></td>
                      <td style={{ padding: '0.75rem' }}>De 2% a 4% ao mês</td>
                      <td style={{ padding: '0.75rem' }}>Até 36 ou 48 meses</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vantagens com ícones */}
            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>As principais vantagens do Home Equity com a RMJ</h2>
              <ul className={styles.advantagesList}>
                <li className={styles.advantageItem}>
                  <span className={styles.advantageIconWrap}>
                    <Percent size={22} />
                  </span>
                  <div>
                    <strong>Os menores juros do mercado:</strong> Como o banco tem a segurança da garantia física do imóvel, o risco da operação despenca e, por consequência, as taxas de juros nominais cobradas são extremamente baixas.
                  </div>
                </li>
                <li className={styles.advantageItem}>
                  <span className={styles.advantageIconWrap}>
                    <CalendarClock size={22} />
                  </span>
                  <div>
                    <strong>Prazos estendidos de até 20 anos:</strong> Dilua o valor contratado em parcelas que não pesam na folha de pagamentos ou no orçamento familiar, com prazos de amortização de até 240 meses.
                  </div>
                </li>
                <li className={styles.advantageItem}>
                  <span className={styles.advantageIconWrap}>
                    <Home size={22} />
                  </span>
                  <div>
                    <strong>Manutenção de Posse do Bem:</strong> O imóvel é alienado fiduciariamente no contrato, mas o direito de uso, moradia ou locação comercial permanece 100% com você.
                  </div>
                </li>
                <li className={styles.advantageItem}>
                  <span className={styles.advantageIconWrap}>
                    <BadgeDollarSign size={22} />
                  </span>
                  <div>
                    <strong>Crédito de até 60% do valor do imóvel:</strong> Obtenha valores expressivos em dinheiro de forma rápida e segura (linhas que vão de R$ 50 mil até múltiplos milhões de reais).
                  </div>
                </li>
              </ul>
            </div>

            {/* Etapas do processo */}
            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Como funciona o processo de liberação?</h2>
              <ol style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.25rem', color: 'var(--neutral-muted)', lineHeight: '1.6' }}>
                <li><strong>Simulação Cadastral:</strong> Analisamos os dados do seu imóvel e a sua renda familiar ou faturamento PJ para enquadrar a melhor proposta de juros.</li>
                <li><strong>Avaliação Técnica do Imóvel:</strong> Um perito avaliador de engenharia realiza o laudo físico de mercado do seu imóvel.</li>
                <li><strong>Emissão de Contrato:</strong> Emitimos o contrato de alienação fiduciária com as maiores instituições e fintechs de crédito do país.</li>
                <li><strong>Depósito em Conta:</strong> Com o registro do contrato efetuado em cartório imobiliário, o dinheiro é liberado à vista em conta em poucos dias.</li>
              </ol>
            </div>

            {/* NOVA SEÇÃO: Documentos Necessários */}
            <div className={styles.docsSectionBox}>
              <div className={styles.docsHeader}>
                <span className={styles.docsHeaderIcon}>
                  <FileCheck2 size={26} />
                </span>
                <div>
                  <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', margin: 0 }}>
                    Documentos Necessários para o Home Equity
                  </h2>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.98rem', marginTop: '0.35rem', marginBottom: 0 }}>
                    Reúna a documentação abaixo para agilizar sua análise. A lista pode variar conforme a instituição parceira.
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
                      <span>RG e CPF (ou CNH)</span>
                    </li>
                    <li>
                      <CheckCircle2 size={17} className={styles.docCheckIcon} />
                      <span>Comprovante de estado civil (certidão de casamento ou nascimento)</span>
                    </li>
                    <li>
                      <CheckCircle2 size={17} className={styles.docCheckIcon} />
                      <span>Comprovante de renda dos últimos 3 meses (holerite, pró-labore ou declaração de IR)</span>
                    </li>
                    <li>
                      <CheckCircle2 size={17} className={styles.docCheckIcon} />
                      <span>Comprovante de endereço atualizado (últimos 90 dias)</span>
                    </li>
                  </ul>
                </div>

                {/* Grupo 2 — Documentos do Imóvel */}
                <div className={styles.docGroupCard}>
                  <h3 className={styles.docGroupTitle}>
                    <Building2 size={20} className={styles.docGroupIcon} />
                    Documentos do Imóvel
                  </h3>
                  <ul className={styles.docChecklist}>
                    <li>
                      <CheckCircle2 size={17} className={styles.docCheckIcon} />
                      <span>Matrícula atualizada do imóvel (emitida há menos de 30 dias)</span>
                    </li>
                    <li>
                      <CheckCircle2 size={17} className={styles.docCheckIcon} />
                      <span>IPTU do exercício atual</span>
                    </li>
                    <li>
                      <CheckCircle2 size={17} className={styles.docCheckIcon} />
                      <span>Certidão negativa de ônus reais</span>
                    </li>
                    <li>
                      <CheckCircle2 size={17} className={styles.docCheckIcon} />
                      <span>Certidões negativas de débitos (federal, estadual e municipal)</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className={styles.docsFooter}>
                <p className={styles.docsFooterText}>
                  A RMJ orienta você em cada etapa da documentação. Fale com nosso time pelo WhatsApp para tirar dúvidas.
                </p>
                <a
                  href="https://wa.me/5535991084513?text=Olá,%20acessei%20o%20site%20da%20RMJ%20e%20tenho%20dúvidas%20sobre%20a%20documentação%20do%20Home%20Equity."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Tirar Dúvidas no WhatsApp
                </a>
              </div>
            </div>

            {/* FAQs Expansíveis (7 Perguntas) */}
            <div style={{ marginTop: '0.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>Perguntas Frequentes sobre Home Equity</h2>
              <div className={styles.faqAccordionList}>
                <details className={styles.faqItem} open>
                  <summary className={styles.faqQuestion}>
                    <span>O imóvel oferecido de garantia precisa estar quitado?</span>
                    <ChevronDown size={18} className={styles.faqChevron} />
                  </summary>
                  <p className={styles.faqAnswer}>
                    O ideal é que o imóvel esteja quitado. No entanto, se o seu imóvel ainda possui parcelas abertas de financiamento, podemos estruturar a operação onde o novo crédito de Home Equity quita o saldo devedor atual e a diferença (o troco) é creditada à vista para você.
                  </p>
                </details>

                <details className={styles.faqItem} open>
                  <summary className={styles.faqQuestion}>
                    <span>Eu corro o risco de perder meu imóvel no Home Equity?</span>
                    <ChevronDown size={18} className={styles.faqChevron} />
                  </summary>
                  <p className={styles.faqAnswer}>
                    Como em qualquer empréstimo, o imóvel atua como garantia contratual. No entanto, por contar com prazos estendidos de até 20 anos e juros extremamente baixos, as parcelas são muito suaves, minimizando os riscos de inadimplência. Além disso, a RMJ assessora você para estruturar uma parcela saudável que caiba perfeitamente no seu fluxo de caixa.
                  </p>
                </details>

                <details className={styles.faqItem} open>
                  <summary className={styles.faqQuestion}>
                    <span>Quais tipos de imóveis são aceitos no refinanciamento?</span>
                    <ChevronDown size={18} className={styles.faqChevron} />
                  </summary>
                  <p className={styles.faqAnswer}>
                    São aceitos imóveis residenciais de alvenaria (casas e apartamentos) e imóveis comerciais (salas, lajes corporativas, galpões). Terrenos e lotes em condomínios também podem ser avaliados dependendo da instituição parceira escolhida.
                  </p>
                </details>

                <details className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    <span>Qual o valor mínimo e máximo do Home Equity?</span>
                    <ChevronDown size={18} className={styles.faqChevron} />
                  </summary>
                  <p className={styles.faqAnswer}>
                    O valor mínimo é de R$ 50 mil. O máximo pode chegar a 60% do valor de avaliação do imóvel, podendo ultrapassar R$ 1 milhão dependendo do bem. A RMJ simula com diversas instituições para encontrar a melhor condição para o seu caso.
                  </p>
                </details>

                <details className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    <span>Quanto tempo leva para o crédito ser liberado?</span>
                    <ChevronDown size={18} className={styles.faqChevron} />
                  </summary>
                  <p className={styles.faqAnswer}>
                    O prazo médio é de 20 a 45 dias, contando desde a entrega dos documentos até o depósito em conta. As etapas que mais influenciam o prazo são a avaliação do imóvel pelo perito e o registro do contrato em cartório.
                  </p>
                </details>

                <details className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    <span>Posso usar o Home Equity mesmo com restrições no nome?</span>
                    <ChevronDown size={18} className={styles.faqChevron} />
                  </summary>
                  <p className={styles.faqAnswer}>
                    Depende da instituição. Algumas parceiras da RMJ trabalham com clientes que possuem restrições, desde que o imóvel tenha valor compatível e a capacidade de pagamento seja demonstrada. Consulte nosso time para uma análise individualizada.
                  </p>
                </details>

                <details className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    <span>O Home Equity serve para pessoa jurídica?</span>
                    <ChevronDown size={18} className={styles.faqChevron} />
                  </summary>
                  <p className={styles.faqAnswer}>
                    Sim. Empresários podem usar imóveis em nome da pessoa física ou da empresa como garantia para obter capital de giro, quitar dívidas empresariais ou investir na expansão do negócio. As condições são semelhantes às da pessoa física.
                  </p>
                </details>
              </div>
            </div>

          </article>

          {/* Barra Lateral */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--neutral-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-border)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Serviços Relacionados</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link href="/credito-imovel" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Financiamento Imobiliário &rarr;</Link></li>
                <li><Link href="/credito-garantia-veiculo" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Refinanciamento de Carros &rarr;</Link></li>
                <li><Link href="/credito-bdmg" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Capital de Giro BDMG &rarr;</Link></li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'var(--primary-dark)', color: '#fff', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>Simule seu Limite</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                Envie os dados do seu imóvel residencial ou comercial para simulação rápida no WhatsApp.
              </p>
              <a href="https://wa.me/5535991084513" target="_blank" rel="noopener noreferrer" className="btn btn-accent" style={{ width: '100%', fontSize: '0.9rem' }}>
                Simular no WhatsApp
              </a>
            </div>
          </aside>

        </div>
      </section>

      {/* NOVA SEÇÃO: Saiba Mais sobre Home Equity (artigos do blog) */}
      <section className={`${styles.blogSection} section`}>
        <div className="container">
          <div className={styles.blogHeader}>
            <h2 className={styles.blogSectionTitle}>Saiba Mais sobre Home Equity</h2>
            <p className={styles.blogSectionSubtitle}>
              Artigos do nosso blog para você entender tudo antes de contratar.
            </p>
          </div>

          <div className={styles.blogCardsGrid}>
            {/* Card 1 */}
            <Link href="/blog/o-que-e-home-equity-e-como-funciona" className={styles.blogCard}>
              <div className={styles.blogCardImage}>
                <Image
                  src="/assets/blog/blog_home_equity.png"
                  alt="O que é Home Equity e Como Funciona"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.blogCardBody}>
                <h3 className={styles.blogCardTitle}>O que é Home Equity e Como Funciona</h3>
                <p className={styles.blogCardDesc}>
                  Entenda a modalidade de crédito que mais cresce no Brasil.
                </p>
                <span className={styles.blogCardLink}>Leia mais &rarr;</span>
              </div>
            </Link>

            {/* Card 2 */}
            <Link href="/blog/home-equity-vs-emprestimo-pessoal" className={styles.blogCard}>
              <div className={styles.blogCardImage}>
                <Image
                  src="/assets/blog/blog_home_equity_pessoal.png"
                  alt="Home Equity vs Empréstimo Pessoal: Qual Tem as Menores Taxas?"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.blogCardBody}>
                <h3 className={styles.blogCardTitle}>Home Equity vs Empréstimo Pessoal: Qual Tem as Menores Taxas?</h3>
                <p className={styles.blogCardDesc}>
                  Compare taxas, prazos e condições lado a lado.
                </p>
                <span className={styles.blogCardLink}>Leia mais &rarr;</span>
              </div>
            </Link>

            {/* Card 3 */}
            <Link href="/blog/regras-imovel-garantia-home-equity" className={styles.blogCard}>
              <div className={styles.blogCardImage}>
                <Image
                  src="/assets/blog/blog_imovel_garantia.png"
                  alt="Quais Imóveis Podem Ser Usados como Garantia?"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.blogCardBody}>
                <h3 className={styles.blogCardTitle}>Quais Imóveis Podem Ser Usados como Garantia?</h3>
                <p className={styles.blogCardDesc}>
                  Casas, apartamentos, salas comerciais — veja o que vale.
                </p>
                <span className={styles.blogCardLink}>Leia mais &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Seção de Simulação */}
      <section className={`${styles.ctaSection} section`} id="simular">
        <div className={`${styles.ctaContainer} container`}>
          <div className={styles.titleContainer}>
            <span className={styles.backLink} style={{ color: "var(--secondary-color)" }}>Simulação Gratuita</span>
            <h2>Transforme seu Imóvel em Capital Estratégico</h2>
            <p className={styles.leadText} style={{ color: "var(--neutral-muted)" }}>
              Preencha os dados e nosso time buscará nos bancos parceiros a melhor taxa de refinanciamento para seu perfil.
            </p>
          </div>
          <div>
            <LeadForm defaultService="Home Equity" />
          </div>
        </div>
      </section>
    </>
  );
}

