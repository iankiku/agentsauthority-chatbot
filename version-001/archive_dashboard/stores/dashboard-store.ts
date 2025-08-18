import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface DashboardState {
  // UI State
  sidebarCollapsed: boolean;
  activeTab: string;
  selectedCompany: string | null;
  selectedTimeRange: '7d' | '30d' | '90d' | '1y';
  
  // Dashboard Layout
  dashboardLayout: 'grid' | 'list';
  pinnedMetrics: string[];
  hiddenMetrics: string[];
  
  // Filters
  platformFilters: string[];
  competitorFilters: string[];
  
  // User Preferences
  theme: 'light' | 'dark' | 'system';
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
  
  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveTab: (tab: string) => void;
  setSelectedCompany: (companyId: string | null) => void;
  setSelectedTimeRange: (range: '7d' | '30d' | '90d' | '1y') => void;
  setDashboardLayout: (layout: 'grid' | 'list') => void;
  toggleMetricPin: (metricId: string) => void;
  toggleMetricVisibility: (metricId: string) => void;
  setPlatformFilters: (platforms: string[]) => void;
  setCompetitorFilters: (competitors: string[]) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  addNotification: (notification: Omit<DashboardState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  resetDashboard: () => void;
}

const initialState = {
  sidebarCollapsed: false,
  activeTab: 'dashboard',
  selectedCompany: null,
  selectedTimeRange: '30d' as const,
  dashboardLayout: 'grid' as const,
  pinnedMetrics: ['geo-score', 'market-rank', 'visibility-score'],
  hiddenMetrics: [],
  platformFilters: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'],
  competitorFilters: [],
  theme: 'system' as const,
  autoRefresh: true,
  refreshInterval: 300, // 5 minutes
  notifications: [],
};

export const useDashboardStore = create<DashboardState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        setSidebarCollapsed: (collapsed) => 
          set({ sidebarCollapsed: collapsed }, false, 'setSidebarCollapsed'),
          
        setActiveTab: (tab) => 
          set({ activeTab: tab }, false, 'setActiveTab'),
          
        setSelectedCompany: (companyId) => 
          set({ selectedCompany: companyId }, false, 'setSelectedCompany'),
          
        setSelectedTimeRange: (range) => 
          set({ selectedTimeRange: range }, false, 'setSelectedTimeRange'),
          
        setDashboardLayout: (layout) => 
          set({ dashboardLayout: layout }, false, 'setDashboardLayout'),
          
        toggleMetricPin: (metricId) => 
          set((state) => {
            const isPinned = state.pinnedMetrics.includes(metricId);
            return {
              pinnedMetrics: isPinned
                ? state.pinnedMetrics.filter(id => id !== metricId)
                : [...state.pinnedMetrics, metricId]
            };
          }, false, 'toggleMetricPin'),
          
        toggleMetricVisibility: (metricId) => 
          set((state) => {
            const isHidden = state.hiddenMetrics.includes(metricId);
            return {
              hiddenMetrics: isHidden
                ? state.hiddenMetrics.filter(id => id !== metricId)
                : [...state.hiddenMetrics, metricId]
            };
          }, false, 'toggleMetricVisibility'),
          
        setPlatformFilters: (platforms) => 
          set({ platformFilters: platforms }, false, 'setPlatformFilters'),
          
        setCompetitorFilters: (competitors) => 
          set({ competitorFilters: competitors }, false, 'setCompetitorFilters'),
          
        setTheme: (theme) => 
          set({ theme }, false, 'setTheme'),
          
        setAutoRefresh: (enabled) => 
          set({ autoRefresh: enabled }, false, 'setAutoRefresh'),
          
        setRefreshInterval: (interval) => 
          set({ refreshInterval: interval }, false, 'setRefreshInterval'),
          
        addNotification: (notification) => 
          set((state) => ({
            notifications: [
              {
                ...notification,
                id: `notification-${Date.now()}-${Math.random()}`,
                timestamp: new Date(),
                read: false,
              },
              ...state.notifications,
            ].slice(0, 50) // Keep only last 50 notifications
          }), false, 'addNotification'),
          
        markNotificationRead: (id) => 
          set((state) => ({
            notifications: state.notifications.map(n => 
              n.id === id ? { ...n, read: true } : n
            )
          }), false, 'markNotificationRead'),
          
        clearNotifications: () => 
          set({ notifications: [] }, false, 'clearNotifications'),
          
        resetDashboard: () => 
          set(initialState, false, 'resetDashboard'),
      }),
      {
        name: 'dashboard-store',
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          selectedTimeRange: state.selectedTimeRange,
          dashboardLayout: state.dashboardLayout,
          pinnedMetrics: state.pinnedMetrics,
          hiddenMetrics: state.hiddenMetrics,
          platformFilters: state.platformFilters,
          competitorFilters: state.competitorFilters,
          theme: state.theme,
          autoRefresh: state.autoRefresh,
          refreshInterval: state.refreshInterval,
        }),
      }
    ),
    { name: 'dashboard-store' }
  )
);

// Selectors for better performance
export const useSidebarCollapsed = () => useDashboardStore(state => state.sidebarCollapsed);
export const useActiveTab = () => useDashboardStore(state => state.activeTab);
export const useSelectedCompany = () => useDashboardStore(state => state.selectedCompany);
export const useSelectedTimeRange = () => useDashboardStore(state => state.selectedTimeRange);
export const useDashboardLayout = () => useDashboardStore(state => state.dashboardLayout);
export const usePinnedMetrics = () => useDashboardStore(state => state.pinnedMetrics);
export const useNotifications = () => useDashboardStore(state => state.notifications);
export const useUnreadNotifications = () => useDashboardStore(state => 
  state.notifications.filter(n => !n.read)
);
