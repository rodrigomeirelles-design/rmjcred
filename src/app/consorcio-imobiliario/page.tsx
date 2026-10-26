"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "../consorcios/page.module.css";
import LeadForm from "@/components/LeadForm";

import { useState } from "react";

export default function ConsorcioImobiliario() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const toggleFaq = (id: string) => setOpenFaq(openFaq === id ? null : id);

  const [simStep, setSimStep] = useState<1 | 2>(1);
  const [simTipo, setSimTipo] = useState("Imóvel Residencial (Casa / Apartamento)");
  const [simValor, setSimValor] = useState("");

  const faqItems = [
    {
      id: "imob-1",
      q: "Em quanto tempo minha cota de consórcio imobiliário será contemplada?",
      a: "Não existe prazo fixo nem promessa de contemplação garantida em uma data específica, pois o sistema de consórcios é regido por sorteios mensais e pela concorrência de lances em cada assembleia. No entanto, com uma análise prévia do histórico do grupo e uma estratégia estruturada de lance livre, lance fixo ou lance embutido, é possível estimar cenários realistas para o seu planejamento.",
    },
    {
      id: "imob-2",
      q: "Posso usar meu saldo do FGTS no consórcio de imóveis?",
      a: "Sim, para imóveis residenciais urbanos que atendam às normas do Conselho Curador do FGTS e da Caixa Econômica Federal. O saldo do FGTS pode ser utilizado para ofertar lance na assembleia, complementar o valor da carta de crédito no momento da compra, amortizar o saldo devedor ou abater parte das prestações após a contemplação, desde que o titular cumpra os requisitos legais do fundo.",
    },
    {
      id: "imob-3",
      q: "Como funciona o reajuste anual da carta de crédito pelo INCC?",
      a: "Para proteger o poder de compra dos consorciados diante da valorização dos imóveis e dos custos da construção civil, a carta de crédito e as parcelas sofrem reajuste anual conforme o índice previsto em contrato — geralmente o INCC (Índice Nacional de Custo da Construção) ou IPCA/IGP-M. Assim, quando você for contemplado, o valor da carta estará atualizado para adquirir o bem planejado.",
    },
    {
      id: "imob-4",
      q: "A carta de crédito imobiliário pode ser usada para comprar terreno, construir ou reformar?",
      a: "Sim. Uma vez contemplada, a cota imobiliária oferece ampla flexibilidade: você pode adquirir um imóvel residencial ou comercial pronto, comprar um imóvel na planta (quitando o saldo junto à construtora), adquirir um lote ou terreno urbanizado, construir em terreno próprio (com liberação conforme cronograma físico-financeiro de obra) ou realizar reforma e ampliação de imóvel já quitado em seu nome.",
    },
    {
      id: "imob-5",
      q: "Empresas (CNPJ) podem contratar consórcio para comprar sede própria ou galpão?",
      a: "Sim. Pessoas jurídicas utilizam o consórcio imobiliário para adquirir salas comerciais, consultórios, lojas de rua, terrenos industriais ou galpões logísticos, bem como para construir ou reformar suas instalações sem descapitalizar o fluxo de caixa nem recorrer a linhas bancárias de curto prazo.",
    },
    {
      id: "imob-6",
      q: "É seguro comprar uma carta de consórcio já contemplada?",
      a: "A transferência de uma cota já contemplada é legal, mas exige rigorosa checagem diretamente junto à administradora autorizada pelo Banco Central. É indispensável confirmar a existência real da cota, o valor líquido disponível, o saldo devedor, as taxas de transferência e a aprovação cadastral antes de realizar qualquer pagamento ao cedente.",
    },
  ];

  const relatedPosts = [
    {
      href: "/blog/como-funciona-consorcio-de-imovel",
      title: "Como Funciona o Consórcio de Imóvel: Vale a Pena Esperar pela Contemplação?",
    },
    {
      href: "/blog/diferenca-consorcio-vs-financiamento",
      title: "Consórcio vs Financiamento: Qual Escolha Favorece Seu Planejamento?",
    },
    {
      href: "/blog/como-ser-contemplado-mais-rapido-consorcio",
      title: "Como Ser Contemplado Mais Rápido no Consórcio: Estratégias de Lance",
    },
    {
      href: "/blog/consorcio-de-carros-como-funciona",
      title: "Consórcio de Carros: Como Adquirir seu Veículo sem Pagar Juros",
    },
    {
      href: "/blog/consorcio-como-investimento-patrimonial",
      title: "Consórcio como Investimento: Como Funciona a Compra de Cotas para Patrimônio",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Consórcio Imobiliário",
            "provider": {
              "@id": "https://rmjcred.com.br/#organizacao",
            },
            "areaServed": [
              { "@type": "City", "name": "Itajubá" },
              { "@type": "AdministrativeArea", "name": "Sul de Minas Gerais" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map((item) => ({
              "@type": "Question",
              "name": item.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a,
              },
            })),
          }),
        }}
      />

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/consorcios" className={styles.backLink}>
            &larr; Voltar para Consórcios
          </Link>
          <h1 className={styles.title} style={{ maxWidth: "860px" }}>
            Consórcio Imobiliário em Itajubá e Sul de Minas: Planejamento Patrimonial sem Juros
          </h1>
          <p className={styles.leadText}>
            Estruture a compra da casa própria, terreno, construção, reforma ou sede comercial da sua empresa com orientação consultiva, transparência técnica e atendimento presencial ou digital em Itajubá e em cidades num raio de 200 km.
          </p>
          <div style={{ marginTop: "0.75rem" }}>
            <Link href="/simulador-consorcio" className="btn btn-primary">
              Simular Consórcio Imobiliário Agora &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. O QUE É E VISÃO GERAL ────────────────────────── */}
      <section className={`${styles.productDetails} section`}>
        <div className={`${styles.detailsGrid} container`}>
          <div className={styles.imageWrapper}>
            <Image
              src="/assets/8354789cc4e349318167ee2bb326e75b.jpg"
              alt="Planejamento de consórcio imobiliário em Itajubá e Sul de Minas"
              width={600}
              height={450}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.infoWrapper}>
            <div>
              <h2 className={styles.categoryTitle}>O que é o Consórcio Imobiliário e como ele funciona</h2>
              <p className={styles.editorialText} style={{ marginBottom: "1rem" }}>
                O consórcio imobiliário é uma modalidade de compra planejada e autofinanciada, regulamentada pela Lei nº 11.795/2008 e fiscalizada pelo Banco Central do Brasil. Nela, pessoas físicas e jurídicas reúnem-se em um grupo organizado por uma administradora credenciada, contribuindo mensalmente para formar uma poupança comum destinada à aquisição de bens imóveis.
              </p>
              <p className={styles.editorialText} style={{ marginBottom: "1rem" }}>
                Diferentemente de um empréstimo ou financiamento bancário tradicional, no consórcio não há cobrança de juros compostos sobre o capital. O participante paga uma taxa de administração fixa, que é diluída ao longo de todo o prazo do grupo, além do fundo de reserva e eventual seguro prestamista conforme regulamento. Todos os meses, nas assembleias ordinárias, pelo menos um participante é contemplado por sorteio e outros participantes são contemplados por meio da oferta de lances.
              </p>
              <p className={styles.editorialText}>
                Na <strong>RMJ Soluções de Crédito</strong>, nosso trabalho não é simplesmente vender uma cota avulsa, mas sim atuar como consultoria financeira para famílias, investidores e empresários de <strong>Itajubá e cidades num raio de 200 km</strong> — incluindo Pouso Alegre, Santa Rita do Sapucaí, Varginha, Poços de Caldas, São Lourenço, Três Corações, Lavras e Extrema. Avaliamos o seu horizonte de tempo, sua capacidade de aporte mensal e os dados estatísticos de grupos em andamento para desenhar uma estratégia coerente, sem falsas promessas de contemplação garantida.
              </p>
              <div className={styles.meetTeamWrapper}>
                <Link href="/sobre-nos" className={styles.meetTeamLink}>
                  Conheça quem vai te atender &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. CONSÓRCIO X FINANCIAMENTO ────────────────────── */}
      <section className={`${styles.editorialSectionAlt} section`}>
        <div className="container">
          <div className={styles.editorialContainer}>
            <div className={styles.editorialBlock}>
              <span className={styles.chartBadge}>Análise Comparativa</span>
              <h2 className={styles.editorialHeading}>
                Consórcio Imobiliário x Financiamento Habitacional: Quando Escolher Cada Caminho?
              </h2>
              <p className={styles.editorialText}>
                Como a RMJ opera tanto com crédito imobiliário bancário quanto com consórcios, nossa análise é isenta e orientada exclusivamente pelo objetivo do cliente. O financiamento imobiliário e o consórcio não são concorrentes diretos, mas ferramentas financeiras desenhadas para momentos de vida e de caixa diferentes.
              </p>
              <p className={styles.editorialText}>
                Se você já encontrou o imóvel, precisa mudar imediatamente e não dispõe do valor total à vista, o financiamento habitacional tradicional cumpre esse papel ao liberar os recursos em poucas semanas após a aprovação jurídica e de engenharia. Em contrapartida, a posse imediata tem um preço elevado: a incidência de juros compostos mensais mais indexadores (como TR ou IPCA) ao longo de 20 a 35 anos faz com que o valor final pago ao banco frequentemente supere o dobro do valor original do imóvel.
              </p>
              <p className={styles.editorialText}>
                Por outro lado, quando você planeja adquirir um imóvel a médio ou longo prazo, construir uma casa personalizada, formar patrimônio para os filhos, investir em imóveis para locação ou programar a mudança da sede da sua empresa sem urgência imediata, o consórcio imobiliário preserva o seu capital. Sem a incidência de juros, o custo efetivo restringe-se à taxa administrativa diluída no período, gerando uma economia patrimonial expressiva e concedendo ao consorciado contemplado o poder de negociar descontos como comprador à vista.
              </p>

              <div className={styles.comparisonTableWrapper}>
                <table className={styles.comparisonTable}>
                  <thead>
                    <tr>
                      <th>Critério de Decisão</th>
                      <th>Consórcio Imobiliário</th>
                      <th>Financiamento Imobiliário</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Cobrança de Juros</strong></td>
                      <td>Não há juros; incide apenas taxa de administração diluída no prazo e fundo de reserva.</td>
                      <td>Juros compostos anuais somados a indexadores monetários (TR, IPCA ou poupança) e seguros obrigatórios.</td>
                    </tr>
                    <tr>
                      <td><strong>Momento de Uso do Bem</strong></td>
                      <td>Mediante contemplação por sorteio mensal ou oferta de lance vencedor nas assembleias.</td>
                      <td>Imediato após aprovação de crédito, vistoria de engenharia e registro do contrato em cartório.</td>
                    </tr>
                    <tr>
                      <td><strong>Entrada Inicial</strong></td>
                      <td>Não exige valor de entrada na adesão; o recurso próprio pode ser guardado para ofertar lance.</td>
                      <td>Normalmente exige de 20% a 30% do valor de avaliação do imóvel como entrada imediata.</td>
                    </tr>
                    <tr>
                      <td><strong>Poder de Negociação</strong></td>
                      <td>Carta contemplada equivale a pagamento à vista ao vendedor, favorecendo descontos reais.</td>
                      <td>Fluxo vinculado ao valor de avaliação bancária e ao cronograma de financiamento.</td>
                    </tr>
                    <tr>
                      <td><strong>Perfil Recomendado</strong></td>
                      <td>Planejamento de médio/longo prazo, construção, reforma, ampliação de patrimônio e sede empresarial.</td>
                      <td>Necessidade imediata de moradia ou ocupação sem possibilidade de aguardar assembleias.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. ESTRATÉGIAS DE LANCE, FGTS E CARTA CONTEMPLADA ── */}
      <section className={`${styles.editorialSection} section`}>
        <div className="container">
          <div className={styles.editorialContainer}>
            <div className={styles.editorialBlock}>
              <span className={styles.chartBadge}>Estratégia Técnica</span>
              <h2 className={styles.editorialHeading}>
                Modalidades de Lance: Lance Livre, Lance Fixo e Lance Embutido
              </h2>
              <p className={styles.editorialText}>
                Embora todos os cotistas em dia concorram em igualdade de condições nos sorteios mensais realizados pela Loteria Federal, quem deseja acelerar a contemplação pode utilizar estratégias de lance. O lance nada mais é do que a antecipação de parcelas futuras, ofertada de forma sigilosa antes de cada assembleia. Caso o seu lance seja contemplado, o valor ofertado é utilizado para abater o saldo devedor — reduzindo o valor das parcelas seguintes ou encurtando o prazo restante do plano.
              </p>

              <div className={styles.cardsGrid3}>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>1. Lance Livre</h3>
                  <p className={styles.infoCardText}>
                    O participante define livremente o percentual que deseja ofertar com recursos próprios (ou FGTS). Vence a maior oferta percentual em relação ao valor da cota naquela assembleia. A RMJ analisa a média histórica dos grupos para identificar faixas competitivas.
                  </p>
                </div>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>2. Lance Fixo</h3>
                  <p className={styles.infoCardText}>
                    A administradora estabelece em contrato um percentual fixo predeterminado (por exemplo, 25% ou 30% do crédito). Todos os participantes que ofertam esse percentual concorrem apenas entre si pelo critério de desempate do sorteio, sem precisar disputar com lances livres elevados.
                  </p>
                </div>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>3. Lance Embutido</h3>
                  <p className={styles.infoCardText}>
                    Permite utilizar uma fração da própria carta de crédito (conforme o limite do grupo, como 20% ou 30%) para compor o pagamento do lance. Se você contrata uma carta maior já prevendo esse desconto, recebe o valor líquido exato de que precisa sem desembolsar todo o lance do próprio bolso.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.editorialBlock}>
              <h2 className={styles.editorialHeading}>
                Como Usar o FGTS em Lances, Complementação e Amortização
              </h2>
              <p className={styles.editorialText}>
                Para trabalhadores com carteira assinada e saldo acumulado no Fundo de Garantia do Tempo de Serviço (FGTS), o consórcio imobiliário residencial oferece excelentes possibilidades previstas nas normas do Conselho Curador do FGTS:
              </p>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Oferta de Lance com FGTS:</strong> Você pode apresentar o extrato oficial do FGTS para ofertar até 100% do saldo da sua conta vinculada como lance. Se contemplado, o recurso é liberado diretamente da Caixa para a administradora no momento da aquisição do imóvel residencial.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Complementação do Valor da Carta:</strong> Caso a sua carta contemplada seja de R$ 350 mil e o imóvel residencial escolhido custe R$ 420 mil, você pode somar o saldo do seu FGTS à carta de crédito para completar o pagamento ao vendedor.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Amortização ou Liquidação de Saldo Devedor:</strong> Após já ter adquirido o imóvel com a cota contemplada, você pode usar o saldo do FGTS a cada dois anos para amortizar parte do saldo devedor, quitar o consórcio ou abater até 80% do valor das prestações em um período de 12 meses consecutivos.</span>
                </li>
              </ul>
              <p className={styles.editorialText}>
                Vale lembrar que o uso do FGTS exige o cumprimento das regras do SFH: o titular deve contar com no mínimo três anos de trabalho sob o regime do FGTS (consecutivos ou não), não ser proprietário de outro imóvel residencial urbano no município onde reside ou trabalha, e o imóvel adquirido deve ser residencial urbano e destinado à moradia do titular.
              </p>
            </div>

            <div className={styles.editorialBlock}>
              <h2 className={styles.editorialHeading}>
                Reajuste pelo INCC e Cuidados com Cartas Contempladas
              </h2>
              <p className={styles.editorialText}>
                Um ponto fundamental que explicamos com total transparência aos nossos clientes é o <strong>reajuste anual da carta de crédito e das parcelas</strong>. Como os grupos imobiliários possuem prazos longos (geralmente entre 120 e 240 meses), o valor da carta de crédito é corrigido anualmente — na maioria das administradoras pelo <strong>INCC (Índice Nacional de Custo da Construção)</strong> ou IPCA. Esse reajuste não é juro: a função dele é garantir que, se você contratou o equivalente ao valor de uma casa hoje, sua carta continue comprando o equivalente a essa mesma casa daqui a três, cinco ou oito anos. Caso a contemplação ocorra antes do reajuste e você ainda não tenha comprado o imóvel, o crédito contemplado passa a render aplicações financeiras diárias em favor do consorciado até a emissão do pagamento ao vendedor.
              </p>
              <div className={styles.calloutBox}>
                <p className={styles.calloutText}>
                  <strong>Atenção sobre Cartas Contempladas:</strong> É possível adquirir uma cota que já foi contemplada por outro consorciado mediante transferência formal de titularidade com anuência da administradora. Porém, o mercado informal possui muitos anúncios fraudulentos de supostas cotas contempladas inexistentes. Na RMJ, jamais prometemos contemplação garantida na venda de cotas novas e orientamos que qualquer negociação de carta contemplada seja verificada diretamente na administradora oficial antes de qualquer sinal financeiro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. APLICAÇÕES PRÁTICAS (PLANTA, TERRENO, OBRA, PJ) ── */}
      <section className={`${styles.editorialSectionAlt} section`}>
        <div className="container">
          <div className={styles.editorialContainer}>
            <div className={styles.editorialBlock}>
              <span className={styles.chartBadge}>Versatilidade de Uso</span>
              <h2 className={styles.editorialHeading}>
                Onde Utilizar Sua Carta: Imóvel na Planta, Terreno, Construção, Reforma e Sede Comercial
              </h2>
              <p className={styles.editorialText}>
                Muitos compradores imaginam que o consórcio serve apenas para comprar uma casa ou apartamento pronto. Na prática, a carta de crédito imobiliária é uma das ferramentas mais versáteis do mercado imobiliário brasileiro, permitindo que você decida a destinação exata apenas no momento em que for contemplado:
              </p>

              <div className={styles.cardsGrid2}>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>Compra na Planta e Quitação de Financiamento</h3>
                  <p className={styles.infoCardText}>
                    Adquiriu um apartamento na planta diretamente com a construtora? Você pode programar uma cota de consórcio durante o período de obras para que, na entrega das chaves (Habite-se), a carta contemplada quite o saldo devedor com a incorporadora — evitando assumir um financiamento bancário longo e oneroso. Além disso, muitas administradoras permitem usar a carta contemplada para quitar um financiamento imobiliário já existente em seu nome.
                  </p>
                </div>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>Compra de Terreno, Construção e Reforma</h3>
                  <p className={styles.infoCardText}>
                    Com a carta contemplada, você pode comprar um lote urbanizado em condomínio fechado ou bairro planejado, construir do zero em um terreno próprio (com liberação dos recursos em etapas conforme o cronograma físico-financeiro assinado pelo engenheiro) ou reformar e ampliar um imóvel que já pertença a você, valorizando seu patrimônio familiar.
                  </p>
                </div>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>Imóvel Comercial para Empresas e Profissionais</h3>
                  <p className={styles.infoCardText}>
                    Médicos, dentistas, advogados, comerciantes e indústrias de Itajubá e do Sul de Minas utilizam o consórcio imobiliário para trocar o custo perpétuo do aluguel comercial pela aquisição de salas comerciais, clínicas, lojas ou galpões industriais, estruturando a expansão física do negócio com previsibilidade de caixa.
                  </p>
                </div>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>Investimento e Renda Passiva com Locação</h3>
                  <p className={styles.infoCardText}>
                    Investidores utilizam cotas imobiliárias para construir uma carteira de imóveis voltados à locação residencial, estudantil ou comercial. Após a contemplação e compra do bem, a receita mensal do aluguel ajuda a custear as próprias parcelas restantes do grupo, acelerando a formação de patrimônio.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.editorialBlock}>
              <h2 className={styles.editorialHeading}>
                Passo a Passo da Assessoria Consultiva da RMJ do Planejamento à Escritura
              </h2>
              <p className={styles.editorialText}>
                Contratar um consórcio sem analisar a saúde financeira do grupo e as regras do contrato pode gerar frustrações. Por isso, na RMJ Soluções de Crédito aplicamos um método consultivo dividido em etapas claras, acompanhando o cliente desde o estudo de viabilidade até a liberação efetiva do crédito ao vendedor ou construtor:
              </p>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>1.</span>
                  <span><strong>Diagnóstico de Objetivo e Fluxo de Caixa:</strong> Avaliamos qual é o valor real necessário para o seu projeto imobiliário (compra de imóvel pronto, aquisição de imóvel na planta, terreno, construção, reforma ou sede comercial para CNPJ) e qual parcela mensal se encaixa com folga no seu orçamento familiar ou empresarial.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>2.</span>
                  <span><strong>Seleção Técnica do Grupo:</strong> Comparamos grupos em andamento e grupos recém-formados em administradoras sólidas e fiscalizadas pelo Banco Central. Analisamos o histórico de cortes de lances nas assembleias anteriores, o percentual permitido de lance embutido, as regras de lance fixo e o índice de reajuste anual pelo INCC.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>3.</span>
                  <span><strong>Gestão Estratégica das Assembleias e do FGTS:</strong> Após a adesão, auxiliamos você no acompanhamento mensal dos sorteios e na definição do momento mais oportuno para ofertar seu lance livre, lance fixo ou lance embutido — integrando também o saldo do FGTS quando se tratar de imóvel residencial elegível.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>4.</span>
                  <span><strong>Faturamento, Vistoria e Liberação do Crédito:</strong> Uma vez contemplada a cota, orientamos toda a etapa documental de análise de crédito, avaliação técnica do imóvel por engenharia credenciada, emissão do instrumento com alienação fiduciária, registro no Cartório de Registro de Imóveis e liberação dos recursos para o vendedor ou cronograma de obra.</span>
                </li>
              </ul>
              <p className={styles.editorialText}>
                Seja você morador de Itajubá ou de qualquer município num raio de 200 km no Sul de Minas Gerais, nossa equipe oferece atendimento próximo, ético e transparente para que o consórcio imobiliário funcione como uma alavanca real de construção de patrimônio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. GRÁFICO COMPARATIVO ────────────────────────────── */}
      <section className={`${styles.chartSection} section`}>
        <div className="container">
          <div className={styles.chartGrid}>
            <div className={styles.chartWrapper}>
              <h3 className={styles.chartTitle}>Taxa Administrativa Consórcio x Juros Financiamento (Bancos)</h3>
              <div className={styles.chartLegend}>
                <span className={styles.legendConsorcio}>■ Consórcio</span>
                <span className={styles.legendBancos}>■ Bancos</span>
              </div>
              <div className={styles.chartBars}>
                <div className={styles.chartCategory}>
                  <div className={styles.categoryBars}>
                    <div className={styles.barGroup}>
                      <div className={styles.barLabelTop}>1% a.a.</div>
                      <div className={styles.barConsorcio} style={{ height: "20px" }} />
                    </div>
                    <div className={styles.barGroup}>
                      <div className={styles.barLabelTop} style={{ color: "#94A3B8" }}>8% a.a.</div>
                      <div className={styles.barFinanciamento} style={{ height: "100px" }} />
                    </div>
                  </div>
                  <div className={styles.categoryLabel}>Imobiliário</div>
                </div>

                <div className={styles.chartCategory}>
                  <div className={styles.categoryBars}>
                    <div className={styles.barGroup}>
                      <div className={styles.barLabelTop}>2% a.a.</div>
                      <div className={styles.barConsorcio} style={{ height: "30px" }} />
                    </div>
                    <div className={styles.barGroup}>
                      <div className={styles.barLabelTop} style={{ color: "#94A3B8" }}>22% a.a.</div>
                      <div className={styles.barFinanciamento} style={{ height: "240px" }} />
                    </div>
                  </div>
                  <div className={styles.categoryLabel}>Veículo</div>
                </div>
              </div>
              <p className={styles.chartNote}>
                Fonte: [PREENCHER fonte e data]. Taxa de administração convertida para valor anual equivalente.
              </p>
            </div>

            <div className={styles.chartText}>
              <span className={styles.chartBadge}>Compare</span>
              <h2 className={styles.chartHeading}>Planejamento inteligente para preservar o seu capital</h2>
              <div style={{ margin: "1.5rem 0 1rem 0" }}>
                <Image src="/assets/ademicon.svg" alt="Ademicon - Maior administradora independente do Brasil" width={220} height={45} />
              </div>
              <p>
                Estruture seu consórcio imobiliário com administradoras sólidas e fiscalizadas pelo Banco Central, contando com acompanhamento próximo da RMJ em Itajubá e em todo o Sul de Minas (raio de 200 km).
              </p>
              <p style={{ marginTop: "1rem" }}>
                Fonte: [PREENCHER fonte e data]. Taxa de administração convertida para valor anual equivalente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ACORDEÃO (6 PERGUNTAS) ─────────────────────── */}
      <section className={`${styles.faqSection} section`}>
        <div className="container">
          <div className={styles.howHeader}>
            <h2 className={styles.howTitle} style={{ color: "var(--primary-dark)" }}>
              Perguntas Frequentes sobre Consórcio Imobiliário
            </h2>
            <p className={styles.howSubtitle} style={{ color: "var(--neutral-muted)" }}>
              Respostas claras e diretas sobre contemplação, FGTS, lances, reajuste pelo INCC e uso da carta
            </p>
          </div>

          <div className={styles.faqGroup}>
            {faqItems.map((item) => (
              <div key={item.id} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={openFaq === item.id}
                >
                  <span>{item.q}</span>
                  <span className={`${styles.faqChevron} ${openFaq === item.id ? styles.faqChevronOpen : ""}`}>
                    ▾
                  </span>
                </button>
                {openFaq === item.id && (
                  <div className={styles.faqAnswer}>
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7.5. DEPOIMENTOS ─────────────────────────────────── */}


      {/* ── 8. LEIA TAMBÉM (BLOG) ─────────────────────────────── */}
      <section className={`${styles.relatedSection} section`}>
        <div className="container">
          <div className={styles.howHeader} style={{ marginBottom: "2rem" }}>
            <span className={styles.chartBadge}>Conteúdo Educativo</span>
            <h2 className={styles.howTitle} style={{ color: "var(--primary-dark)", marginTop: "0.5rem" }}>
              Leia também
            </h2>
            <p className={styles.howSubtitle} style={{ color: "var(--neutral-muted)" }}>
              Artigos recomendados sobre consórcio imobiliário, comparativos e estratégias de contemplação
            </p>
          </div>

          <div className={styles.relatedGrid}>
            {relatedPosts.map((post) => (
              <Link key={post.href} href={post.href} className={styles.relatedCard}>
                <div>
                  <span className={styles.relatedTag}>Artigo do Blog</span>
                  <h3 className={styles.relatedTitle} style={{ marginTop: "0.4rem" }}>
                    {post.title}
                  </h3>
                </div>
                <span className={styles.relatedReadMore}>Ler artigo completo &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. SIMULADOR ─────────────────────────────────────── */}
      <section className={`${styles.ctaSection} section`} id="simular">
        <div className={`${styles.ctaContainer} container`}>
          <div className={styles.titleContainer}>
            <span className={styles.simBadge}>Diagnóstico Gratuito</span>
            <h2 className={styles.simHeading}>Simule seu Consórcio Imobiliário</h2>
            <p className={styles.leadText} style={{ color: "#475569" }}>
              Informe seu objetivo e o valor estimado da carta de crédito. Nossa equipe em Itajubá preparará um estudo comparativo de grupos, prazos e lances para o seu projeto.
            </p>
            <div style={{ marginTop: "1rem" }}>
              <Link href="/simulador-consorcio" className={styles.simBtn} style={{ display: "inline-block", textAlign: "center", textDecoration: "none" }}>
                Abrir Simulador de Consórcio em Etapas →
              </Link>
            </div>

            {simStep === 1 && (
              <div className={styles.simCard}>
                <p className={styles.simStepLabel}>Etapa 1 de 2 — Qual é o seu objetivo imobiliário?</p>
                <div className={styles.simField}>
                  <label className={styles.simLabel}>Finalidade</label>
                  <select
                    className={styles.simSelect}
                    value={simTipo}
                    onChange={(e) => setSimTipo(e.target.value)}
                  >
                    <option>Imóvel Residencial (Casa / Apartamento)</option>
                    <option>Compra de Terreno ou Construção</option>
                    <option>Reforma ou Ampliação</option>
                    <option>Imóvel Comercial / Galpão para Empresa</option>
                    <option>Investimento Patrimonial</option>
                  </select>
                </div>
                <div className={styles.simField}>
                  <label className={styles.simLabel}>Valor desejado da carta (R$)</label>
                  <input
                    type="text"
                    className={styles.simInput}
                    placeholder="Ex: R$ 350.000,00"
                    value={simValor}
                    onChange={(e) => setSimValor(e.target.value)}
                  />
                </div>
                <button
                  className={styles.simBtn}
                  onClick={() => simValor.trim() && setSimStep(2)}
                >
                  Continuar Simulação →
                </button>
              </div>
            )}

            {simStep === 2 && (
              <div className={styles.simCard}>
                <p className={styles.simStepLabel}>Etapa 2 de 2 — Seus dados de contato</p>
                <button
                  className={styles.simBackBtn}
                  onClick={() => setSimStep(1)}
                >
                  ← Voltar e alterar
                </button>
                <div className={styles.simSummary}>
                  <span>🏠 {simTipo}</span>
                  <span>💰 {simValor}</span>
                </div>
              </div>
            )}
          </div>

          {simStep === 2 && (
            <div>
              <LeadForm
                defaultService={`Consórcio Imobiliário — ${simTipo}`}
                defaultValor={simValor}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
