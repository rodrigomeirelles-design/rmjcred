import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Crédito BDMG em Itajubá com 12 Meses de Carência | RMJ",
  description: "Impulsione sua micro ou pequena empresa com a menor taxa do mercado. Crédito de fomento BDMG em Itajubá e região com até 72 meses de prazo e sem venda casada.",
};

export default function CreditoBdmg() {
  return (
    <>
      {/* 1. Cabeçalho da Página */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <div className={styles.headerLogoWrapper}>
             <Image src="/assets/logo-bdmg-parceiro-244x150.png" alt="Parceiro BDMG" width={140} height={45} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </div>
          <h1 className={styles.title} style={{ maxWidth: '600px', fontSize: '3.5rem', lineHeight: '1.1', fontWeight: '800' }}>
            Crédito BDMG Inteligente para <span className={styles.orangeTitle}>Pequenos Negócios</span>
          </h1>
          <p className={styles.leadText}>
            Tenha acesso a crédito empresarial descomplicado, com os melhores prazos, taxas competitivas e menos burocracia. Potencialize o crescimento do seu negócio sem precisar adquirir produtos casados.
          </p>
          <div className={styles.headerButtons}>
            <Link href="#simular" className="btn btn-primary">Simular Crédito Agora</Link>
            <Link href="#como-funciona" className={styles.btnOutline}>Como Funciona?</Link>
          </div>
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

      {/* 2. Conteúdo Principal Denso */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-white)' }}>
        <div className="container page-grid">
          
          {/* Coluna do Artigo de Conteúdo */}
          <article style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>O que é o Crédito BDMG e como ele impulsiona seu caixa?</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                O Banco de Desenvolvimento de Minas Gerais (BDMG) é uma instituição financeira pública voltada ao fomento econômico de empresas sediadas no estado. Ao contrário das linhas comerciais tradicionais do varejo bancário, o crédito BDMG é subsidiado pelo governo e possui o propósito explícito de acelerar o desenvolvimento local.
              </p>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                Através da parceria estratégica com a <strong>RMJ Soluções de Crédito</strong>, sua empresa em Itajubá e região conta com um correspondente bancário oficial para organizar toda a estrutura cadastral, simular o limite máximo pré-aprovado de maneira online e assinar o contrato digital sem filas e sem a necessidade de deslocamentos físicos ou burocracias desnecessárias.
              </p>
            </div>

            {/* Semantic GEO/RAG Table: Linhas de Crédito */}
            <div className="comparison-card">
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Diferença Prática: Capital de Giro vs Investimento Fixo</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} aria-label="Comparativo das Linhas de Crédito do BDMG">
                  <caption>Comparativo de prazos, carência e destinação das linhas de crédito empresariais BDMG intermediadas pela RMJ.</caption>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--neutral-border)' }}>
                      <th scope="col" style={{ padding: '0.75rem', fontWeight: 'bold' }}>Característica</th>
                      <th scope="col" style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>Capital de Giro (Girofácil)</th>
                      <th scope="col" style={{ padding: '0.75rem', fontWeight: 'bold' }}>Investimento Fixo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <th scope="row" style={{ padding: '0.75rem', fontWeight: '600' }}>Destinação do Recurso</th>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Livre (Caixa, contas, estoque)</td>
                      <td style={{ padding: '0.75rem' }}>Obras, máquinas, inovação e ampliação</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <th scope="row" style={{ padding: '0.75rem', fontWeight: '600' }}>Carência (Meses)</th>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Até 6 meses</td>
                      <td style={{ padding: '0.75rem' }}>Até 12 meses</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <th scope="row" style={{ padding: '0.75rem', fontWeight: '600' }}>Prazo Total de Pagamento</th>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Até 48 meses</td>
                      <td style={{ padding: '0.75rem' }}>Até 72 meses (6 anos)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <th scope="row" style={{ padding: '0.75rem', fontWeight: '600' }}>Comprovação Pós-Crédito</th>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Dispensada</td>
                      <td style={{ padding: '0.75rem' }}>Mediante notas fiscais / projetos</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div id="como-funciona" style={{ scrollMarginTop: '100px' }}>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Como funciona o processo de contratação via RMJ?</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                Nosso fluxo operacional foi planejado para poupar o tempo do empresário. Dividimos o processo em etapas simples:
              </p>
              <ol style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.25rem', color: 'var(--neutral-muted)', lineHeight: '1.6' }}>
                <li><strong>Solicitação de Simulação:</strong> Você preenche os dados cadastrais básicos e CNPJ da empresa no formulário abaixo ou nos envia via WhatsApp.</li>
                <li><strong>Análise de Limite:</strong> O BDMG realiza a avaliação do histórico fiscal do CNPJ e retorna com o limite de crédito aprovado, taxas específicas de juros e opções de prazo disponíveis.</li>
                <li><strong>Assinatura do Contrato:</strong> Uma vez escolhidas as condições ideais para o seu fluxo de caixa, emitimos o contrato oficial de forma 100% digital.</li>
                <li><strong>Liberação em Conta:</strong> Com as assinaturas digitais validadas, o recurso de capital de fomento é creditado diretamente na conta PJ da empresa em até 5 dias úteis.</li>
              </ol>
            </div>

            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Critérios de Elegibilidade: Quem pode solicitar?</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                As linhas de fomento de capital de giro são voltadas especificamente para empresas com operações regulares em Minas Gerais.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1.25rem', color: 'var(--neutral-muted)', lineHeight: '1.6' }}>
                <li><strong>Enquadramento:</strong> Microempresas (ME) e Empresas de Pequeno Porte (EPP).</li>
                <li><strong>Faturamento:</strong> Faturamento bruto anual registrado de até R$ 4,8 milhões.</li>
                <li><strong>Regularidade Fiscal:</strong> O CNPJ deve estar ativo e com certidões negativas federais e estaduais regularizadas (sem débitos ativos e insolvíveis).</li>
                <li><strong>Setores:</strong> Linhas ativas para empresas de varejo, prestadores de serviços, galpões de distribuição e pequenas indústrias.</li>
              </ul>
            </div>

            {/* Perguntas Frequentes (FAQs) */}
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>Perguntas Frequentes sobre o Crédito BDMG</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>A RMJ cobra taxas extras pelo serviço de assessoria do BDMG?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Não. Nós somos correspondentes bancários credenciados do BDMG. Toda a análise, simulação e suporte à contratação são fornecidos de forma 100% gratuita para a sua empresa. Nossos honorários são remunerados diretamente pela instituição financeira parceira.
                  </p>
                </div>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Como funciona a carência de 12 meses?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    A carência significa que durante o primeiro ano de contrato a sua empresa não amortiza o valor do saldo principal emprestado. É o tempo perfeito para aplicar o capital de giro, estruturar o negócio e começar a pagar somente a partir do décimo terceiro mês.
                  </p>
                </div>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Posso quitar as parcelas do BDMG antes do prazo?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Sim. A quitação total ou amortização parcial do saldo devedor do BDMG é garantida a qualquer momento, oferecendo abatimento proporcional integral dos juros futuros.
                  </p>
                </div>
              </div>
            </div>

          </article>

          {/* Barra Lateral (Sidebar de Navegação de Serviços Relacionados) */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--neutral-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-border)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Serviços Relacionados</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link href="/pronampe" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Fomento PRONAMPE &rarr;</Link></li>
                <li><Link href="/procred-360" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>ProCred 360 ME &rarr;</Link></li>
                <li><Link href="/home-equity" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Home Equity (Garantia) &rarr;</Link></li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'var(--primary-dark)', color: '#fff', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>Fale Conosco</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                Tire suas dúvidas sobre documentos fiscais, faturamento ou taxas com o Rodrigo.
              </p>
              <a href="https://wa.me/5535991084513" target="_blank" rel="noopener noreferrer" className="btn btn-accent" style={{ width: '100%', fontSize: '0.9rem' }}>
                Falar no WhatsApp
              </a>
            </div>
          </aside>

        </div>
      </section>

      {/* 3. Seção de Simulação / LeadForm */}
      <section className={`${styles.ctaSection} section`} id="simular">
        <div className={`${styles.ctaContainer} container`}>
          <div className={styles.titleContainer}>
            <span className={styles.backLink} style={{ color: "var(--secondary-color)" }}>Simulação Gratuita</span>
            <h2>Impulsione o Caixa da sua Empresa com o BDMG</h2>
            <p className={styles.leadText} style={{ color: "var(--neutral-muted)" }}>
              Preencha os dados abaixo e nosso time credenciado analisará a linha de fomento ideal para a sua empresa.
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
