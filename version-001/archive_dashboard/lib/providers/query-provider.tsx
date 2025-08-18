"use client";

import { backgroundSync, createQueryClient } from "@/lib/query-config";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => createQueryClient());

	// Set up background sync for real-time updates
	useEffect(() => {
		backgroundSync.setupPeriodicRefresh(queryClient);
	}, [queryClient]);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{/* React Query Devtools - only in development */}
			{process.env.NODE_ENV === "development" && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
		</QueryClientProvider>
	);
}
