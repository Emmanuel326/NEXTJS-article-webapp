export default async function handler(req, res) {
    const baseUrl = "https://www.fynanceguide.site";
  
    // Static Pages
    const staticPages = ["", "about", "contact"];
  
    // Fetch Blog Articles Dynamically
    const response = await fetch(`${baseUrl}/api/articles`);
    const data = await response.json();
    const articles = data.results; // Extract articles from the "results" key
  
    const blogPosts = articles.map(
      (article) => `
      <url>
        <loc>${baseUrl}/category/${article.category.slug}/${article.slug}</loc>
        <lastmod>${new Date(article.updated_at).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`
    );
  
    // Generate XML Sitemap String
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map(
          (page) => `
        <url>
          <loc>${baseUrl}/${page}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.6</priority>
        </url>`
        )
        .join("")}
      ${blogPosts.join("")}
    </urlset>`;
  
    // Send XML Response
    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(sitemap);
  }
  