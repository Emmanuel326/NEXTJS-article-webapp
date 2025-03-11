import React from "react";
import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import styles from "../styles/BlogCard.module.css";

const BlogCard = ({ article }) => {
  if (!article) {
    console.warn("No article data available.");
    return (
      <div className={`${styles.notification} ${styles.warning}`}>
        No article data available
      </div>
    );
  }

  const imageUrl = article.image?.trim() ? article.image : "/default-blog.jpg";

  const formattedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "📅 Unknown Date";

  // Use category-based routing
  let articleSlug = `/category/${article.category?.slug || "uncategorized"}/${article.slug}`;

  // Debugging logs
  console.log("Rendering BlogCard for:", article.title);
  console.log("Article Slug:", articleSlug);

  const handleClick = () => {
    console.log(`BlogCard clicked! Navigating to: ${articleSlug}`);
  };

  return (
    <div className={styles.blogCard} onClick={handleClick}>
      <Link href={articleSlug} legacyBehavior>
        <a className={styles.link}>
          <div className={styles.blogCardImage}>
            <figure className={styles.imageContainer}>
              <Image
                src={imageUrl}
                alt={article.title ? `Cover image for ${article.title}` : "Blog Image"}
                width={400}
                height={250}
                className={styles.image}
                loading="lazy"
                priority={false}
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
};

export default BlogCard;
