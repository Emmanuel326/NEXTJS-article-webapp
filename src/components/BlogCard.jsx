"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import styles from "../styles/BlogCard.module.css";

const BlogCard = ({ article, priority = false }) => {
  if (!article) {
    return (
      <div className={`${styles.notification} ${styles.warning}`}>
        No article data available
      </div>
    );
  }

  // Use provided image URL or fallback to a default image
  const imageUrl = article.image?.trim() ? article.image : "/default-blog.jpg";

  // Format date for display
  const formattedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "📅 Unknown Date";

  // Construct URL based on article category and slug
  const articleSlug = `/category/${article.category?.slug || "uncategorized"}/${article.slug}`;

  return (
    <div className={styles.blogCard}>
      <Link href={articleSlug} legacyBehavior>
        <a className={styles.link}>
          <div className={styles.blogCardImage}>
            <figure className={styles.imageContainer}>
              <Image
                src={imageUrl}
                alt={article.title ? `Cover image for ${article.title}` : "Blog Image"}
                width={400}
                height={250}
                layout="responsive"
                className={styles.image}
                placeholder="blur"
                blurDataURL="/default-blur.jpg" // Low-quality placeholder image
                priority={priority} // Optionally mark as priority if above-the-fold
              />
            </figure>
          </div>
          <div className={styles.blogCardContent}>
            <h2 className={styles.title}>{article.title}</h2>
            <p className={styles.content}>
              {article.excerpt || "No excerpt available"}
            </p>
            <small className={styles.date}>{formattedDate}</small>
          </div>
          <footer className={styles.blogCardFooter}>
            <span className={styles.footerItem}>Read More →</span>
          </footer>
        </a>
      </Link>
    </div>
  );
};

BlogCard.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    image: PropTypes.string,
    created_at: PropTypes.string,
    category: PropTypes.shape({
      slug: PropTypes.string,
    }),
    subcategory: PropTypes.shape({
      slug: PropTypes.string,
    }),
  }).isRequired,
  priority: PropTypes.bool, // Optional prop to flag critical images for LCP
};

export default BlogCard;
