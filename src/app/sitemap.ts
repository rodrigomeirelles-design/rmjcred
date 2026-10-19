import { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blogPosts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rmjcred.com.br';
  
  const routes = ['', '/credito-bdmg', '/financiamento-imobiliario', '/home-equity', '/consorcios', '/financiamento-veiculos', '/credito-garantia-veiculo', '/procred-360', '/pronampe', '/sobre-nos', '/nossos-parceiros', '/contato', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...blogRoutes];
}

