import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/data/blogPosts";
import styles from "./page.module.css";

export const metadata = {
  title: "Blog, Dicas e Guias — RMJ Soluções de Crédito",
  description: "Aprenda sobre financiamento de veículos, crédito imobiliário, capital de giro BDMG e tome as melhores decisões financeiras.",
};

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
          <h1 className={styles.title}>Consulte Nossos Conteúdos</h1>
          <p className={styles.leadText}>
            Aprenda mais sobre o mercado de financiamento de veículos, crédito imobiliário, fomento e tome a decisão financeira mais inteligente para o seu bolso.
          </p>
        </div>
      </section>

      {/* Grid de Artigos */}
      <section className={`${styles.blogGridSection} section`}>
        <div className="container">
          <div className={styles.articlesGrid}>
            {blogPosts.map((post) => (
              <article className={styles.articleCard} key={post.slug}>
                <div className={styles.cardImageWrapper}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
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
          <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Chamar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
