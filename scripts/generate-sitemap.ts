import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const siteUrl = 'https://www.vendingtrade.kz';

async function main() {
  const urls: { loc: string; lastmod?: string; changefreq?: string; priority?: string }[] = [];

  // Static pages
  urls.push({ loc: siteUrl, changefreq: 'daily', priority: '1.0' });
  urls.push({ loc: `${siteUrl}/catalog`, changefreq: 'daily', priority: '0.9' });
  urls.push({ loc: `${siteUrl}/catalog/all`, changefreq: 'daily', priority: '0.8' });
  urls.push({ loc: `${siteUrl}/kak-zakazat`, changefreq: 'monthly', priority: '0.6' });
  urls.push({ loc: `${siteUrl}/o-kompanii`, changefreq: 'monthly', priority: '0.7' });
  urls.push({ loc: `${siteUrl}/kontakty`, changefreq: 'monthly', priority: '0.5' });
  urls.push({ loc: `${siteUrl}/otzyvy`, changefreq: 'weekly', priority: '0.6' });

  // Categories + products from DB if env is available
  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: categories, error: catErr } = await supabase.from('categories').select('slug, created_at');
    if (catErr) console.error('Categories query error:', catErr.message);
    if (categories) {
      for (const cat of categories) {
        urls.push({ loc: `${siteUrl}/catalog/${cat.slug}`, lastmod: cat.created_at, changefreq: 'daily', priority: '0.8' });
      }
    }

    const { data: subcategories, error: subErr } = await supabase.from('subcategories').select('slug, created_at');
    if (subErr) console.error('Subcategories query error:', subErr.message);
    if (subcategories) {
      for (const sub of subcategories) {
        urls.push({ loc: `${siteUrl}/catalog/${sub.slug}`, lastmod: sub.created_at, changefreq: 'daily', priority: '0.8' });
      }
    }

    const { data: products, error: prodErr } = await supabase.from('products').select('slug, updated_at').eq('is_active', true);
    if (prodErr) console.error('Products query error:', prodErr.message);
    if (products) {
      for (const p of products) {
        urls.push({ loc: `${siteUrl}/product/${p.slug}`, lastmod: p.updated_at, changefreq: 'weekly', priority: '0.7' });
      }
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

main().catch((err) => {
  console.error('Sitemap generation failed, generating static sitemap instead:', err.message);
  const outDir = path.resolve(__dirname, '..', 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const staticXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.vendingtrade.kz</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.vendingtrade.kz/catalog</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.vendingtrade.kz/catalog/all</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.vendingtrade.kz/kak-zakazat</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.vendingtrade.kz/o-kompanii</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.vendingtrade.kz/kontakty</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://www.vendingtrade.kz/otzyvy</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>
</urlset>`;
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), staticXml, 'utf-8');
  console.log('Static sitemap generated: 7 URLs');
});
