"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogs } from "../services/api";
import BlogCard from "../components/BlogCard";
import styles from "../styles/latestBlogs.module.css";

const LatestBlogs = () => {
  // Fetch blogs using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["latestBlogs"],
    queryFn: fetchBlogs,
    staleTime: 300000, // Cache for 5 minutes
  });

  // Ensure blogs is always an array
  const blogs = Array.isArray(data) ? data : data?.results || [];

  // Track window width for responsive design
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define breakpoint for desktop
  const isDesktop = windowWidth >= 1024;

  // ✅ Pagination Setup (10 per page)
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  // Get current blogs for the page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArticles = blogs.slice(startIndex, startIndex + itemsPerPage);

  // Pagination controls
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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

      {/* ✅ Pagination Buttons */}
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
