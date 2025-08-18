import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { useDashboardStore } from '@/stores/dashboard-store';

export function useClientNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { setActiveTab } = useDashboardStore();

  const navigateTo = useCallback((path: string, options?: { replace?: boolean }) => {
    // Update the active tab in the store
    const tabName = path.split('/').pop() || 'dashboard';
    setActiveTab(tabName);

    // Use Next.js router for client-side navigation
    if (options?.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  }, [router, setActiveTab]);

  const isActive = useCallback((path: string) => {
    return pathname === path;
  }, [pathname]);

  const isActiveSection = useCallback((basePath: string) => {
    return pathname.startsWith(basePath);
  }, [pathname]);

  return {
    navigateTo,
    isActive,
    isActiveSection,
    currentPath: pathname,
  };
}
