// pages/sitemap.xml.js

function Sitemap() {
    // This component is not rendered on the client.
    return null
  }
  
  export const getServerSideProps = async ({ res }) => {
    // Define your site's base URL
    const baseUrl = 'https://www.fynanceguide.site'
    
    // List of static pages; you can fetch dynamic pages from a CMS or database.
    const pages = [
      '',
      'about',
      'contact',
      // Add additional paths as needed
    ]
  
    // Create the XML sitemap string
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map(
          (page) => `
        <url>
          <loc>${`${baseUrl}/${page}`}</loc>
          <changefreq>weekly</changefreq>
        </url>`
        )
        .join('')}
    </urlset>
    `
  
    // Set the response headers to output XML
    res.setHeader('Content-Type', 'text/xml')
    res.write(sitemap)
    res.end()
  
    return {
      props: {},
    }
  }
  
  export default Sitemap
  