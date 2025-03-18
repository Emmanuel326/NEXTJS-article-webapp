import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogs } from "../services/api";
import BlogCard from "../components/BlogCard";
import styles from "../styles/latestBlogs.module.css";

// Debounced window width hook
function useDebouncedWindowWidth(delay = 200) {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, delay);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [delay]);

  return width;
}

const LatestBlogs = () => {
  // Fetch blogs using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["latestBlogs"],
    queryFn: fetchBlogs,
    staleTime: 300000, // Cache for 5 minutes
  });

  // Memoize blogs to avoid unnecessary recalculations
  const blogs = useMemo(() => {
    return Array.isArray(data) ? data : data?.results || [];
  }, [data]);

  // Track window width using debounced custom hook
  const windowWidth = useDebouncedWindowWidth(200);
  const isDesktop = useMemo(() => windowWidth >= 1024, [windowWidth]);

  // Pagination setup (10 per page)
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useMemo(() => Math.ceil(blogs.length / itemsPerPage), [blogs]);

  // Get current blogs for the page
  const currentArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return blogs.slice(startIndex, startIndex + itemsPerPage);
  }, [blogs, currentPage, itemsPerPage]);

  // Pagination controls wrapped in useCallback for optimization
  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  // Reset to first page when blogs change
  useEffect(() => {
    setCurrentPage(1);
  }, [blogs]);

  // Loading & error handling
  if (isLoading) return <p className="has-text-centered">Loading...</p>;
  if (error) return <p className="has-text-centered has-text-danger">Error loading blogs.</p>;

  return (
    <section className={isDesktop ? styles.latestBlogsDesktop : styles.latestBlogsMobile}>
      <h2 className={styles.sectionTitle}>Latest Blogs</h2>

      <div className={isDesktop ? styles.blogsGrid : styles.blogsContainer}>
        {currentArticles.map((blog) => (
          <div key={blog.id} className={styles.blogCardWrapper}>
            <BlogCard article={blog} />
          </div>
        ))}
      </div>

      {/* Pagination Buttons */}
      {totalPages > 1 && (
        <div className={styles.pagination} style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Prev
          </button>
          <span style={{ margin: "0 10px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default LatestBlogs;
