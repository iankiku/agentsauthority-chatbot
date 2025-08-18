import { QueryClient } from '@tanstack/react-query';

// Optimized query configuration for better performance
export const queryConfig = {
  defaultOptions: {
    queries: {
      // Stale time - how long data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes (increased from 1 minute)
      
      // Cache time - how long data stays in cache after component unmounts
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
      
      // Retry configuration
      retry: (failureCount: number, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus (disabled for better UX)
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Refetch on mount only if data is stale
      refetchOnMount: 'stale',
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
};

// Create optimized query client
export function createQueryClient() {
  return new QueryClient(queryConfig);
}

// Query keys for better cache management
export const queryKeys = {
  // Dashboard queries
  dashboard: {
    all: ['dashboard'] as const,
    overview: () => [...queryKeys.dashboard.all, 'overview'] as const,
    metrics: (timeRange: string) => [...queryKeys.dashboard.all, 'metrics', timeRange] as const,
    platforms: () => [...queryKeys.dashboard.all, 'platforms'] as const,
    competitors: () => [...queryKeys.dashboard.all, 'competitors'] as const,
    insights: () => [...queryKeys.dashboard.all, 'insights'] as const,
    activity: (page: number = 1) => [...queryKeys.dashboard.all, 'activity', page] as const,
  },
  
  // Company queries
  company: {
    all: ['company'] as const,
    detail: (id: string) => [...queryKeys.company.all, 'detail', id] as const,
    analysis: (id: string) => [...queryKeys.company.all, 'analysis', id] as const,
    performance: (id: string, timeRange: string) => [...queryKeys.company.all, 'performance', id, timeRange] as const,
  },
  
  // User queries
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    settings: () => [...queryKeys.user.all, 'settings'] as const,
    notifications: () => [...queryKeys.user.all, 'notifications'] as const,
  },
  
  // Chat queries
  chat: {
    all: ['chat'] as const,
    conversations: () => [...queryKeys.chat.all, 'conversations'] as const,
    messages: (conversationId: string) => [...queryKeys.chat.all, 'messages', conversationId] as const,
  },
  
  // Analysis queries
  analysis: {
    all: ['analysis'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.analysis.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.analysis.all, 'detail', id] as const,
    reports: (id: string) => [...queryKeys.analysis.all, 'reports', id] as const,
  },
} as const;

// Prefetch strategies for common data
export const prefetchStrategies = {
  // Prefetch dashboard data on app load
  dashboard: async (queryClient: QueryClient) => {
    await Promise.allSettled([
      queryClient.prefetchQuery({
        queryKey: queryKeys.dashboard.overview(),
        queryFn: () => fetch('/api/dashboard/overview').then(res => res.json()),
        staleTime: 5 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.dashboard.platforms(),
        queryFn: () => fetch('/api/dashboard/platforms').then(res => res.json()),
        staleTime: 5 * 60 * 1000,
      }),
    ]);
  },
  
  // Prefetch user data on authentication
  user: async (queryClient: QueryClient) => {
    await Promise.allSettled([
      queryClient.prefetchQuery({
        queryKey: queryKeys.user.profile(),
        queryFn: () => fetch('/api/user/profile').then(res => res.json()),
        staleTime: 10 * 60 * 1000, // User data changes less frequently
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.user.notifications(),
        queryFn: () => fetch('/api/user/notifications').then(res => res.json()),
        staleTime: 2 * 60 * 1000, // Notifications should be fresher
      }),
    ]);
  },
};

// Cache invalidation helpers
export const cacheInvalidation = {
  // Invalidate all dashboard data
  invalidateDashboard: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
  },
  
  // Invalidate specific dashboard sections
  invalidateDashboardMetrics: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all, predicate: (query) => 
      query.queryKey.includes('metrics') || query.queryKey.includes('overview')
    });
  },
  
  // Invalidate user data
  invalidateUser: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
  },
  
  // Invalidate company data
  invalidateCompany: (queryClient: QueryClient, companyId?: string) => {
    if (companyId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.company.detail(companyId) });
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.company.all });
    }
  },
};

// Background sync for real-time updates
export const backgroundSync = {
  // Set up periodic refresh for critical data
  setupPeriodicRefresh: (queryClient: QueryClient) => {
    // Refresh dashboard overview every 5 minutes
    setInterval(() => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview() });
    }, 5 * 60 * 1000);
    
    // Refresh notifications every 2 minutes
    setInterval(() => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.notifications() });
    }, 2 * 60 * 1000);
  },
};
