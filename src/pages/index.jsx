"use client";

import SEO from "../components/Seo";
import LatestBlogs from "../components/LatestBlogs";
import styles from "../styles/home.module.css";
import Head from "next/head";

const Home = () => {
  console.log("Home component rendered");
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Fynance Guide",
    "url": "https://www.fynanceguide.site",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.fynanceguide.site/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      {/* SEO Meta Tags */}
      <SEO
        title="Welcome to Fynance Guide"
        description="Discover the latest insights, trends, and expert advice."
        url="https://www.fynanceguide.site"
        image="https://www.fynanceguide.site/hero-image.jpg"
        keywords="blog, articles, insights, trends"
        canonical="https://www.fynanceguide.site"
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to Fynance Guide</h1>
          <p className={styles.heroSubtitle}>
            Discover the latest insights, trends, and expert advice.
          </p>
        </div>
      </section>

      {/* Featured / Latest Blogs Section */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Latest Blogs</h2>
          <LatestBlogs />
        </div>
      </section>
    </>
  );
};

export default Home;
