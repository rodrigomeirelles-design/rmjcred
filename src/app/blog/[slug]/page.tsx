import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blogPosts";
import LeadForm from "@/components/LeadForm";
import styles from "./page.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Pre-renderização estática das rotas
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Configuração dinâmica de metadados de SEO por página
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} — Blog RMJ Crédito`,
    description: post.description,
    keywords: post.seoKeywords.join(", "),
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://rmjcred.com.br/blog/${post.slug}`,
      type: "article",
      images: [
        {
          url: post.image,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Descobrir qual serviço passar como default no form de leads
  let defaultFormService = "BDMG";
  if (post.category === "Veículos") {
    defaultFormService = "Veículos";
  } else if (post.category === "Crédito Imobiliário") {
    defaultFormService = "Crédito Imobiliário";
  } else if (post.category === "Home Equity") {
    defaultFormService = "Home Equity";
  } else if (post.category === "Consórcios") {
    defaultFormService = "Consórcios";
  } else if (post.category === "Capital de Giro BDMG") {
    defaultFormService = "BDMG";
  }

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Início",
        "item": "https://rmjcred.com.br"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://rmjcred.com.br/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://rmjcred.com.br/blog/${post.slug}`
      }
    ]
  };

  // Article schema
  let articleSchema: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.slug === "capital-de-giro-bdmg-itajuba" || post.slug === "home-equity-itajuba-minas-gerais" || post.slug === "home-equity-unificar-dividas" || post.slug === "financiamento-imovel-itajuba" || post.slug === "programa-contador-parceiro-rmj" ? "2026-06-11" : "2026-06-02",
    "author": {
      "@type": "Organization",
      "name": "RMJ Soluções de Crédito",
      "url": "https://rmjcred.com.br"
    }
  };

  if (post.slug === "capital-de-giro-bdmg-itajuba") {
    articleSchema = {
      "@context": "https://schema.org",
      "@type": ["Article", "HowTo"],
      "headline": "Capital de Giro BDMG em Itajubá: Guia Completo 2026 para Micro e Pequenas Empresas",
      "description": "Guia passo-a-passo para aprovar capital de giro BDMG em Itajubá com taxa de 1,54% a.m., carência de 12 meses e até R$500 mil.",
      "author": {
        "@type": "Organization",
        "name": "RMJ Soluções de Crédito",
        "url": "https://rmjcred.com.br"
      },
      "datePublished": "2026-06-11",
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "Itajubá",
        "addressRegion": "MG",
        "addressCountry": "BR"
      }
    };
  } else if (post.slug === "home-equity-itajuba-minas-gerais") {
    articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Home Equity em Itajubá e Minas Gerais: Transforme seu Imóvel em Crédito de Juros Baixos",
      "author": {
        "@type": "Organization",
        "name": "RMJ Soluções de Crédito"
      },
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "Itajubá",
        "addressRegion": "MG"
      }
    };
  }

  const fullMarkdownContent = post.content.join("\n\n");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* 1. Header do Artigo */}
      <header className={styles.postHeader}>
        <div className={`${styles.headerContainer} container`}>
          <Link href="/blog" className={styles.backLink}>
            &larr; Voltar para todos os artigos
          </Link>
          <div className={styles.metaInfo}>
            <span className={styles.categoryBadge}>{post.category}</span>
            <span>{post.date}</span>
            <span className={styles.metaDivider}>•</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.subtitle}>{post.subtitle}</p>
        </div>
      </header>

      {/* 2. Conteúdo Principal e Barra Lateral */}
      <section className={`${styles.contentSection} section`}>
        <div className={`${styles.contentGrid} container`}>
          
          {/* Artigo Principal */}
          <main className={styles.articleBody}>
            <div className={styles.postImageWrapper}>
              <Image
                src={post.image}
                alt={post.title}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
            
            <div className={styles.textContent}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {fullMarkdownContent.replace(/\\n/g, "\n")}
              </ReactMarkdown>
            </div>

            <div className={styles.seoKeywordsList}>
              <strong>Assuntos relacionados:</strong>
              <div className={styles.keywordTags}>
                {post.seoKeywords.map((kw, i) => (
                  <span key={i} className={styles.keywordTag}>
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </main>

          {/* Sidebar com LeadForm */}
          <aside className={styles.sidebar}>
            <div className={styles.stickySidebar}>
              <div className={styles.formContainer}>
                <h4 className={styles.formHeadline}>Gostou do conteúdo?</h4>
                <p className={styles.formIntro}>
                  Faça uma simulação sem custos com a RMJ e compare taxas reais.
                </p>
                <LeadForm defaultService={defaultFormService} />
              </div>
            </div>
          </aside>

        </div>
      </section>

      {/* 3. Rodapé do Artigo: Outros Conteúdos */}
      <section className={`${styles.relatedSection} section`}>
        <div className="container">
          <h3 className={styles.relatedTitle}>Leia Também</h3>
          <div className={styles.relatedGrid}>
            {blogPosts
              .filter((p) => p.slug !== post.slug)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link href={`/blog/${relatedPost.slug}`} className={styles.relatedCard} key={relatedPost.slug}>
                  <div className={styles.relatedImageWrapper}>
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.relatedInfo}>
                    <span className={styles.relatedCategory}>{relatedPost.category}</span>
                    <h4>{relatedPost.title}</h4>
                    <span className={styles.relatedLink}>Ler artigo &rarr;</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
