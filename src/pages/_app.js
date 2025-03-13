import "../styles/global.css";
import NavBar from "../components/NavBar";
import Footer from "../pages/Footer"; // Ensure this is the correct path
import SEO from "../components/Seo";
import Head from "next/head";
import "../styles/navbar.module.css";
import QueryProvider from "../context/QueryProvider"; // Adjust the path if needed

function MyApp({ Component, pageProps }) {
  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Finance Insights",
    "url": "https://yourdomain.com",
    "logo": "https://yourdomain.com/logo.png",
    "sameAs": [
      "https://www.facebook.com/yourpage",
      "https://twitter.com/yourhandle",
      "https://www.linkedin.com/company/yourcompany"
    ]
  };

  return (
    <QueryProvider>
      <SEO
        title="Finance Insights - Your Trusted Finance Hub"
        description="Get the latest financial insights, investment strategies, and economic trends to make informed financial decisions."
        url="https://yourdomain.com"
        keywords="finance, investing, cryptocurrency, stock market, economic analysis"
        canonical="https://yourdomain.com"
      />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    </QueryProvider>
  );
}

export default MyApp;
