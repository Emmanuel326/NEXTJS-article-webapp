import React from 'react';
import Head from 'next/head';
import SEO from "../components/Seo";
import LatestBlogs from "../components/LatestBlogs";
import styles from "../styles/home.module.css";

const Home = () => {
  return (
    <>
      <Head>
        {/* Include your structured data and meta tags here */}
      </Head>
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
        {/* Your hero content */}
      </section>

      {/* Page-specific content */}
      <div className={styles.container}>
        <section className={styles.latestBlogsSection}>
          <LatestBlogs />
        </section>
      </div>
    </>
  );
};

export default Home;
