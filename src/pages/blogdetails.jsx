"use client";

import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogBySlug } from "../../../services/api";
import SEO from "../../../components/Seo";
import Head from "next/head";
import styles from "../../../styles/BlogDetails.module.css";

const BlogDetails = () => {
  const router = useRouter();

  // Wait until the router is ready and query object exists
  if (!router.isReady || !router.query) {
    return <p>Loading...</p>;
  }

  // Instead of destructuring inline, extract safely
  const query = router.query;
  const categorySlug = query.categorySlug;
  const blogSlug = query.blogSlug;

  // If the necessary parameters are still missing, show loading
  if (!categorySlug || !blogSlug) {
    return <p>Loading...</p>;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["blog", blogSlug],
    queryFn: () => fetchBlogBySlug(blogSlug),
    enabled: !!blogSlug,
  });

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.centerText}>Loading article...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.errorText}>Error loading blog: {error.message}</p>
        </div>
      </section>
    );
  }

  const article = data || {};

  if (!article.title) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.centerText}>
            Article not found. It may have been deleted or does not exist.
          </p>
        </div>
      </section>
    );
  }

  const pageUrl = `https://yourfrontenddomain.com/category/${categorySlug}/${article.slug}`;
  const pageTitle = `${article.title} | My Blog`;
  const pageDescription = article.excerpt || article.content.slice(0, 150);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": pageDescription,
    "image": article.image || "/default-image.jpg",
    "author": {
      "@type": "Person",
      "name": article.author || "Unknown",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Your Website Name",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yourfrontenddomain.com/logo.png",
      },
    },
    "datePublished": article.publishedAt || new Date().toISOString(),
    "dateModified": article.updatedAt || new Date().toISOString(),
    "url": pageUrl,
  };

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        url={pageUrl}
        image={article.image || "/default-image.jpg"}
        canonical={pageUrl}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <section className={`${styles.section} ${styles.blogDetails}`}>
        <div className={styles.container}>
          <h1 className={styles.title}>{article.title}</h1>
          <figure className={styles.image}>
            <img
              src={article.image || "/default-image.jpg"}
              alt={article.title || "Blog Image"}
              onError={(e) => (e.target.src = "/default-image.jpg")}
            />
          </figure>
          <div className={styles.content}>
            <p>{article.content || "No content available for this article."}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
