"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Global React Query provider.
 * Creates a single QueryClient instance per React tree (via useState)
 * so it survives re-renders but is NOT shared across SSR requests.
 */
export default function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes — avoids unnecessary refetches
            refetchOnWindowFocus: false, // opt-in per query if needed
            retry: 2, // retry failed requests twice before surfacing error
          },
          mutations: {
            retry: 0, // mutations should not silently retry
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
