// pages/rss.xml.js

import { getServerSideProps as getSitemapProps } from "./sitemap.xml";

export default function RSS() {
  return null;
}

export async function getServerSideProps({ res }) {
  const baseUrl = "https://www.fynanceguide.site";

  // Reuse dynamic pages from sitemap.xml
  const { props } = await getSitemapProps({ res });
  const sitemapUrls = props.sitemap?.match(/<loc>(.*?)<\/loc>/g) || [];

  // Create RSS Feed
  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Fynance Guide RSS Feed</title>
      <link>${baseUrl}</link>
      <description>Latest finance and investment insights</description>
      ${sitemapUrls
        .map((url) => `<item><link>${url.replace("<loc>", "").replace("</loc>", "")}</link></item>`)
        .join("")}
    </channel>
  </rss>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(rssFeed);
  res.end();

  return { props: {} };
}
