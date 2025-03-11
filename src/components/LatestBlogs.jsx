"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBlogs } from "../services/api";
import BlogCard from "../components/BlogCard";
import { useState, useEffect } from "react";

const LatestBlogs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["latestBlogs"],
    queryFn: fetchBlogs,
  });

  const itemsPerPage = 10; // 2 columns x 5 rows
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate blogs even if data is not available yet
  const blogs = Array.isArray(data) ? data : data?.results || [];
  const totalPages = blogs.length ? Math.ceil(blogs.length / itemsPerPage) : 0;
  const currentItems = blogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Reset pagination when blogs data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [blogs]);

  return (
    <section className="section">
      <div className="container">
        {isLoading ? (
          <p className="has-text-centered">Loading...</p>
        ) : error ? (
          <p className="has-text-centered has-text-danger">
            Error loading blogs.
          </p>
        ) : (
          <>
            <div className="blog-cards-container">
              {currentItems.map((blog) => (
                <BlogCard key={blog.id} article={blog} />
              ))}
            </div>
            {/* Always render pagination controls */}
            <div
              className="pagination"
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                Prev
              </button>
              <span style={{ margin: "0 10px" }}>
                {currentPage} of {totalPages}
              </span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LatestBlogs;
