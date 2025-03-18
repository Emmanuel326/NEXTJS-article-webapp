"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import styles from "../styles/TopStories.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.fynanceguide.site/api/";

const fetchTopStories = async () => {
  const response = await fetch(`${API_BASE_URL}top-stories/`);
  if (!response.ok) {
    throw new Error("Failed to fetch top stories");
  }
  return response.json();
};

const TopStories = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
    staleTime: 300000, // Cache for 5 minutes
  });

  if (isLoading) return <p className={styles.loading}>Loading top stories...</p>;
  if (error) return <p className={styles.error}>Error: {error.message}</p>;

  // Handle both paginated (data.results) and direct array responses.
  const stories = data?.results ? data.results : Array.isArray(data) ? data : [];

  return (
    <section className={styles.topStories}>
      <h2>Top Stories</h2>
      <div className={styles.scrollableList}>
        {stories.length > 0 ? (
          <ul>
            {stories.map((story) => (
              <li key={story.id}>
                <Link href={story.link} className={styles.storyLink}>
                  {story.excerpt}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noStories}>No top stories available.</p>
        )}
      </div>
    </section>
  );
};

export default TopStories;
