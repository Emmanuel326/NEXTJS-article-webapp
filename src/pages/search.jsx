"use client";

import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import Head from "next/head";
import BlogCard from "../components/BlogCard";
import { fetchBlogs } from "../services/api";

const SearchResults = () => {
  const router = useRouter();
  const queryParam = router.query.q || "";

  // Set dynamic page title for SEO
  useEffect(() => {
    document.title = queryParam
      ? `Search results for "${queryParam}" | My Blog`
      : "Search | My Blog";
  }, [queryParam]);

  // Fetch blog data
  const { data: blogsData, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [queryParam]);

  // Handle different states
  let content;
  let filteredBlogs = [];

  if (isLoading) {
    content = <p className="has-text-centered">Loading...</p>;
  } else if (error) {
    content = (
      <p className="has-text-centered has-text-danger">Error fetching blogs</p>
    );
  } else {
    // Extract blogs
    const blogsArray = Array.isArray(blogsData)
      ? blogsData
      : blogsData?.results || [];

    // Fuse.js for search
    const fuse = new Fuse(blogsArray, {
      keys: ["title", "excerpt", "content", "category.name", "tags.name"],
      threshold: 0.3,
    });

    const fuseResults = queryParam
      ? fuse.search(queryParam)
      : blogsArray.map((blog) => ({ item: blog }));

    filteredBlogs = fuseResults.map((result) => result.item);
    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage) || 1;
    const currentItems = filteredBlogs.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    // Pagination handlers
    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () =>
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    content = filteredBlogs.length > 0 ? (
      <>
        <div className="blog-cards-container">
          {currentItems.map((blog) => (
            <BlogCard key={blog.id} article={blog} />
          ))}
        </div>
        <div className="pagination" style={{ textAlign: "center", marginTop: "20px" }}>
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
    ) : (
      <p>No results found.</p>
    );
  }

  return (
    <>
      <Head>
        <title>{queryParam ? `Search results for "${queryParam}"` : "Search"} | My Blog</title>
        <meta name="description" content={`Find articles related to "${queryParam}" on My Blog.`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`Search results for "${queryParam}"`} />
        <meta property="og:description" content={`Explore blog posts related to "${queryParam}".`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://myblog.com/search?q=${queryParam}`} />
        <meta name="twitter:title" content={`Search results for "${queryParam}"`} />
        <meta name="twitter:description" content={`Check out articles related to "${queryParam}".`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <section className="section">
        <div className="container">
          <h1 className="title">Search Results for "{queryParam}"</h1>
          {content}
        </div>
      </section>
    </>
  );
};

export default SearchResults;
