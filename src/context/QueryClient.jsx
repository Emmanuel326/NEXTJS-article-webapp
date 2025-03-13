"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const QueryProvider = ({ children }) => {
  // Create a stable QueryClient instance with default options for v5
  const [queryClient] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          // Cache data for 5 minutes
          staleTime: 1000 * 60 * 5,
          // Prevent refetching on window focus
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
