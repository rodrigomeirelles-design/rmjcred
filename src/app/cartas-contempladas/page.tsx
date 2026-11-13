"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import { trackFormSubmit, trackFormBegin } from "@/lib/analytics";

export default function CartasContempladas() {
  // --- FAQ State ---
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const toggleFaq = (id: string) => setOpenFaq(openFaq === id ? null : id);

  // --- Simulator State ---
  const [simStep, setSimStep] = useState<1 | 2>(1);
  const [simOpcao, setSimOpcao] = useState("Comprar uma carta contemplada");
  const [simTipoBem, setSimTipoBem] = useState("Imóvel residencial");
  const [simValor, setSimValor] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, "");
    if (!clean) {
      setSimValor("");
      return;
    }
    const cents = parseInt(clean, 10);
    const num = cents / 100;
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
    setSimValor(formatted);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          servico: `Cartas Contempladas — ${simOpcao} (${simTipoBem})`,
          valor: simValor,
        }),
      });

      trackFormSubmit({
        form_type: "simulador_cartas_contempladas",
        service_selected: `Cartas Contempladas — ${simOpcao}`,
        estimated_amount: simValor,
      });

      setSuccess(true);
    } catch (err) {
      console.error("Erro ao enviar contato:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqGroups = [
    {
      category: "SOBRE A CARTA CONTEMPLADA",
      items: [
        {
          id: "faq-s1",
          q: "O que é uma carta contemplada?",
          a: "Uma cota já sorteada ou com lance aprovado, com o crédito liberado para uso imediato — sem o período de espera.",
        },
        {
          id: "faq-s2",
          q: "Para que posso usar o crédito de uma carta de imóvel?",
          a: "Compra de imóvel residencial, comercial ou terreno e, conforme as regras de cada administradora, construção, reforma ou quitação de financiamento.",
        },
      ],
    },
    {
      category: "COMPRA",
      items: [
        {
          id: "faq-c1",
          q: "Como funciona a compra?",
          a: "Você paga ao vendedor um valor de entrada (o ágio) e assume as parcelas restantes. A administradora transfere a cota para o seu nome e libera o crédito.",
        },
        {
          id: "faq-c2",
          q: "Preciso passar por análise de crédito?",
          a: "Sim. A administradora analisa o comprador antes de aprovar a transferência e liberar o crédito.",
        },
        {
          id: "faq-c3",
          q: "Vale mais a pena que um financiamento?",
          a: "Depende do caso. A RMJ compara o custo total da carta (ágio + parcelas) com o financiamento e mostra o melhor caminho.",
        },
      ],
    },
    {
      category: "VENDA",
      items: [
        {
          id: "faq-v1",
          q: "Quero vender minha carta. Como funciona?",
          a: "A RMJ avalia a carta, apresenta uma proposta e cuida da transferência junto à administradora.",
        },
        {
          id: "faq-v2",
          q: "Quanto tempo leva?",
          a: "Em média 5 dias úteis, variando conforme os prazos da administradora e a agilidade na conferência da documentação.",
        },
      ],
    },
    {
      category: "SEGURANÇA",
      items: [
        {
          id: "faq-seg1",
          q: "A operação é segura?",
          a: "A transferência é feita oficialmente pela administradora. Validamos a carta e os documentos antes de qualquer pagamento.",
        },
      ],
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
            "name": "Cartas Contempladas",
            "provider": {
              "@id": "https://rmjcred.com.br/#organizacao"
            },
            "areaServed": [
              { "@type": "City", "name": "Itajubá" },
              { "@type": "AdministrativeArea", "name": "Sul de Minas Gerais" }
            ],
            "description": "Compra e venda de cartas de crédito contempladas com análise, validação e acompanhamento completo em Itajubá e Sul de Minas."
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqGroups.flatMap((group) =>
              group.items.map((item) => ({
                "@type": "Question",
                "name": item.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": item.a
                }
              }))
            )
          })
        }}
      />

      {/* ── 1. BREADCRUMB & HERO ─────────────────────────────────── */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <h1 className={styles.title}>Crédito pronto para usar. Sem esperar sorteio.</h1>
          <p className={styles.leadText}>
            A RMJ estrutura a compra e a venda de cartas contempladas para quem quer adquirir imóvel, reorganizar as finanças ou expandir o patrimônio, com análise e acompanhamento do início ao fim.
          </p>
          <div>
            <a
              href="https://wa.me/5535991084513?text=Ol%C3%A1%2C%20acessei%20o%20site%20da%20RMJ%20e%20gostaria%20de%20analisar%20uma%20carta%20contemplada."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroCtaBtn}
            >
              Quero analisar minha operação
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. POR QUE A RMJ ────────────────────────────────────── */}
      <section className={styles.introSection}>
        <div className="container">
          <div className={styles.introContent}>
            <span className={styles.introBadge}>Assessoria Especializada</span>
            <h2 className={styles.introTitle}>O mercado oferece crédito. A RMJ estrutura decisões.</h2>
            <p className={styles.introText}>
              A carta contemplada é um meio, não o fim. O resultado depende de como a operação é analisada, estruturada e conduzida. Por isso, cada caso passa pela análise do seu personal banker antes de qualquer passo.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. VANTAGENS ────────────────────────────────────────── */}
      <section className={`${styles.productDetails} section`}>
        <div className={`${styles.detailsGrid} container`}>
          <div className={styles.imageWrapper}>
            <Image
              src="/assets/ci_processo_sala.jpg"
              alt="Assessoria documental e análise de cartas contempladas"
              width={600}
              height={450}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.infoWrapper}>
            <div>
              <h2 className={styles.categoryTitle}>Vantagens da Carta Contemplada</h2>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Crédito já liberado:</strong> sem o período de espera de uma contemplação — o crédito está pronto para uso imediato.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Uso flexível:</strong> compra de imóvel residencial, comercial ou terreno, quitação de financiamento ou reorganização financeira (conforme regras da administradora).</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Análise antes de qualquer pagamento:</strong> validamos a carta (valor de crédito, saldo devedor e parcelas) antes de você assumir a transferência.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Suporte documental e cartorário completo:</strong> cuidamos de contratos, certidões e exigências da administradora.</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureBullet}>✓</span>
                  <span><strong>Também compramos sua carta:</strong> se você tem uma carta contemplada parada, a RMJ estrutura a venda e encontra o comprador.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. SERVIÇOS (3 CARDS) ───────────────────────────────── */}
      <section className={`${styles.servicesSection} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Nossas Soluções em Cartas Contempladas</h2>
            <p className={styles.sectionSubtitle}>
              Atuação completa para compradores, vendedores e regularização documental com segurança jurídica.
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {/* Card 1 */}
            <div className={styles.serviceCard}>
              <div>
                <h3 className={styles.serviceCardTitle}>Comprar carta contemplada</h3>
                <p className={styles.serviceCardDesc}>
                  Crédito já liberado pela administradora, pronto para comprar seu imóvel, quitar um financiamento caro ou investir no seu negócio.
                </p>
              </div>
              <a href="#simular" className={styles.serviceCardBtn}>
                Quero comprar uma carta
              </a>
            </div>

            {/* Card 2 */}
            <div className={styles.serviceCard}>
              <div>
                <h3 className={styles.serviceCardTitle}>Vender minha carta contemplada</h3>
                <p className={styles.serviceCardDesc}>
                  Tem uma carta contemplada e não vai usar? A RMJ avalia, encontra o comprador e conduz a transferência com segurança.
                </p>
              </div>
              <a href="#simular" className={styles.serviceCardBtn}>
                Quero vender minha carta
              </a>
            </div>

            {/* Card 3 */}
            <div className={styles.serviceCard}>
              <div>
                <h3 className={styles.serviceCardTitle}>Suporte documental e cartorário</h3>
                <p className={styles.serviceCardDesc}>
                  Cuidamos da papelada — contratos, certidões, registro e exigências da administradora — para a operação andar sem travar.
                </p>
              </div>
              <a href="#simular" className={styles.serviceCardBtn}>
                Preciso de suporte
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. COMO FUNCIONA (6 PASSOS) ─────────────────────────── */}
      <section className={`${styles.howSection} section`}>
        <div className="container">
          <div className={styles.howHeader}>
            <h2 className={styles.howTitle}>Como funciona</h2>
            <p className={styles.howSubtitle}>Do diagnóstico à liberação do crédito, com acompanhamento em cada etapa.</p>
          </div>
          <div className={styles.stepsGrid}>
            {[
              { n: "01", icon: "🎯", title: "Diagnóstico", desc: "Entendemos seu objetivo, seu perfil e a viabilidade da operação." },
              { n: "02", icon: "🔍", title: "Análise da carta", desc: "Validamos a carta: valor de crédito, saldo devedor, parcelas e administradora." },
              { n: "03", icon: "🧩", title: "Estruturação", desc: "Montamos o melhor caminho para o seu caso." },
              { n: "04", icon: "🏛️", title: "Intermediação com a administradora", desc: "Conduzimos a transferência e a aprovação do crédito." },
              { n: "05", icon: "📄", title: "Documentação", desc: "Organizamos documentos e etapas de cartório, reduzindo riscos e retrabalho." },
              { n: "06", icon: "🔑", title: "Liberação", desc: "Acompanhamos até o crédito ser liberado e o negócio fechado." },
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

      {/* ── 6. FAQ ACORDEÃO ─────────────────────────────────────── */}
      <section className={`${styles.faqSection} section`}>
        <div className="container">
          <div className={styles.howHeader}>
            <h2 className={styles.howTitle} style={{ color: "var(--primary-dark)" }}>Perguntas Frequentes</h2>
            <p className={styles.howSubtitle} style={{ color: "var(--neutral-muted)" }}>Tudo que você precisa saber sobre cartas contempladas</p>
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

      {/* ── 7. SIMULAÇÃO GRATUITA (2 ETAPAS) ───────────────────── */}
      <section className={`${styles.ctaSection} section`} id="simular">
        <div className={`${styles.ctaContainer} container`}>
          <div className={styles.titleContainer}>
            <span className={styles.simBadge}>Análise Personalizada</span>
            <h2 className={styles.simHeading}>Quer saber se uma carta contemplada faz sentido para você?</h2>
            <p className={styles.simLeadText}>
              Analisamos seu cenário e mostramos o caminho mais adequado para o seu objetivo. Peça também a lista atualizada de cartas disponíveis.
            </p>

            <div className={styles.discreetLinkWrapper}>
              <a
                href="https://wa.me/5535991084513?text=Ol%C3%A1%2C%20gostaria%20de%20receber%20a%20lista%20atualizada%20de%20cartas%20contempladas%20dispon%C3%ADveis."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.discreetLink}
              >
                <span>📲 Receber lista de cartas disponíveis via WhatsApp &rarr;</span>
              </a>
            </div>
          </div>

          <div className={styles.simCard}>
            {success ? (
              <div className={styles.successBox}>
                <h4>🎉 Solicitação Recebida com Sucesso!</h4>
                <p>
                  Recebemos seus dados. Nosso personal banker entrará em contato em breve para apresentar as opções e a análise da sua operação.
                </p>
              </div>
            ) : simStep === 1 ? (
              <>
                <p className={styles.simStepLabel}>Etapa 1 de 2 — O que você deseja fazer?</p>
                <div className={styles.simField}>
                  <label className={styles.simLabel}>Finalidade da operação</label>
                  <select
                    className={styles.simSelect}
                    value={simOpcao}
                    onChange={(e) => setSimOpcao(e.target.value)}
                  >
                    <option>Comprar uma carta contemplada</option>
                    <option>Vender minha carta contemplada</option>
                    <option>Suporte documental</option>
                  </select>
                </div>

                <div className={styles.simField}>
                  <label className={styles.simLabel}>Tipo de bem (se aplicável)</label>
                  <select
                    className={styles.simSelect}
                    value={simTipoBem}
                    onChange={(e) => setSimTipoBem(e.target.value)}
                  >
                    <option>Imóvel residencial</option>
                    <option>Imóvel comercial</option>
                    <option>Terreno</option>
                  </select>
                </div>

                <div className={styles.simField}>
                  <label className={styles.simLabel}>Valor pretendido (R$)</label>
                  <input
                    type="text"
                    className={styles.simInput}
                    placeholder="Ex: R$ 350.000,00"
                    value={simValor}
                    onChange={handleCurrencyChange}
                  />
                </div>

                <button
                  type="button"
                  className={styles.simBtn}
                  onClick={() => {
                    trackFormBegin("simulador_cartas_contempladas");
                    setSimStep(2);
                  }}
                >
                  Avançar para Etapa 2 &rarr;
                </button>
              </>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <p className={styles.simStepLabel}>Etapa 2 de 2 — Seus dados de contato</p>
                
                <button
                  type="button"
                  className={styles.simBackBtn}
                  onClick={() => setSimStep(1)}
                >
                  &larr; Voltar e alterar escolhas
                </button>

                <div className={styles.simSummary}>
                  <span>📋 {simOpcao}</span>
                  <span>🏠 {simTipoBem}</span>
                  {simValor && <span>💰 {simValor}</span>}
                </div>

                <div className={styles.simField} style={{ marginBottom: "0.85rem" }}>
                  <label className={styles.simLabel}>Nome Completo *</label>
                  <input
                    type="text"
                    required
                    className={styles.simInput}
                    placeholder="Seu nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>

                <div className={styles.simField} style={{ marginBottom: "0.85rem" }}>
                  <label className={styles.simLabel}>E-mail *</label>
                  <input
                    type="email"
                    required
                    className={styles.simInput}
                    placeholder="seuemail@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className={styles.simField} style={{ marginBottom: "1rem" }}>
                  <label className={styles.simLabel}>WhatsApp (com DDD) *</label>
                  <input
                    type="tel"
                    required
                    className={styles.simInput}
                    placeholder="(35) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.simBtn}
                >
                  {isSubmitting ? "Enviando análise..." : "Solicitar Análise →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
