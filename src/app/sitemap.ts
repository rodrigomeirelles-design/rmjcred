import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.rmjcred.com.br';
  
  const routes = ['', '/credito-bdmg', '/financiamento-imobiliario', '/home-equity', '/consorcios', '/financiamento-veiculos', '/credito-garantia-veiculo', '/procred-360', '/pronampe', '/sobre-nos', '/nossos-parceiros', '/contato', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
