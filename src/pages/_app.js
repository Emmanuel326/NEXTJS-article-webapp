"use client";

import "../styles/global.css";
import NavBar from "../components/NavBar";
import Footer from "../pages/Footer"; // Verify this path is correct
import TopStories from "../components/TopStories";
import RecommendedSidebar from "../components/RecommendedSidebar";
import SEO from "../components/Seo";
import Head from "next/head";
import QueryProvider from "../context/QueryProvider";
import { AuthProvider } from "../context/AuthContext"; // Named import
import styles from "../styles/layout.module.css"; // Import your layout module

function MyApp({ Component, pageProps }) {
  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Finance Insights",
    "url": "https://fynanceguide.site",
    "logo": "https://fynanceguide.site/logo.png",
    "sameAs": [
      "https://www.facebook.com/yourpage",
      "https://twitter.com/yourhandle",
      "https://www.linkedin.com/company/yourcompany"
    ]
  };

  // If the component specifies no layout, just render it without public navigation.
  if (Component.noLayout) {
    return (
      <QueryProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </QueryProvider>
    );
  }

  // Otherwise, render with full public layout.
  return (
    <QueryProvider>
      <AuthProvider>
        <SEO
          title="Finance Insights - Your Trusted Finance Hub"
          description="Get the latest financial insights, investment strategies, and economic trends to make informed financial decisions."
          url="https://fynanceguide.site"
          keywords="finance, investing, cryptocurrency, stock market, economic analysis"
          canonical="https://fynanceguide.site"
        />
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </Head>

        {/* Public Navigation and Layout */}
        <div className={styles.stickyNav}>
          <NavBar />
        </div>
        <div className={styles.layoutWrapper}>
          <div className={styles.topSection}>
            <TopStories />
          </div>
          <div className={styles.contentArea}>
            <div className={styles.mainContent}>
              <Component {...pageProps} />
            </div>
            <div className={styles.stickySide}>
              <RecommendedSidebar />
            </div>
          </div>
        </div>
        <Footer />
      </AuthProvider>
    </QueryProvider>
  );
}

export default MyApp;
