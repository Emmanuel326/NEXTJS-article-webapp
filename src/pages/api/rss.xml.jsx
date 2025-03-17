// pages/api/rss.xml.js

export default async function handler(req, res) {
    const baseUrl = "https://www.fynanceguide.site";
    
    // Fetch Blog Articles Dynamically
    const response = await fetch(`${baseUrl}/api/articles`);
    const data = await response.json();
    const articles = data.results || [];
  
    // Create RSS <item> elements for each article
    const items = articles.map(article => {
      return `
        <item>
          <title>${article.title}</title>
          <link>${baseUrl}/category/${article.category.slug}/${article.slug}</link>
          <description>${article.excerpt || "No description available"}</description>
          <pubDate>${new Date(article.updated_at).toUTCString()}</pubDate>
        </item>
      `;
    }).join('');
  
    // Construct the RSS feed XML
    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>Fynance Guide RSS Feed</title>
          <link>${baseUrl}</link>
          <description>Latest finance and investment insights</description>
          ${items}
        </channel>
      </rss>`;
  
    // Send the XML response
    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(rssFeed);
  }
  