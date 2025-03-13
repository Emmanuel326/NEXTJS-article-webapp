import Head from "next/head";
import PropTypes from "prop-types";

const SEO = ({ title, description, url, image, keywords, canonical }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article", // Can be changed to "WebPage" if it's not always an article
    "headline": title || "Default Title",
    "description": description || "Default description for your website.",
    "url": url || "https://yourdomain.com",
    "image": image ? [image] : ["https://yourdomain.com/default-image.jpg"],
    "publisher": {
      "@type": "Organization",
      "name": "Your Website Name",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yourdomain.com/logo.png"
      }
    },
    "author": {
      "@type": "Person",
      "name": "Your Author Name" // Can be dynamically set based on the article's author
    },
    "datePublished": new Date().toISOString(), // Ideally, fetch from article data
    "dateModified": new Date().toISOString()
  };

  return (
    <Head>
      {/* Page Title & Description */}
      <title>{title || "Default Title"}</title>
      <meta name="description" content={description || "Default description for your website."} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonical || url || "https://fynanceguide.site"} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title || "Default Title"} />
      <meta property="og:description" content={description || "Default description for your website."} />
      <meta property="og:url" content={url || "https://fynanceguide.site"} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content="article" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || "Default Title"} />
      <meta name="twitter:description" content={description || "Default description for your website."} />
      {image && <meta name="twitter:image" content={image} />}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Head>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string,
  image: PropTypes.string,
  keywords: PropTypes.string,
  canonical: PropTypes.string,
};

export default SEO;
