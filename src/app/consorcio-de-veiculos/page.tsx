"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "../consorcios/page.module.css";
import LeadForm from "@/components/LeadForm";
import { useState } from "react";

export default function ConsorcioDeVeiculos() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const toggleFaq = (id: string) => setOpenFaq(openFaq === id ? null : id);

  const [simStep, setSimStep] = useState<1 | 2>(1);
  const [simTipo, setSimTipo] = useState("Carros de Passeio e Utilitários (Novos ou Seminovos)");
  const [simValor, setSimValor] = useState("");

  const faqItems = [
    {
      id: "veic-1",
      q: "Posso comprar um carro seminovo ou usado com a carta de consórcio?",
      a: "Sim. Ao ser contemplado, você não fica restrito a veículos zero-quilômetro nem a uma única marca. É possível adquirir carros, motos, utilitários ou caminhões seminovos tanto em concessionárias e lojas multimarcas quanto diretamente de um vendedor particular, respeitando apenas o limite de tempo de fabricação e os critérios de vistoria estabelecidos no regulamento da administradora.",
    },
    {
      id: "veic-2",
      q: "Como funciona o lance embutido no consórcio de veículos?",
      a: "O lance embutido permite utilizar um percentual da própria carta de crédito (conforme as regras do grupo, como 20% ou 30%) para pagar o lance na assembleia, sem precisar tirar todo o valor do bolso. Se você planeja precisar de R$ 100 mil líquidos para comprar o carro, nossa equipe dimensiona uma carta proporcionalmente superior para que, mesmo descontando o lance embutido, o valor líquido liberado atenda exatamente à sua compra.",
    },
    {
      id: "veic-3",
      q: "Posso usar meu veículo usado atual como lance no consórcio?",
      a: "Na prática, você pode continuar rodando com o seu veículo atual enquanto participa do grupo e, ao negociar a troca em uma concessionária ou revenda no momento da contemplação (ou ao vendê-lo a um particular), utilizar o valor apurado como lance livre para antecipar sua contemplação ou complementar a compra de um modelo superior.",
    },
    {
      id: "veic-4",
      q: "Como funciona o reajuste da carta de crédito de veículos?",
      a: "Para evitar que a valorização dos veículos corroa o seu poder de compra ao longo do plano, o valor da carta de crédito e as parcelas passam por atualização anual conforme o índice previsto em contrato (como IPCA, INPC ou tabela de referência do fabricante). Dessa forma, o consorciado mantém o poder de aquisição atualizado até o momento da contemplação.",
    },
    {
      id: "veic-5",
      q: "Empresas e produtores rurais podem adquirir caminhões, máquinas agrícolas e frotas pelo consórcio?",
      a: "Sim. O consórcio de pesados e frota é amplamente utilizado por transportadoras, comércios, prestadores de serviços e produtores rurais do Sul de Minas para adquirir caminhões, furgões, tratores, colheitadeiras, implementos agrícolas e frotas corporativas sem comprometer o capital de giro da operação com juros bancários elevados.",
    },
    {
      id: "veic-6",
      q: "Existe garantia de contemplação no primeiro mês ou vale a pena comprar carta contemplada?",
      a: "Nenhuma administradora ou consultoria séria promete contemplação garantida em data fixa em cotas novas, pois as assembleias dependem de sorteio pela Loteria Federal e da livre concorrência de lances. Já a aquisição de uma carta que já foi contemplada por terceiro é permitida mediante transferência formal na administradora, mas requer auditoria prévia rigorosa da cota antes de qualquer pagamento para evitar fraudes.",
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
            "name": "Consórcio de Veículos",
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
            Consórcio de Veículos em Itajubá e Sul de Minas: Carros, Motos, Caminhões e Frota sem Juros
          </h1>
          <p className={styles.leadText}>
            Planeje a compra ou troca do seu veículo novo ou seminovo, motocicleta, caminhão, máquina agrícola ou frota empresarial com acompanhamento consultivo em Itajubá e em cidades num raio de 200 km.
          </p>
        </div>
      </section>

      {/* ── 2. VISÃO GERAL E MODALIDADES ────────────────────── */}
      <section className={`${styles.productDetails} section`}>
        <div className={`${styles.detailsGrid} container`}>
          <div className={styles.imageWrapper}>
            <Image
              src="/assets/happy_family_car.png"
              alt="Consórcio de veículos novos e seminovos em Itajubá e Sul de Minas"
              width={600}
              height={450}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.infoWrapper}>
            <div>
              <h2 className={styles.categoryTitle}>Como funciona o Consórcio de Veículos, Pesados e Frota</h2>
              <p className={styles.editorialText} style={{ marginBottom: "1rem" }}>
                A troca programada de um automóvel, a compra da primeira motocicleta ou a expansão da frota de uma empresa costumam esbarrar em um obstáculo recorrente no Brasil: o custo elevado dos juros compostos nos financiamentos automotivos tradicionais. Quando não há urgência imediata de retirar o veículo no mesmo dia, o consórcio de veículos permite substituir os juros bancários por uma taxa de administração fixa e diluída ao longo do prazo do grupo.
              </p>
              <p className={styles.editorialText} style={{ marginBottom: "1rem" }}>
                No consórcio automotivo e de pesados, a carta de crédito contemplada — seja por sorteio mensal pela Loteria Federal, seja pela oferta de lance vencedor — confere ao titular poder de compra à vista. Isso significa liberdade para negociar descontos em concessionárias de qualquer marca, adquirir veículos seminovos em revendas multimarcas ou fechar negócio diretamente com um proprietário particular.
              </p>
              <p className={styles.editorialText}>
                Com sede em <strong>Itajubá</strong> e atendimento especializado para pessoas físicas, produtores rurais e empresas em um <strong>raio de 200 km no Sul de Minas</strong> (Pouso Alegre, Santa Rita do Sapucaí, Varginha, Poços de Caldas, São Lourenço, Lavras, Três Corações e Extrema), a <strong>RMJ Soluções de Crédito</strong> analisa o perfil de cada grupo antes da adesão — avaliando prazos, regras de lance embutido, histórico de assembleias e idade aceita para veículos seminovos, sempre com transparência e sem prometer contemplação garantida.
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

      {/* ── 3. CATEGORIAS DE VEÍCULOS ATENDIDAS ─────────────── */}
      <section className={`${styles.editorialSectionAlt} section`}>
        <div className="container">
          <div className={styles.editorialContainer}>
            <div className={styles.editorialBlock}>
              <span className={styles.chartBadge}>Abrangência Completa</span>
              <h2 className={styles.editorialHeading}>
                Carros, Motos, Caminhões, Máquinas Agrícolas e Frota Empresarial
              </h2>
              <p className={styles.editorialText}>
                O consórcio automotivo moderno vai muito além do carro zero-quilômetro de passeio. As administradoras parceiras da RMJ estruturam grupos específicos para diferentes faixas de crédito e categorias de bens móveis:
              </p>

              <div className={styles.cardsGrid2}>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>Carros de Passeio, SUVs e Utilitários Leves</h3>
                  <p className={styles.infoCardText}>
                    Ideal para famílias e profissionais liberais que planejam a compra do primeiro automóvel ou a troca programada do carro atual a cada dois ou três anos. Você continua utilizando o seu veículo normalmente enquanto participa das assembleias e, ao ser contemplado, soma a carta de crédito ao valor de venda do seu usado para subir de categoria sem pagar juros.
                  </p>
                </div>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>Motocicletas Urbanas, Trabalho e Alta Cilindrada</h3>
                  <p className={styles.infoCardText}>
                    Excelente alternativa para quem busca economia no deslocamento diário, profissionais de entrega e transporte, ou entusiastas de motocicletas de média e alta cilindrada, onde as taxas de financiamento tradicional costumam ser ainda mais restritivas.
                  </p>
                </div>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>Caminhões, Ônibus e Implementos Rodoviários</h3>
                  <p className={styles.infoCardText}>
                    Transportadores autônomos e empresas de logística utilizam grupos de veículos pesados para adquirir caminhões leves, semipesados, extrapesados, cavalos mecânicos, carretas, baús frigoríficos e vans com prazos mais extensos e parcelas compatíveis com a geração de receita do frete.
                  </p>
                </div>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>Máquinas Agrícolas e Renovação de Frota (CNPJ)</h3>
                  <p className={styles.infoCardText}>
                    Produtores rurais e agroindústrias do Sul de Minas podem planejar a aquisição de tratores, pulverizadores, colheitadeiras e implementos agrícolas. Já empresas comerciais e prestadoras de serviços utilizam múltiplas cotas para criar um calendário contínuo de renovação de frota corporativa sem descapitalizar o caixa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. SEMINOVOS, LANCE EMBUTIDO, REAJUSTE E CARTA CONTEMPLADA ── */}
      <section className={`${styles.editorialSection} section`}>
        <div className="container">
          <div className={styles.editorialContainer}>
            <div className={styles.editorialBlock}>
              <span className={styles.chartBadge}>Regras Práticas</span>
              <h2 className={styles.editorialHeading}>
                Compra de Veículos Seminovos: Concessionária, Loja ou Particular
              </h2>
              <p className={styles.editorialText}>
                Uma das maiores vantagens financeiras do consórcio de veículos é a possibilidade de comprar um <strong>veículo seminovo ou usado</strong>, evitando a depreciação mais acentuada que ocorre logo nos primeiros anos de um carro zero-quilômetro. Ao ser contemplado, você tem liberdade para escolher o veículo em concessionárias, lojas de seminovos ou diretamente de uma pessoa física (compra entre particulares).
              </p>
              <p className={styles.editorialText}>
                Para garantir a segurança jurídica da operação e a integridade da garantia fiduciária, a administradora realiza uma vistoria prévia e verifica o tempo de fabricação do veículo (em geral, grupos automotivos aceitam veículos com até 5, 7 ou 10 anos de fabricação no momento do faturamento, variando conforme o regulamento do grupo escolhido). O pagamento é efetuado diretamente na conta do vendedor após a emissão do documento de transferência com o registro da alienação fiduciária.
              </p>
            </div>

            <div className={styles.editorialBlock}>
              <h2 className={styles.editorialHeading}>
                Estratégia de Lance Embutido, Lance Livre e Lance Fixo
              </h2>
              <p className={styles.editorialText}>
                Para quem deseja antecipar a retirada do veículo sem depender exclusivamente dos sorteios mensais, a estruturação correta do lance antes mesmo de assinar o contrato faz toda a diferença:
              </p>
              <div className={styles.cardsGrid3}>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>Lance Embutido</h3>
                  <p className={styles.infoCardText}>
                    Permite descontar parte da própria carta de crédito (por exemplo, até 20% ou 30%, conforme o grupo) para ofertar como lance. Se você precisa de R$ 80 mil líquidos para comprar um seminovo, contratamos uma cota superior já calculando a dedução do lance embutido.
                  </p>
                </div>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>Lance Livre com Recurso ou Usado</h3>
                  <p className={styles.infoCardText}>
                    Você oferta um percentual utilizando economias próprias ou o valor apurado na venda do seu veículo atual. Também é possível combinar recursos próprios com o percentual de lance embutido permitido pelo grupo para aumentar a competitividade da sua oferta.
                  </p>
                </div>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>Lance Fixo</h3>
                  <p className={styles.infoCardText}>
                    Modalidade em que o consorciado oferta exatamente o percentual fixo definido no regulamento do grupo, disputando a contemplação apenas com os participantes que aderiram à mesma faixa, por critério objetivo de sorteio.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.editorialBlock}>
              <h2 className={styles.editorialHeading}>
                Reajuste da Carta de Crédito e Cuidados com Carta Contemplada
              </h2>
              <p className={styles.editorialText}>
                Durante o prazo do grupo, o valor da carta de crédito e as prestações mensais passam por reajuste periódico (normalmente anual, pelo IPCA, INPC ou índice contratual de referência do setor automotivo). Esse mecanismo protege o poder de compra do participante: se o preço médio dos automóveis e caminhões subir ao longo dos meses, a sua carta acompanha essa atualização para que você não perca capacidade de compra quando for contemplado.
              </p>
              <p className={styles.editorialText}>
                Além disso, caso o veículo escolhido após a contemplação tenha valor ligeiramente inferior ao total da sua carta de crédito, o regulamento de grande parte das administradoras permite utilizar um percentual do crédito remanescente (frequentemente até 10%) para custear despesas de documentação, transferência no Detran, IPVA ou seguro automotivo, ou ainda utilizar a diferença para abater o próprio saldo devedor.
              </p>
              <div className={styles.calloutBox}>
                <p className={styles.calloutText}>
                  <strong>Carta Contemplada de Veículos — Como Analisar com Segurança:</strong> A compra de uma cota já contemplada mediante transferência oficial na administradora é um procedimento legítimo para quem busca agilidade, mas requer cautela redobrada. Nunca realize depósitos adiantados a vendedores informais que prometem liberação imediata sem comprovação. Na RMJ, orientamos nossos clientes a validar a titularidade, a ata de contemplação e as exigências de análise de crédito diretamente na administradora fiscalizada pelo Banco Central.
                </p>
              </div>
            </div>

            <div className={styles.editorialBlock}>
              <h2 className={styles.editorialHeading}>
                Consórcio de Veículos x Financiamento Automotivo: Comparativo Prático
              </h2>
              <p className={styles.editorialText}>
                Muitos motoristas e gestores de frota acostumaram-se a trocar de veículo recorrendo automaticamente ao financiamento tradicional nas concessionárias, sem perceber o impacto dos juros compostos, do IOF (Imposto sobre Operações Financeiras) e das tarifas de cadastro sobre o Custo Efetivo Total (CET) da operação. Quando há planejamento prévio, o consórcio altera completamente essa equação:
              </p>

              <div className={styles.comparisonTableWrapper}>
                <table className={styles.comparisonTable}>
                  <thead>
                    <tr>
                      <th>Critério</th>
                      <th>Consórcio de Veículos e Pesados</th>
                      <th>Financiamento Automotivo Tradicional</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Custo da Operação</strong></td>
                      <td>Sem juros e sem IOF; incide apenas a taxa de administração diluída no prazo e o fundo de reserva.</td>
                      <td>Juros compostos mensais, cobrança de IOF na contratação e tarifas bancárias no CET.</td>
                    </tr>
                    <tr>
                      <td><strong>Bens Aceitos</strong></td>
                      <td>Carros zero-km ou seminovos, motos, caminhões, utilitários, máquinas agrícolas e frota empresarial.</td>
                      <td>Foco em veículos individuais; taxas costumam subir conforme a idade do veículo usado.</td>
                    </tr>
                    <tr>
                      <td><strong>Poder de Compra</strong></td>
                      <td>Ao ser contemplado, equivale a pagamento à vista em qualquer concessionária, loja ou particular.</td>
                      <td>Vinculado à aprovação específica da financeira para aquele chassi e vendedor.</td>
                    </tr>
                    <tr>
                      <td><strong>Planejamento de Frota (PJ)</strong></td>
                      <td>Permite programar a renovação periódica de múltiplos veículos sem pressionar o capital de giro.</td>
                      <td>Compromete linhas bancárias de curto prazo e reduz o limite de crédito operacional da empresa.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className={styles.editorialSubheading}>
                Como a RMJ Acompanha Você em Itajubá e num Raio de 200 km
              </h3>
              <p className={styles.editorialText}>
                Na RMJ Soluções de Crédito, atuamos de ponta a ponta: começamos entendendo se você busca um automóvel de passeio, uma motocicleta, um caminhão rodoviário, um trator ou a renovação da frota da sua empresa. A partir disso, selecionamos grupos com histórico consistente de contemplações, explicamos detalhadamente o funcionamento do reajuste anual da carta e estruturamos a melhor estratégia de lance livre, lance fixo ou lance embutido. Quando a sua cota é contemplada, damos todo o suporte na apresentação dos documentos, na vistoria do veículo novo ou seminovo e no faturamento ágil junto ao vendedor, atendendo clientes em Itajubá e em todas as cidades num raio de 200 km no Sul de Minas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. GRÁFICO COMPARATIVO ────────────────────────────── */}
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
              <h2 className={styles.chartHeading}>Troque seu veículo ou renove sua frota com inteligência financeira</h2>
              <div style={{ margin: "1.5rem 0 1rem 0" }}>
                <Image src="/assets/ademicon.svg" alt="Ademicon - Maior administradora independente do Brasil" width={220} height={45} />
              </div>
              <p>
                Conte com a assessoria consultiva da RMJ Soluções de Crédito em Itajubá e em cidades num raio de 200 km no Sul de Minas para comparar grupos de veículos leves, motos, caminhões e maquinário agrícola.
              </p>
              <p style={{ marginTop: "1rem" }}>
                Fonte: [PREENCHER fonte e data]. Taxa de administração convertida para valor anual equivalente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ACORDEÃO (6 PERGUNTAS) ─────────────────────── */}
      <section className={`${styles.faqSection} section`}>
        <div className="container">
          <div className={styles.howHeader}>
            <h2 className={styles.howTitle} style={{ color: "var(--primary-dark)" }}>
              Perguntas Frequentes sobre Consórcio de Veículos
            </h2>
            <p className={styles.howSubtitle} style={{ color: "var(--neutral-muted)" }}>
              Tire suas dúvidas sobre compra de seminovos, lance embutido, reajuste da carta, frota empresarial e contemplação
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

      {/* ── 7. LEIA TAMBÉM (BLOG) ─────────────────────────────── */}
      <section className={`${styles.relatedSection} section`}>
        <div className="container">
          <div className={styles.howHeader} style={{ marginBottom: "2rem" }}>
            <span className={styles.chartBadge}>Conteúdo Educativo</span>
            <h2 className={styles.howTitle} style={{ color: "var(--primary-dark)", marginTop: "0.5rem" }}>
              Leia também
            </h2>
            <p className={styles.howSubtitle} style={{ color: "var(--neutral-muted)" }}>
              Artigos recomendados sobre consórcio de carros, comparativo com financiamento e estratégias de lance
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

      {/* ── 8. SIMULADOR ─────────────────────────────────────── */}
      <section className={`${styles.ctaSection} section`} id="simular">
        <div className={`${styles.ctaContainer} container`}>
          <div className={styles.titleContainer}>
            <span className={styles.simBadge}>Diagnóstico Gratuito</span>
            <h2 className={styles.simHeading}>Simule seu Consórcio de Veículos</h2>
            <p className={styles.leadText} style={{ color: "#475569" }}>
              Selecione a categoria de veículo e o valor desejado da carta de crédito para receber uma análise personalizada de grupos e prazos.
            </p>

            {simStep === 1 && (
              <div className={styles.simCard}>
                <p className={styles.simStepLabel}>Etapa 1 de 2 — Qual veículo você planeja adquirir?</p>
                <div className={styles.simField}>
                  <label className={styles.simLabel}>Categoria de veículo</label>
                  <select
                    className={styles.simSelect}
                    value={simTipo}
                    onChange={(e) => setSimTipo(e.target.value)}
                  >
                    <option>Carros de Passeio e Utilitários (Novos ou Seminovos)</option>
                    <option>Motocicletas</option>
                    <option>Caminhões e Pesados</option>
                    <option>Máquinas e Implementos Agrícolas</option>
                    <option>Renovação / Ampliação de Frota (PJ)</option>
                  </select>
                </div>
                <div className={styles.simField}>
                  <label className={styles.simLabel}>Valor desejado da carta (R$)</label>
                  <input
                    type="text"
                    className={styles.simInput}
                    placeholder="Ex: R$ 120.000,00"
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
                  <span>🚗 {simTipo}</span>
                  <span>💰 {simValor}</span>
                </div>
              </div>
            )}
          </div>

          {simStep === 2 && (
            <div>
              <LeadForm
                defaultService={`Consórcio de Veículos — ${simTipo}`}
                defaultValor={simValor}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
