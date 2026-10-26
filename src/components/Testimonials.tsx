import styles from "@/app/consorcios/page.module.css";

export interface TestimonialItem {
  nome: string;
  cidade: string;
  bemConquistado: string;
  texto: string;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    nome: "[PREENCHER: Nome do Cliente 1]",
    cidade: "[PREENCHER: Itajubá - MG]",
    bemConquistado: "[PREENCHER: Imóvel Residencial / Casa Própria]",
    texto: "[PREENCHER: Depoimento real do cliente sobre como o planejamento do consórcio imobiliário e a orientação sobre lance e FGTS ajudaram na conquista do imóvel.]",
  },
  {
    nome: "[PREENCHER: Nome do Cliente 2]",
    cidade: "[PREENCHER: Pouso Alegre - MG]",
    bemConquistado: "[PREENCHER: Renovação de Frota / Caminhão]",
    texto: "[PREENCHER: Depoimento real do empresário sobre como estruturou a compra de veículos ou máquinas sem pagar juros bancários com a assessoria da RMJ.]",
  },
  {
    nome: "[PREENCHER: Nome do Cliente 3]",
    cidade: "[PREENCHER: Santa Rita do Sapucaí - MG]",
    bemConquistado: "[PREENCHER: Sala Comercial / Sede da Empresa]",
    texto: "[PREENCHER: Depoimento real sobre o acompanhamento nas assembleias, transparência nas regras de reajuste e agilidade no faturamento da carta contemplada.]",
  },
];

interface TestimonialsProps {
  items?: TestimonialItem[];
}

export default function Testimonials({ items = DEFAULT_TESTIMONIALS }: TestimonialsProps) {
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": "https://rmjcred.com.br/#organizacao",
    "name": "RMJ Soluções de Crédito",
    "review": items.map((item) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": item.nome,
      },
      "name": item.bemConquistado,
      "reviewBody": `${item.texto} (${item.cidade} — ${item.bemConquistado})`,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
      },
    })),
  };

  return (
    <section className={`${styles.editorialSection} section`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <div className="container">
        <div className={styles.howHeader} style={{ marginBottom: "2.25rem" }}>
          <span className={styles.chartBadge}>Experiências Reais</span>
          <h2 className={styles.howTitle} style={{ color: "var(--primary-dark)", marginTop: "0.5rem" }}>
            Depoimentos de Quem Planejou com a RMJ
          </h2>
          <p className={styles.howSubtitle} style={{ color: "var(--neutral-muted)" }}>
            Histórias de famílias, profissionais e empresas de Itajubá e do Sul de Minas
          </p>
        </div>

        <div className={styles.cardsGrid3}>
          {items.map((item, idx) => (
            <article key={idx} className={styles.infoCard} style={{ justifyContent: "space-between" }}>
              <div>
                <span className={styles.relatedTag}>{item.bemConquistado}</span>
                <p
                  className={styles.infoCardText}
                  style={{ marginTop: "0.75rem", fontStyle: "italic", color: "#1E293B" }}
                >
                  &ldquo;{item.texto}&rdquo;
                </p>
              </div>
              <div style={{ marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px solid #E2E8F0" }}>
                <strong style={{ display: "block", color: "#162F4B", fontSize: "0.95rem" }}>
                  {item.nome}
                </strong>
                <span style={{ color: "#64748B", fontSize: "0.85rem" }}>{item.cidade}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
