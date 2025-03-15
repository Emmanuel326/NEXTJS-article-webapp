"use client";

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import "../styles/TopStories.module.css"
import styles from '../styles/TopStories.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.fynanceguide.site/api/';

const fetchTopStories = async () => {
  console.log("fetchTopStories: Starting fetch for top stories...");
  const url = `${API_BASE_URL}top-stories/`;
  console.log("fetchTopStories: Fetching from URL:", url);
  
  const response = await fetch(url);
  console.log("fetchTopStories: Response status:", response.status);
  
  if (!response.ok) {
    console.error("fetchTopStories: Response not OK. Status:", response.status);
    throw new Error('Failed to fetch top stories');
  }
  
  const data = await response.json();
  console.log("fetchTopStories: Fetched data:", data);
  return data;
};

const TopStories = () => {
  // Expecting a paginated response with a "results" field.
  const { data: topStoriesData = {}, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
    staleTime: 300000, // 5 minutes
  });

  if (isLoading) {
    console.log("TopStories: Loading top stories...");
    return <p>Loading top stories...</p>;
  }
  
  if (error) {
    console.error("TopStories: Error loading top stories:", error);
    return <p>Error loading top stories.</p>;
  }

  // Extract the array of stories from the paginated response.
  const stories = Array.isArray(topStoriesData.results) ? topStoriesData.results : [];
  console.log("TopStories: Stories extracted:", stories);

  return (
    <section className={styles.topStories}>
      <h2>Top Stories</h2>
      <ul>
        {stories.map((story) => {
          console.log("TopStories: Rendering story with id:", story.id);
          return (
            <li key={story.id}>
              {/* Use the computed link from the serializer */}
              <Link href={story.link}>
                {story.excerpt}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default TopStories;
