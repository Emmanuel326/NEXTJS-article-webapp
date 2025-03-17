

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://fynanceguide.site',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  generateIndexSitemap: false,
  outDir: 'public', // This ensures the sitemap is saved correctly
  exclude: ["/admin", "/api/*"],
};
