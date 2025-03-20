"use client";

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.fynanceguide.site/api/";

const fetchData = async (endpoint, params = {}) => {
  try {
    const url = `${API_URL}${endpoint}/`;
    const response = await axios.get(url, { params });
    if (!response.data) {
      throw new Error("Invalid data structure received");
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error?.response?.status, error?.message);
    return { error: `Failed to fetch ${endpoint}. Please try again later.` };
  }
};

export const fetchCategories = async () => {
  const result = await fetchData("categories");
  if (result && result.results && Array.isArray(result.results)) {
    return result.results.map((category) => ({
      ...category,
      subcategories: category.subcategories || [],
    }));
  }
  return [];
};

export const fetchBlogs = async ({ page = 1, limit = 10, categoryId = null } = {}) => {
  const endpoint = "articles";
  const params = { page, limit };
  if (categoryId) {
    params.category = categoryId;
  }
  const result = await fetchData(endpoint, params);
  return Array.isArray(result) ? { results: result } : result;
};

export const fetchBlogById = async (id) => {
  const result = await fetchData(`articles/${id}`);
  return result;
};

export const fetchBlogBySlug = async (slug) => {
  const result = await fetchData(`articles/slug/${slug}`);
  return result;
};

export const fetchAllArticles = async () => {
  try {
    const url = `${API_URL}articles/`;
    const response = await axios.get(url, { params: { limit: 1000 } });
    return response.data.results || response.data;
  } catch (error) {
    console.error("Error fetching all articles:", error?.response?.status, error?.message);
    return [];
  }
};

export const createArticle = async (articleData) => {
  try {
    const url = `${API_URL}articles/`;
    const response = await axios.post(url, articleData);
    return response.data;
  } catch (error) {
    console.error("Error creating article:", error?.response?.status, error?.message);
    throw new Error("Failed to create article. Please try again later.");
  }
};

export const fetchTopStories = async () => {
  const result = await fetchData("top-stories");
  return result;
};

export const fetchRecommended = async () => {
  const result = await fetchData("recommended");
  return result;
};
