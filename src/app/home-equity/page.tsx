import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Home Equity em Itajubá e Sul de Minas | Empréstimo com Garantia de Imóvel | RMJ",
  description: "Empréstimo com garantia de imóvel (Home Equity) com as menores taxas do mercado — a partir de 0,99% a.m. Simule agora com a RMJ Soluções de Crédito em Itajubá.",
};;

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
                "name": "Posso perder meu imóvel?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A alienação fiduciária é uma garantia, mas a perda só ocorre em casos de inadimplência crônica e prolongada, após diversas tentativas de negociação por parte da instituição financeira."
                }
              },
              {
                "@type": "Question",
                "name": "Qual o valor mínimo e máximo?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Você pode liberar de R$ 50 mil a R$ 3 milhões, dependendo do valor de avaliação do seu imóvel (limite geralmente entre 50% e 60% do valor do bem)."
                }
              },
              {
                "@type": "Question",
                "name": "Imóvel financiado serve?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sim, caso o imóvel não esteja 100% quitado, parte do novo crédito aprovado será utilizada para quitar o saldo devedor do primeiro financiamento (interveniente quitante), e a diferença fica livre para você."
                }
              },
              {
                "@type": "Question",
                "name": "O Home Equity é seguro?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Totalmente. O processo é regulamentado pelo Banco Central do Brasil. A RMJ Soluções de Crédito trabalha apenas com grandes bancos e instituições financeiras certificadas."
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
          <article style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            

            
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

            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>As principais vantagens do Home Equity com a RMJ</h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.25rem', color: 'var(--neutral-muted)', lineHeight: '1.6' }}>
                <li><strong>Os menores juros do mercado:</strong> Como o banco tem a segurança da garantia física do imóvel, o risco da operação despenca e, por consequência, as taxas de juros nominais cobradas são extremamente baixas.</li>
                <li><strong>Prazos estendidos de até 20 anos:</strong> Dilua o valor contratado em parcelas que não pesam na folha de pagamentos ou no orçamento familiar, com prazos de amortização de até 240 meses.</li>
                <li><strong>Manutenção de Posse do Bem:</strong> O imóvel é alienado fiduciariamente no contrato, mas o direito de uso, moradia ou locação comercial permanece 100% com você.</li>
                <li><strong>Crédito de até 60% do valor do imóvel:</strong> Obtenha valores expressivos em dinheiro de forma rápida e segura (linhas que vão de R$ 50 mil até múltiplos milhões de reais).</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Como funciona o processo de liberação?</h2>
              <ol style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.25rem', color: 'var(--neutral-muted)', lineHeight: '1.6' }}>
                <li><strong>Simulação Cadastral:</strong> Analisamos os dados do seu imóvel e a sua renda familiar ou faturamento PJ para enquadrar a melhor proposta de juros.</li>
                <li><strong>Avaliação Técnica do Imóvel:</strong> Um perito avaliador de engenharia realiza o laudo físico de mercado do seu imóvel.</li>
                <li><strong>Emissão de Contrato:</strong> Emitimos o contrato de alienação fiduciária com as maiores instituições e fintechs de crédito do país.</li>
                <li><strong>Depósito em Conta:</strong> Com o registro do contrato efetuado em cartório imobiliário, o dinheiro é liberado à vista em conta em poucos dias.</li>
              </ol>
            </div>

            {/* FAQs */}
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>Perguntas Frequentes sobre Home Equity</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>O imóvel oferecido de garantia precisa estar quitado?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    O ideal é que o imóvel esteja quitado. No entanto, se o seu imóvel ainda possui parcelas abertas de financiamento, podemos estruturar a operação onde o novo crédito de Home Equity quita o saldo devedor atual e a diferença (o troco) é creditada à vista para você.
                  </p>
                </div>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Eu corro o risco de perder meu imóvel no Home Equity?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Como em qualquer empréstimo, o imóvel atua como garantia contratual. No entanto, por contar com prazos estendidos de até 20 anos e juros extremamente baixos, as parcelas são muito suaves, minimizando os riscos de inadimplência. Além disso, a RMJ assessora você para estruturar uma parcela saudável que caiba perfeitamente no seu fluxo de caixa.
                  </p>
                </div>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Quais tipos de imóveis são aceitos no refinanciamento?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    São aceitos imóveis residenciais de alvenaria (casas e apartamentos) e imóveis comerciais (salas, lajes corporativas, galpões). Terrenos e lotes em condomínios também podem ser avaliados dependendo da instituição parceira escolhida.
                  </p>
                </div>
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
