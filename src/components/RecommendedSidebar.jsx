"use client";

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import styles from '../styles/RecommendedSidebar.module.css';
import "../styles/RecommendedSidebar.module.css"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fynanceguide.site/api/';

const fetchRecommended = async () => {
  console.log("fetchRecommended: Starting fetch for recommended article...");
  const url = `${API_BASE_URL}recommended/`;
  console.log("fetchRecommended: Fetching from URL:", url);

  const response = await fetch(url);
  console.log("fetchRecommended: Received response with status", response.status);

  if (!response.ok) {
    console.error("fetchRecommended: Response not OK. Status:", response.status);
    throw new Error('Failed to fetch recommended article');
  }

  const data = await response.json();
  console.log("fetchRecommended: Fetched data:", data);
  // If data has a "results" property (paginated response), extract it.
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
    console.log("RecommendedSidebar: Loading recommended article...");
    return <p>Loading recommended article...</p>;
  }

  if (error) {
    console.error("RecommendedSidebar: Error loading recommended article:", error);
    return <p>Error loading recommended article.</p>;
  }

  // Extract the recommended articles from the paginated response if available.
  const recommended = recommendedData.results
    ? recommendedData.results
    : Array.isArray(recommendedData)
    ? recommendedData
    : [];

  console.log("RecommendedSidebar: Data received:", recommended);

  return (
    <aside className={styles.recommendedSidebar}>
      <h3>Recommended For You</h3>
      <ul>
        {recommended.map((item) => {
          console.log("RecommendedSidebar: Rendering recommended article with id:", item.id);
          return (
            <li key={item.id}>
              <Link href={item.link}>
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default RecommendedSidebar;
