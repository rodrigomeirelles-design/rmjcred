import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { blogPosts } from '@/data/blogPosts';

const MONTHS_PT: Record<string, string> = {
  janeiro: '01',
  fevereiro: '02',
  março: '03',
  marco: '03',
  abril: '04',
  maio: '05',
  junho: '06',
  julho: '07',
  agosto: '08',
  setembro: '09',
  outubro: '10',
  novembro: '11',
  dezembro: '12',
};

function parsePtBrDate(dateStr: string): Date {
  const match = dateStr.trim().match(/^(\d{1,2})\s+de\s+([a-zA-ZçÇ]+)\s+de\s+(\d{4})$/i);
  if (match) {
    const day = match[1].padStart(2, '0');
    const month = MONTHS_PT[match[2].toLowerCase()] || '01';
    const year = match[3];
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date('2026-06-02T00:00:00.000Z') : parsed;
}

function getPageLastModified(route: string, fallbackIso: string): Date {
  try {
    const relPath = route === '/' ? 'src/app/page.tsx' : `src/app${route}/page.tsx`;
    const fullPath = path.join(process.cwd(), relPath);
    const stat = fs.statSync(fullPath);
    return stat.mtime;
  } catch {
    return new Date(fallbackIso);
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rmjcred.com.br';

  const pages: { route: string; priority: number; changeFrequency: 'weekly' | 'monthly'; fallback: string }[] = [
    { route: '/', priority: 1.0, changeFrequency: 'weekly', fallback: '2026-10-25T00:00:00.000Z' },
    { route: '/credito-bdmg', priority: 0.9, changeFrequency: 'monthly', fallback: '2026-10-21T00:00:00.000Z' },
    { route: '/credito-imovel', priority: 0.9, changeFrequency: 'monthly', fallback: '2026-10-21T00:00:00.000Z' },
    { route: '/financiamento-imobiliario', priority: 0.8, changeFrequency: 'monthly', fallback: '2026-10-21T00:00:00.000Z' },
    { route: '/home-equity', priority: 0.9, changeFrequency: 'monthly', fallback: '2026-10-21T00:00:00.000Z' },
    { route: '/consorcios', priority: 0.9, changeFrequency: 'monthly', fallback: '2026-10-25T00:00:00.000Z' },
    { route: '/consorcio-imobiliario', priority: 0.9, changeFrequency: 'monthly', fallback: '2026-10-25T00:00:00.000Z' },
    { route: '/consorcio-de-veiculos', priority: 0.9, changeFrequency: 'monthly', fallback: '2026-10-25T00:00:00.000Z' },
    { route: '/financiamento-veiculos', priority: 0.9, changeFrequency: 'monthly', fallback: '2026-10-21T00:00:00.000Z' },
    { route: '/credito-garantia-veiculo', priority: 0.9, changeFrequency: 'monthly', fallback: '2026-10-21T00:00:00.000Z' },
    { route: '/procred-360', priority: 0.9, changeFrequency: 'monthly', fallback: '2026-10-21T00:00:00.000Z' },
    { route: '/pronampe', priority: 0.9, changeFrequency: 'monthly', fallback: '2026-10-21T00:00:00.000Z' },
    { route: '/sobre-nos', priority: 0.8, changeFrequency: 'monthly', fallback: '2026-10-21T00:00:00.000Z' },
    { route: '/nossos-parceiros', priority: 0.8, changeFrequency: 'monthly', fallback: '2026-10-21T00:00:00.000Z' },
    { route: '/contato', priority: 0.8, changeFrequency: 'monthly', fallback: '2026-10-21T00:00:00.000Z' },
    { route: '/blog', priority: 0.8, changeFrequency: 'weekly', fallback: '2026-10-21T00:00:00.000Z' },
    { route: '/politica-de-privacidade', priority: 0.5, changeFrequency: 'monthly', fallback: '2026-05-07T00:00:00.000Z' },
    { route: '/cadastro/bdmg', priority: 0.7, changeFrequency: 'monthly', fallback: '2026-06-02T00:00:00.000Z' },
    { route: '/cadastro/financiamento-imobiliario', priority: 0.7, changeFrequency: 'monthly', fallback: '2026-06-02T00:00:00.000Z' },
  ];

  const routes: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${baseUrl}${p.route}`,
    lastModified: getPageLastModified(p.route, p.fallback),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: parsePtBrDate(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...routes, ...blogRoutes];
}
