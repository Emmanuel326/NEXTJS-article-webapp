import { useQuery } from '@tanstack/react-query';

const fetchTags = async () => {
  const response = await fetch('/api/tags');
  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }
  return response.json();
};

export default function useFetchTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
    staleTime: 300000, // 5 minutes in milliseconds
  });
}
