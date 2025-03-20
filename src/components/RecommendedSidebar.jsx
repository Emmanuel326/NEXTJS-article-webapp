"use client";

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import styles from '../styles/RecommendedSidebar.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.fynanceguide.site/api/';

const fetchRecommended = async () => {
  const url = `${API_BASE_URL}recommended/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch recommended article, status code: ${response.status}`);
  }
  
  const data = await response.json();
  // Extract recommended articles from the response.
  const recommendedArticles = data.results ? data.results : Array.isArray(data) ? data : [];
  return recommendedArticles;
};

const RecommendedSidebar = () => {
  const { data: recommendedData = {}, isLoading, error } = useQuery({
    queryKey: ['recommended'],
    queryFn: fetchRecommended,
    staleTime: 300000, // 5 minutes
  });

  if (isLoading) {
    return <p>Loading recommended article...</p>;
  }

  if (error) {
    return <p>Error loading recommended article.</p>;
  }

  const recommended = recommendedData.results
    ? recommendedData.results
    : Array.isArray(recommendedData)
    ? recommendedData
    : [];

  return (
    <aside className={styles.recommendedSidebar}>
      <h3>Recommended For You</h3>
      <div className={styles.scrollableList}>
        <ul>
          {recommended.map((item) => (
            <li key={item.id}>
              <Link href={item.link}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default RecommendedSidebar;
