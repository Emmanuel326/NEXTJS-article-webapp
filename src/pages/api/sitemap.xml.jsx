// pages/api/sitemap.xml.jsx
import { fetchAllArticles, fetchCategories } from "../../services/api";

export default async function handler(req, res) {
  const baseUrl = "https://fynanceguide.site";

  // 1. Static pages you want indexed
  const staticPages = [
    { path: "", changefreq: "daily", priority: 1.0 },
    { path: "about", changefreq: "monthly", priority: 0.6 },
    { path: "contact", changefreq: "monthly", priority: 0.6 },
    { path: "privacy-policy", changefreq: "monthly", priority: 0.4 },
    { path: "terms", changefreq: "monthly", priority: 0.4 },
  ];

  // 2. Fetch everything from your DRF backend
  const articles = await fetchAllArticles();      // [{ slug, category: { slug }, updated_at }, …]
  const categories = await fetchCategories();     // [{ slug, updated_at }, …]

  // 3. Build <url> blocks
  const staticUrls = staticPages
    .map(
      ({ path, changefreq, priority }) => `
  <url>
    <loc>${baseUrl}/${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("");

  const categoryUrls = categories
    .map(
      ({ slug, updated_at }) => `
  <url>
    <loc>${baseUrl}/category/${slug}</loc>
    <lastmod>${new Date(updated_at || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join("");

  const articleUrls = articles
    .map(
      ({ slug, category, updated_at }) => `
  <url>
    <loc>${baseUrl}/category/${category.slug}/${slug}</loc>
    <lastmod>${new Date(updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("");

  // 4. Assemble the full sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${staticUrls}
  ${categoryUrls}
  ${articleUrls}
</urlset>`;

  // 5. Return XML
  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(sitemap);
}
