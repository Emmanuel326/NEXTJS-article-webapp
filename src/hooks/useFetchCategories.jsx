import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../services/api";

const useFetchCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    select: (data) => {
      if (!data || !Array.isArray(data)) {
        return [];
      }
      // Recursive function to process categories and include id, name, slug, and subcategories.
      const processCategory = (category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        subcategories: category.subcategories
          ? category.subcategories.map(processCategory)
          : [],
      });
      return data.map(processCategory);
    },
    onError: (error) => {
      console.error("❌ Error fetching categories:", error);
    },
  });
};

export default useFetchCategories;
