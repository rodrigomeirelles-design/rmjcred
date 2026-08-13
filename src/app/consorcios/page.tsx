"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";
import { useState } from "react";

export default function Consorcios() {
  // --- FAQ State ---
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const toggleFaq = (id: string) => setOpenFaq(openFaq === id ? null : id);

  // --- Simulator State ---
  const [simStep, setSimStep] = useState<1 | 2>(1);
  const [simTipo, setSimTipo] = useState("Imóveis");
  const [simValor, setSimValor] = useState("");

  const faqGroups = [
    {
      category: "Contemplação",
      items: [
        { id: "c1", q: "O que é lance?", a: "Lance é uma oferta feita pelo consorciado para antecipar sua contemplação. Você pode oferecer um percentual do crédito como lance livre, lance embutido (descontado da própria carta) ou lance fixo, conforme as regras do grupo." },
        { id: "c2", q: "Como funcionam os sorteios?", a: "Mensalmente, a administradora realiza assembleias onde são sorteados consorciados para contemplação. Todos os participantes do grupo concorrem igualmente — independente do tempo de adesão." },
        { id: "c3", q: "Em quanto tempo posso ser contemplado?", a: "A contemplação pode ocorrer desde o primeiro mês (por lance ou sorteio) até o final do prazo do grupo. Não há garantia de prazo, mas estratégias de lance podem acelerar o processo." },
        { id: "c4", q: "Existe prazo máximo para usar o crédito após a contemplação?", a: "Não existe um prazo máximo obrigatório que faça você perder o crédito. Uma vez contemplado, o valor da sua carta fica aplicado no Tesouro Nacional (ou similar seguro), rendendo juros até o momento em que você decidir utilizá-lo para a compra do bem." },
      ],
    },
    {
      category: "Documentação",
      items: [
        { id: "d1", q: "Quais documentos preciso apresentar?", a: "Os documentos básicos são: RG, CPF, comprovante de residência e comprovante de renda (holerite, declaração de IR ou extratos bancários). Documentação complementar pode ser solicitada pela administradora no momento da contemplação." },
        { id: "d2", q: "Consórcio entra em análise de crédito como um financiamento?", a: "Não exatamente. Na adesão ao grupo, geralmente não há análise de crédito restritiva. A análise de crédito mais criteriosa ocorre somente no momento da contemplação, quando você vai utilizar a carta." },
      ],
    },
    {
      category: "Uso do Crédito",
      items: [
        { id: "u1", q: "Posso usar a carta de crédito em qualquer imóvel ou loja?", a: "Sim! Você tem total liberdade para escolher o bem ou serviço que deseja adquirir, desde qualquer vendedor ou estabelecimento. O poder de compra à vista inclusive garante maior poder de negociação no preço." },
        { id: "u2", q: "O que acontece se eu quiser cancelar minha cota?", a: "O cancelamento é possível, mas o valor pago é devolvido somente ao término do grupo ou por meio de sorteio específico para desistentes — conforme regulamento da administradora. Nossa equipe orienta as melhores alternativas antes de qualquer decisão." },
        { id: "u3", q: "Há cobrança de juros nas parcelas?", a: "Não. O consórcio não cobra juros. As parcelas incluem apenas a taxa de administração da administradora (diluída ao longo do prazo) e o fundo de reserva. Isso é o que torna o consórcio muito mais barato que o financiamento convencional." },
      ],
    },
  ];

  return (
    <>
      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <h1 className={styles.title}>Consórcios</h1>
          <p className={styles.leadText}>
            Planejamento inteligente para conquistas sólidas. O consórcio é a melhor alternativa para quem deseja adquirir bens sem pagar juros abusivos — com o suporte da RMJ e de administradoras parceiras autorizadas pelo Banco Central.
          </p>
        </div>
      </section>

      {/* ── 2. VANTAGENS ─────────────────────────────────────── */}
      <section className={`${styles.productDetails} section`}>
        <div className={`${styles.detailsGrid} container`}>
          <div className={styles.imageWrapper}>
            <Image
              src="/assets/8354789cc4e349318167ee2bb326e75b.jpg"
              alt="Planejamento financeiro com consórcio"
              width={600}
              height={450}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.infoWrapper}>
            <div>
              <h2 className={styles.categoryTitle}>Vantagens do Consórcio</h2>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Zero Juros:</strong> Ao contrário dos financiamentos comuns, o consórcio não cobra juros — apenas uma taxa de administração diluída nas parcelas, muito mais acessível.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Cartas de Crédito Diversas:</strong> Grupos para imóveis (residenciais, comerciais, construção, reforma), veículos (carros, motos, pesados, frotas) e serviços.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Liberdade de Escolha:</strong> Ao ser contemplado, você recebe a carta de crédito para comprar o bem onde e de quem preferir — com o poder de negociação de quem paga à vista.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Lances Flexíveis:</strong> Acelere sua contemplação com lances embutidos (usando parte da própria carta), lances fixos ou livres.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Administradoras de Confiança:</strong> Trabalhamos apenas com administradoras consolidadas no mercado brasileiro, autorizadas e fiscalizadas pelo Banco Central.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. GRÁFICO COMPARATIVO ────────────────────────────── */}
      <section className={`${styles.chartSection} section`}>
        <div className="container">
          <div className={styles.chartGrid}>
            {/* Barras */}
            <div className={styles.chartWrapper}>
              <h3 className={styles.chartTitle}>Taxa Administrativa Consórcio x Juros Financiamento (Bancos)</h3>
              <div className={styles.chartLegend}>
                <span className={styles.legendConsorcio}>■ Consórcio</span>
                <span className={styles.legendBancos}>■ Bancos</span>
              </div>
              <div className={styles.chartBars}>
                
                {/* Grupo Imobiliário */}
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

                {/* Grupo Veículo */}
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
            </div>

            {/* Texto ao lado */}
            <div className={styles.chartText}>
              <span className={styles.chartBadge}>Compare</span>
              <h2 className={styles.chartHeading}>Você nunca mais vai pagar juros para o banco!</h2>
              <p>Venha realizar com a maior administradora independente do Brasil em créditos ativos. Não perca essa oportunidade!</p>
              <p style={{ marginTop: "1rem" }}>Fonte: Comparativo realizado com base no relatório geral das taxas de juros praticadas pelos bancos disponíveis no site do Banco Central do Brasil.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. COMO FUNCIONA (4 passos) ──────────────────────── */}
      <section className={`${styles.howSection} section`}>
        <div className="container">
          <div className={styles.howHeader}>
            <h2 className={styles.howTitle}>Como funciona</h2>
            <p className={styles.howSubtitle}>Quatro etapas simples do início à conquista do seu bem</p>
          </div>
          <div className={styles.stepsGrid}>
            {[
              { n: "01", icon: "🎯", title: "Escolha seu objetivo", desc: "Defina o bem desejado — imóvel, veículo, moto ou serviço — e o valor de crédito que precisa." },
              { n: "02", icon: "📅", title: "Contribua mensalmente", desc: "Pague parcelas planejadas e sem juros. Apenas a taxa de administração é diluída nas prestações." },
              { n: "03", icon: "🏛️", title: "Participe das assembleias", desc: "Acompanhe os sorteios mensais ou ofereça lances para acelerar sua contemplação." },
              { n: "04", icon: "🔑", title: "Use sua carta de crédito", desc: "Ao ser contemplado, utilize o crédito para comprar o bem onde e de quem preferir, com poder de compra à vista." },
            ].map((step) => (
              <div key={step.n} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.n}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FAQ ACORDEÃO ───────────────────────────────────── */}
      <section className={`${styles.faqSection} section`}>
        <div className="container">
          <div className={styles.howHeader}>
            <h2 className={styles.howTitle} style={{ color: "var(--primary-dark)" }}>Perguntas Frequentes</h2>
            <p className={styles.howSubtitle} style={{ color: "var(--neutral-muted)" }}>Tudo que você precisa saber sobre consórcios</p>
          </div>

          {faqGroups.map((group) => (
            <div key={group.category} className={styles.faqGroup}>
              <h3 className={styles.faqCategory}>{group.category}</h3>
              {group.items.map((item) => (
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
          ))}
        </div>
      </section>

      {/* ── 6. SIMULADOR ─────────────────────────────────────── */}
      <section className={`${styles.ctaSection} section`} id="simular">
        <div className={`${styles.ctaContainer} container`}>
          <div className={styles.titleContainer}>
            <span className={styles.simBadge}>Simulação Gratuita</span>
            <h2 className={styles.simHeading}>Simule seu Consórcio</h2>
            <p className={styles.leadText}>
              Em dois passos rápidos, nosso time apresentará as melhores opções de grupos, prazos e lances para o seu planejamento.
            </p>

            {simStep === 1 && (
              <div className={styles.simCard}>
                <p className={styles.simStepLabel}>Etapa 1 de 2 — O que você deseja adquirir?</p>
                <div className={styles.simField}>
                  <label className={styles.simLabel}>Tipo de bem</label>
                  <select
                    className={styles.simSelect}
                    value={simTipo}
                    onChange={(e) => setSimTipo(e.target.value)}
                  >
                    <option>Imóveis</option>
                    <option>Veículos</option>
                    <option>Motos</option>
                    <option>Serviços</option>
                  </select>
                </div>
                <div className={styles.simField}>
                  <label className={styles.simLabel}>Valor desejado (R$)</label>
                  <input
                    type="text"
                    className={styles.simInput}
                    placeholder="Ex: R$ 250.000,00"
                    value={simValor}
                    onChange={(e) => setSimValor(e.target.value)}
                  />
                </div>
                <button
                  className={styles.simBtn}
                  onClick={() => simValor.trim() && setSimStep(2)}
                >
                  Simular →
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
                  <span>📋 {simTipo}</span>
                  <span>💰 {simValor}</span>
                </div>
              </div>
            )}
          </div>

          {simStep === 2 && (
            <div>
              <LeadForm
                defaultService={`Consórcios — ${simTipo}`}
                defaultValor={simValor}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
