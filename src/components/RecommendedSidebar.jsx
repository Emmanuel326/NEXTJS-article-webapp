"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import styles from '../styles/RecommendedSidebar.module.css';
import "../styles/RecommendedSidebar.module.css"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fynanceguide.site/api/';

const fetchRecommended = async () => {
  console.log("fetchRecommended: Function called");
  const url = `${API_BASE_URL}recommended/`;
  console.log("fetchRecommended: Constructed URL:", url);
  
  try {
    const response = await fetch(url);
    console.log("fetchRecommended: Received response with status", response.status);
    
    if (!response.ok) {
      console.error("fetchRecommended: Non-OK response, status:", response.status);
      throw new Error(`Failed to fetch recommended article, status code: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("fetchRecommended: Response data:", data);
    
    // Extract the recommended articles from the response structure.
    const recommendedArticles = data.results ? data.results : Array.isArray(data) ? data : [];
    console.log("fetchRecommended: Processed recommended articles:", recommendedArticles);
    return recommendedArticles;
  } catch (error) {
    console.error("fetchRecommended: Error occurred:", error);
    throw error;
  }
};

const RecommendedSidebar = () => {
  console.log("RecommendedSidebar: Component rendering...");
  const { data: recommendedData = {}, isLoading, error } = useQuery({
    queryKey: ['recommended'],
    queryFn: fetchRecommended,
    staleTime: 300000, // 5 minutes
  });

  useEffect(() => {
    console.log("RecommendedSidebar: useQuery update:", { recommendedData, isLoading, error });
  }, [recommendedData, isLoading, error]);

  if (isLoading) {
    console.log("RecommendedSidebar: Data is still loading...");
    return <p>Loading recommended article...</p>;
  }

  if (error) {
    console.error("RecommendedSidebar: Error encountered while fetching data:", error);
    return <p>Error loading recommended article.</p>;
  }

  // Extract the recommended articles from the paginated response if available.
  const recommended = recommendedData.results
    ? recommendedData.results
    : Array.isArray(recommendedData)
    ? recommendedData
    : [];

  console.log("RecommendedSidebar: Final recommended data to render:", recommended);

  return (
    <aside className={styles.recommendedSidebar}>
      <h3>Recommended For You</h3>
      <ul>
        {recommended.map((item) => {
          console.log("RecommendedSidebar: Rendering item:", { id: item.id, title: item.title, link: item.link });
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
