import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const siteUrl = 'https://www.vendingtrade.kz';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const urls: { loc: string; lastmod?: string; changefreq?: string; priority?: string }[] = [];

  // Static pages
  urls.push({ loc: siteUrl, changefreq: 'daily', priority: '1.0' });
  urls.push({ loc: `${siteUrl}/catalog`, changefreq: 'daily', priority: '0.9' });
  urls.push({ loc: `${siteUrl}/kak-zakazat`, changefreq: 'monthly', priority: '0.6' });
  urls.push({ loc: `${siteUrl}/klientam`, changefreq: 'monthly', priority: '0.6' });
  urls.push({ loc: `${siteUrl}/o-kompanii`, changefreq: 'monthly', priority: '0.7' });
  urls.push({ loc: `${siteUrl}/kontakty`, changefreq: 'monthly', priority: '0.5' });
  urls.push({ loc: `${siteUrl}/aktsii`, changefreq: 'weekly', priority: '0.8' });

  // Categories
  const { data: categories } = await supabase.from('categories').select('slug, updated_at');
  if (categories) {
    for (const cat of categories) {
      urls.push({ loc: `${siteUrl}/catalog/${cat.slug}`, lastmod: cat.updated_at, changefreq: 'daily', priority: '0.8' });
    }
  }

  // Subcategories
  const { data: subcategories } = await supabase.from('subcategories').select('slug, updated_at');
  if (subcategories) {
    for (const sub of subcategories) {
      urls.push({ loc: `${siteUrl}/catalog/${sub.slug}`, lastmod: sub.updated_at, changefreq: 'daily', priority: '0.8' });
    }
  }

  // Products
  const { data: products } = await supabase.from('products').select('slug, updated_at').eq('is_active', true);
  if (products) {
    for (const p of products) {
      urls.push({ loc: `${siteUrl}/product/${p.slug}`, lastmod: p.updated_at, changefreq: 'weekly', priority: '0.7' });
    }
  }

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}
    ${u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>` : ''}
    ${u.priority ? `    <priority>${u.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  const outDir = path.resolve(__dirname, '..', 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf-8');
  console.log(`Sitemap generated: ${urls.length} URLs`);
}

main().catch(console.error);
