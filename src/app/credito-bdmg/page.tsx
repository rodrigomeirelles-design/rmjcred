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
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
            <ol style={{ display: 'flex', listStyle: 'none', gap: '0.5rem', padding: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
              <li><Link href="/" style={{ color: 'inherit' }}>Início</Link></li>
              <li>/</li>
              <li style={{ color: '#fff' }}>Crédito BDMG</li>
            </ol>
          </nav>
          <h1 className={styles.title}>
            Capital de Giro <span className={styles.italicTitle}>BDMG</span> em Itajubá
          </h1>
          <p className={styles.leadText}>
            Impulsione o caixa da sua micro ou pequena empresa através de linhas de fomento do Banco de Desenvolvimento de Minas Gerais. O crédito inteligente com até 12 meses de carência e taxas abaixo dos bancos tradicionais.
          </p>
        </div>
      </section>

      {/* 2. Conteúdo Principal Denso */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-white)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '4rem' }}>
          
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

            {/* Comparativo de Taxas e Vantagens */}
            <div style={{ margin: '2rem 0', padding: '2rem', backgroundColor: 'var(--neutral-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-border)' }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Diferença Prática: BDMG vs Bancos Tradicionais</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--neutral-border)' }}>
                      <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Benefício</th>
                      <th style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>Fomento BDMG (Via RMJ)</th>
                      <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Bancos Comerciais</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Carência para 1º pagamento</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Até 12 meses</td>
                      <td style={{ padding: '0.75rem' }}>Imediata (30 a 60 dias)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Prazo de Pagamento</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Até 72 meses (6 anos)</td>
                      <td style={{ padding: '0.75rem' }}>Máximo de 36 a 48 meses</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Venda Casada</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Inexistente (0% de taxa extra)</td>
                      <td style={{ padding: '0.75rem' }}>Exigência de seguros ou cartões</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Destinação do Recurso</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Livre (Capital de Giro Limpo)</td>
                      <td style={{ padding: '0.75rem' }}>Muitas vezes exige justificativa comercial</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
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
              <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className="btn btn-accent" style={{ width: '100%', fontSize: '0.9rem' }}>
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
