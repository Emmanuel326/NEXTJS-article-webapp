"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogs, fetchCategories } from "../../services/api";
import BlogCard from "../../components/BlogCard";
import Head from "next/head";
import styles from "../../styles/category.module.css";

const Category = () => {
  // Updated: Use categorySlug from params (dynamic route file is [categorySlug].jsx)
  const params = useParams();
  const slugOrId = params?.categorySlug || "";

  // Determine if the parameter is numeric
  const isNumeric = !isNaN(Number(slugOrId));

  // If not numeric, fetch categories to map the slug to its numeric ID
  const {
    data: categories,
    isLoading: catLoading,
    error: catError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    enabled: !isNumeric, // Only fetch categories if we need to map a slug
  });

  // Default to using slugOrId as the numericId.
  // If the slug is not numeric, try to map it to a category's ID.
  let numericId = slugOrId;
  if (!isNumeric && categories) {
    const matchedCategory = categories.find((cat) => {
      // Convert category name to a slug for comparison.
      const categorySlug = cat.name.toLowerCase().replace(/\s+/g, "-");
      return categorySlug === slugOrId.toLowerCase();
    });
    if (matchedCategory) {
      numericId = matchedCategory.id;
    }
  }

  // Fetch blogs using the resolved numeric ID.
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["blogs", numericId],
    queryFn: () => fetchBlogs({ categoryId: numericId }),
    enabled: Boolean(numericId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Ensure blogs is always an array.
  const blogs = Array.isArray(data) ? data : data?.results || [];

  // For display/SEO, if the URL is a slug, use it to generate a readable title.
  const readableCategory = isNumeric ? slugOrId : slugOrId.replace(/-/g, " ").toUpperCase();
  const pageTitle = `Category: ${readableCategory} | My Blog`;
  const pageDescription = `Explore the latest articles in the ${readableCategory} category. Stay updated with trending blogs.`;

  // JSON-LD Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": pageTitle,
    "description": pageDescription,
    "url": `https://yourwebsite.com/category/${slugOrId}`,
    "hasPart": blogs.map((blog) => ({
      "@type": "BlogPosting",
      "headline": blog.title,
      "url": `https://yourwebsite.com/blog/${blog.slug}`,
      "author": {
        "@type": "Person",
        "name": blog.author?.name || "Unknown",
      },
      "datePublished": blog.publishedAt || new Date().toISOString(),
      "dateModified": blog.updatedAt || blog.publishedAt || new Date().toISOString(),
    })),
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={`https://fynanceguide.site/category/${slugOrId}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <section className={`${styles.section} ${styles.category}`}>
        <div className={styles.container}>
          <h1 className={styles.title}>Category: {readableCategory}</h1>

          {isLoading || isFetching || catLoading ? (
            <p className={styles.centerText}>Loading blogs...</p>
          ) : error || catError ? (
            <p className={styles.errorText}>
              Error: {error?.message || catError?.message}
            </p>
          ) : blogs.length > 0 ? (
            <div className={styles.columns}>
              {blogs.map((blog) => (
                <div key={blog.id} className={styles.column}>
                  <BlogCard article={blog} />
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noBlogs}>No blogs found for this category.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Category;
