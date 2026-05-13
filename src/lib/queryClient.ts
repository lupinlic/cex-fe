import { QueryClient, DefaultOptions } from '@tanstack/react-query';

/**
 * Default query and mutation options
 * Customize based on your app's requirements
 */
const queryConfig: DefaultOptions = {
  queries: {
    // Don't refetch stale data automatically
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  mutations: {
    retry: 1,
  },
};

/**
 * Create a singleton QueryClient instance
 * This instance is shared across the entire app
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
};

// Export singleton
export const queryClient = createQueryClient();
