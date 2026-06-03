import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Crédito Imobiliário e Lotes em Itajubá | RMJ",
  description: "Compre seu imóvel comercial, residencial ou lote com a menor taxa de juros. Simulamos e aprovamos seu crédito imobiliário rapidamente nos maiores bancos.",
};

export default function CreditoImovel() {
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
              <li style={{ color: '#fff' }}>Crédito Imobiliário</li>
            </ol>
          </nav>
          <h1 className={styles.title}>
            Crédito e Financiamento <span className={styles.italicTitle}>Imobiliário</span> em Itajubá
          </h1>
          <p className={styles.leadText}>
            Adquira seu imóvel residencial, comercial ou lote com a assessoria independente da RMJ. Pesquisamos e aprovamos a menor taxa de juros em todos os grandes bancos nacionais.
          </p>
        </div>
      </section>

      {/* 2. Conteúdo Principal Denso */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-white)' }}>
        <div className="container page-grid">
          
          {/* Coluna do Artigo de Conteúdo */}
          <article style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Como a RMJ acelera sua aprovação de Crédito Imobiliário?</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                Comprar um imóvel é uma das decisões mais importantes da vida de uma pessoa ou do planejamento estratégico de expansão de uma empresa. No entanto, lidar diretamente com gerentes de bancos em busca das melhores taxas de juros é cansativo, demorado e muitas vezes resulta em taxas de juros inflacionadas e imposições de seguros e vendas casadas.
              </p>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                A <strong>RMJ Soluções de Crédito</strong> funciona como uma assessoria imobiliária independente. Conectamos seu perfil de renda com mais de 150 instituições financeiras e simulamos simultaneamente nos maiores bancos nacionais — como Caixa Econômica Federal, Itaú, Bradesco, Santander e Banco do Brasil. Cuidamos de todo o processo documental digital para você do início até a assinatura da escritura.
              </p>
            </div>

            {/* Comparativo de Sistemas de Amortização */}
            <div className="comparison-card">
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>SAC vs Price: Escolha o Modelo Ideal</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--neutral-border)' }}>
                      <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Característica</th>
                      <th style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>Tabela SAC (Sistema de Amortização Constante)</th>
                      <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Tabela PRICE (Sistema Francês)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Comportamento das Parcelas</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Decrescentes (iniciam maiores e diminuem)</td>
                      <td style={{ padding: '0.75rem' }}>Constantes (fixas do início ao fim)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Amortização do Saldo Devedor</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Rápida desde o início do financiamento</td>
                      <td style={{ padding: '0.75rem' }}>Lenta nos primeiros anos</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Custo Total de Juros</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Menor custo financeiro total de juros acumulados</td>
                      <td style={{ padding: '0.75rem' }}>Maior custo de juros ao fim do prazo</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--neutral-border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>Recomendação</strong></td>
                      <td style={{ padding: '0.75rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Para quem busca economia a longo prazo</td>
                      <td style={{ padding: '0.75rem' }}>Para quem precisa de parcelas iniciais menores</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Modalidades de Crédito Imobiliário Atendidas</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                Seja qual for o seu objetivo de aquisição, possuímos linhas de fomento adequadas para cada cenário:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.25rem', color: 'var(--neutral-muted)', lineHeight: '1.6' }}>
                <li><strong>Financiamento Residencial:</strong> Compra de casas ou apartamentos novos ou usados com a possibilidade de financiar até 80% do valor avaliado do imóvel.</li>
                <li><strong>Imóvel Comercial:</strong> Crédito dedicado a profissionais liberais, médicos, advogados e comerciantes para aquisição de escritórios, consultórios ou galpões comerciais.</li>
                <li><strong>Lotes e Terrenos Urbanos:</strong> Financiamento do lote desejado em loteamentos ou condomínios fechados, inclusive com planos associados para financiamento da construção.</li>
                <li><strong>Uso do FGTS:</strong> Suporte completo para utilização de saldos de FGTS para amortizar parcelas, quitar contratos ou compor o valor exigido de entrada.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Passo a Passo da Aprovação do Imóvel</h2>
              <ol style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.25rem', color: 'var(--neutral-muted)', lineHeight: '1.6' }}>
                <li><strong>Simulação Comparada:</strong> Enviamos uma estimativa detalhada das parcelas e taxas comparadas dos maiores bancos com base na sua renda familiar.</li>
                <li><strong>Aprovação de Crédito:</strong> Submetemos a pasta digital com seus documentos aos bancos escolhidos para aprovação de carta de crédito.</li>
                <li><strong>Avaliação do Imóvel:</strong> Um engenheiro credenciado pelo banco faz a vistoria física e laudo do imóvel pretendido.</li>
                <li><strong>Escritura e Liberação:</strong> Com a documentação validada jurídica e fisicamente, o contrato é emitido para assinatura e registro em cartório, efetuando o pagamento ao vendedor.</li>
              </ol>
            </div>

            {/* FAQs */}
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>Perguntas Frequentes sobre Crédito Imobiliário</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Qual o valor de entrada mínimo exigido no financiamento imobiliário?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Em geral, os bancos financiam até o limite máximo de 80% do valor avaliado do imóvel. Logo, é exigido um valor de entrada de ao menos 20% do valor do bem. Este valor de entrada pode ser composto utilizando o saldo total do seu FGTS, caso preencha os requisitos do SFH.
                  </p>
                </div>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Como compor renda familiar para aprovação do crédito?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    É possível somar a renda de cônjuges, parceiros em união estável, pais, filhos e, em algumas instituições parceiras, até mesmo de terceiros sem grau de parentesco para aumentar o limite máximo aprovado de crédito.
                  </p>
                </div>
                <div style={{ borderBottom: '1px solid var(--neutral-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>O que é o Custo Efetivo Total (CET)?</h4>
                  <p style={{ color: 'var(--neutral-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    O CET é a taxa real consolidada que você pagará. Ele engloba não apenas a taxa de juros nominal do financiamento, mas todas as taxas de administração bancária mensal, seguros de morte ou invalidez permanente (MIP) e danos físicos ao imóvel (DFI), além de impostos (IOF). Nós sempre focamos em reduzir o CET final.
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
                <li><Link href="/home-equity" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Home Equity (Garantia) &rarr;</Link></li>
                <li><Link href="/consorcios" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Consórcios Imobiliários &rarr;</Link></li>
                <li><Link href="/credito-bdmg" style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>Capital de Giro BDMG &rarr;</Link></li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'var(--primary-dark)', color: '#fff', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>Simule Conosco</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                Consulte as taxas e simule em todos os bancos do mercado pelo WhatsApp com o Rodrigo.
              </p>
              <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className="btn btn-accent" style={{ width: '100%', fontSize: '0.9rem' }}>
                Chamar no WhatsApp
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
            <h2>Compre seu Imóvel com a Menor Taxa de Juros</h2>
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
