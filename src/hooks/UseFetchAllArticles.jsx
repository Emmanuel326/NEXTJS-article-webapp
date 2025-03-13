import { useQuery } from '@tanstack/react-query';
import { fetchAllArticles } from '../services/api';

const useFetchAllArticles = () => {
  return useQuery({
    queryKey: ['allArticles'],
    queryFn: fetchAllArticles,
    select: (data) => {
      // Ensure that we always return an array.
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.results)) return data.results;
      return [];
    },
    onError: (error) => console.error('❌ Error in useFetchAllArticles:', error),
  });
};

export default useFetchAllArticles;
