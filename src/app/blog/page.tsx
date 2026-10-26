import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/data/blogPosts";
import styles from "./page.module.css";

export const revalidate = 86400;

export const metadata = {
  title: "Blog RMJ | Dicas de Crédito, Financiamento e Gestão Financeira",
  description: "Artigos sobre crédito empresarial, financiamento de veículos, Home Equity e gestão financeira para empresas e pessoas físicas no sul de Minas.",
  alternates: {
    canonical: "https://rmjcred.com.br/blog",
  },
  openGraph: {
    title: "Blog RMJ | Dicas de Crédito, Financiamento e Gestão Financeira",
    description: "Artigos sobre crédito empresarial, financiamento de veículos, Home Equity e gestão financeira para empresas e pessoas físicas no sul de Minas.",
    url: "https://rmjcred.com.br/blog",
    siteName: "RMJ Soluções de Crédito",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-rmj.jpg",
        width: 1200,
        height: 630,
        alt: "Blog RMJ | Dicas de Crédito, Financiamento e Gestão Financeira",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog RMJ | Dicas de Crédito, Financiamento e Gestão Financeira",
    description: "Artigos sobre crédito empresarial, financiamento de veículos, Home Equity e gestão financeira para empresas e pessoas físicas no sul de Minas.",
    images: ["/og-rmj.jpg"],
  },
};;

export default function BlogHome() {
  return (
    <>
      {/* Cabeçalho do Blog */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <span className={styles.pageSubtitle}>Dicas e Guias</span>
          <h1 className={styles.title}>Blog RMJ: Conteúdo sobre Crédito e Finanças</h1>
          <p className={styles.leadText}>
            Aprenda mais sobre o mercado de financiamento de veículos, crédito imobiliário, fomento e tome a decisão financeira mais inteligente para o seu bolso.
          </p>
        </div>
      </section>

      {/* Grid de Artigos */}
      <section className={`${styles.blogGridSection} section`}>
        <div className="container">
          <div className={styles.articlesGrid}>
            {blogPosts.filter((post) => !post.draft).map((post) => (
              <article className={styles.articleCard} key={post.slug}>
                <div className={styles.cardImageWrapper}>
                  <Image
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <span className={styles.categoryBadge}>{post.category}</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.metaInfo}>
                    <span>{post.date}</span>
                    <span className={styles.metaDivider}>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className={styles.articleTitle}>
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className={styles.articleDesc}>
                    {post.subtitle}
                  </p>
                  <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                    Ler Artigo Completo &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Seção CTA */}
      <section className={`${styles.ctaSection} section`}>
        <div className={`${styles.ctaContent} container`}>
          <h2 className={styles.ctaTitle}>Ficou com alguma dúvida sobre as regras?</h2>
          <p>
            Nosso time de consultores está pronto para te atender de forma humana, clara e sem compromisso. Fale conosco agora mesmo.
          </p>
          <a href="https://wa.me/5535991084513" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Chamar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
