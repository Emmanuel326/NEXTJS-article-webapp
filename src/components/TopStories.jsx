"use client";

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import styles from '../styles/TopStories.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.fynanceguide.site/api/';

const fetchTopStories = async () => {
  const url = `${API_BASE_URL}top-stories/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch top stories');
  }
  const data = await response.json();
  return data;
};

const TopStories = () => {
  const { data: topStoriesData = {}, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
    staleTime: 300000, // 5 minutes
  });

  if (isLoading) {
    return <p>Loading top stories...</p>;
  }
  
  if (error) {
    return <p>Error loading top stories.</p>;
  }

  // Extract the array of featured stories from the paginated response.
  const stories = Array.isArray(topStoriesData.results) ? topStoriesData.results : [];

  return (
    <section className={styles.topStories}>
      <h2>Top Stories</h2>
      {/* Wrap the list in a scrollable container */}
      <div className={styles.scrollableList}>
        <ul>
          {stories.map((story) => (
            <li key={story.id}>
              <Link href={story.link}>
                <a>{story.excerpt}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TopStories;
