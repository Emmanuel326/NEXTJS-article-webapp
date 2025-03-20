"use client";

import React, { useEffect } from 'react';
import Head from 'next/head';
import SEO from "../components/Seo";
import LatestBlogs from "../components/LatestBlogs";
import styles from "../styles/home.module.css";

const Home = () => {
  console.log("Home component is rendering");

  useEffect(() => {
    console.log("Home component mounted");
  }, []);

  return (
    <>
      <Head>
        {/* Meta tags can go here */}
      </Head>
      <SEO 
        title="Welcome to Fynance Guide"
        description="Discover the latest insights, trends, and expert advice."
        url="https://www.fynanceguide.site"
        image="https://www.fynanceguide.site/hero-image.jpg"
        keywords="blog, articles, insights, trends"
        canonical="https://www.fynanceguide.site"
      />

      <section className={styles.hero}>
        {/* Hero content */}
      </section>

      <div className={styles.container}>
        <section className={styles.latestBlogsSection}>
          <LatestBlogs />
        </section>
      </div>
    </>
  );
};

export default Home;
