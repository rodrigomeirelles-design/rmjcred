import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Home Equity em Itajubá: Empréstimo com Garantia | RMJ",
  description: "Consiga dinheiro rápido em mãos usando seu imóvel residencial ou comercial como garantia. Prazos de até 20 anos e juros reduzidos sem precisar vender.",
};

export default function HomeEquity() {
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
              <li style={{ color: '#fff' }}>Home Equity</li>
            </ol>
          </nav>
          <h1 className={styles.title}>
            Home Equity / Crédito com <span className={styles.italicTitle}>Garantia de Imóvel</span>
          </h1>
          <p className={styles.leadText}>
            Use seu imóvel quitado (residencial ou comercial) como garantia para captar dinheiro em mãos com as menores taxas do mercado de crédito, mantendo a posse do bem.
          </p>
        </div>
      </section>

      {/* 2. Conteúdo Principal Denso */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-white)' }}>
        <div className="container page-grid">
          
          {/* Coluna do Artigo de Conteúdo */}
          <article style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>O que é o Home Equity (Crédito com Garantia de Imóvel)?</h2>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                O Home Equity é uma modalidade de crédito muito difundida nos Estados Unidos e Europa que ganha cada vez mais espaço no Brasil devido à sua inteligência financeira. Trata-se do empréstimo pessoal ou corporativo estruturado onde você oferece um imóvel de sua propriedade (casa, apartamento, sala comercial ou galpão) como garantia real da operação.
              </p>
              <p style={{ color: 'var(--neutral-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                Diferente de um financiamento imobiliário tradicional onde o recurso é obrigatoriamente destinado à compra do imóvel, no Home Equity a destinação do dinheiro é 100% livre. Você pode utilizar o recurso para injetar capital de giro em sua empresa, reestruturar dívidas de juros caros, investir na ampliação de negócios ou realizar conquistas pessoais sem precisar se desfazer do seu patrimônio.
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
              <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className="btn btn-accent" style={{ width: '100%', fontSize: '0.9rem' }}>
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
