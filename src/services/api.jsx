import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.fynanceguide.site/api/';

console.log("API Base URL:", API_URL);

// Utility function to handle API requests
const fetchData = async (endpoint, params = {}) => {
  try {
    const url = `${API_URL}${endpoint}/`;
    console.log(`Fetching: ${url} with params:`, params);

    const response = await axios.get(url, { params });

    console.log(`Response from ${endpoint}:`, response.status, response.data);
    if (!response.data) {
      throw new Error("Invalid data structure received");
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error?.response?.status, error?.message);
    return { error: `Failed to fetch ${endpoint}. Please try again later.` };
  }
};

// Fetch all categories and their subcategories
export const fetchCategories = async () => {
  console.log("Fetching categories and subcategories...");
  const result = await fetchData("categories");
  console.log("Categories fetch result:", result);

  // Updated to handle the paginated response structure (count, next, previous, results)
  if (result && result.results && Array.isArray(result.results)) {
    return result.results.map(category => ({
      ...category,
      subcategories: category.subcategories || []  // Ensure subcategories is always an array
    }));
  }
  return [];
};

// Fetch all blogs (supports pagination & category filtering)
export const fetchBlogs = async ({ page = 1, limit = 10, categoryId = null } = {}) => {
  const endpoint = categoryId ? `categories/${categoryId}/articles` : "articles";
  const params = { page, limit };
  console.log("Fetching blogs with params:", params);
  const result = await fetchData(endpoint, params);
  console.log("Blogs fetch result:", result);
  // Wrap the result if it's an array so that we always have a consistent shape
  return Array.isArray(result) ? { results: result } : result;
};

// Fetch a single blog by ID
export const fetchBlogById = async (id) => {
  console.log(`Fetching blog by ID: ${id}`);
  const result = await fetchData(`articles/${id}`);
  console.log(`Blog ${id} fetch result:`, result);
  return result;
};

// Fetch a single blog by slug (new)
export const fetchBlogBySlug = async (slug) => {
  console.log(`Fetching blog by slug: ${slug}`);
  // Assuming your API supports a "slug" endpoint for articles, e.g., articles/slug/{slug}/
  const result = await fetchData(`articles/slug/${slug}`);
  console.log(`Blog with slug ${slug} fetch result:`, result);
  return result;
};

// Fetch all articles (non-paginated, for admin usage)
export const fetchAllArticles = async () => {
  try {
    const url = `${API_URL}articles/`;
    console.log(`Fetching all articles from: ${url}`);
    
    const response = await axios.get(url, { params: { limit: 1000 } });
    
    console.log("All articles fetch response:", response.status, response.data);
    return response.data.results || response.data;
  } catch (error) {
    console.error("Error fetching all articles:", error?.response?.status, error?.message);
    return [];
  }
};

// Create an article (POST request)
export const createArticle = async (articleData) => {
  try {
    const url = `${API_URL}articles/`;
    console.log("Creating article at:", url, "with data:", articleData);

    const response = await axios.post(url, articleData);
    
    console.log("Article created successfully:", response.status, response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating article:", error?.response?.status, error?.message);
    throw new Error("Failed to create article. Please try again later.");
  }
};
