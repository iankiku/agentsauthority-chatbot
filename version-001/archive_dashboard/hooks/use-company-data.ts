import { useSession } from "@/lib/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Company {
	id: string;
	userId: string;
	name: string;
	url: string;
	industry?: string;
	description?: string;
	logo?: string;
	favicon?: string;
	scrapedData?: any;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	competitors?: Competitor[];
	brandAnalysisResults?: BrandAnalysisResult[];
}

export interface Competitor {
	id: string;
	companyId: string;
	name: string;
	url?: string;
	industry?: string;
	description?: string;
	logo?: string;
	favicon?: string;
	scrapedData?: any;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface BrandAnalysisResult {
	id: string;
	companyId: string;
	userId: string;
	visibilityScore?: number;
	sentimentScore?: number;
	shareOfVoice?: number;
	overallScore?: number;
	averagePosition?: number;
	weeklyChange?: number;
	monthlyAnalyses?: number;
	competitorsTracked?: number;
	marketRank?: number;
	rankChange?: number;
	platformPerformance?: any[];
	recentActivity?: any[];
	keyInsights?: any[];
	competitorData?: any;
	promptsData?: any;
	analysisType?: string;
	creditsUsed?: number;
	isLatest: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateCompanyData {
	name: string;
	url: string;
	industry?: string;
	description?: string;
}

export interface UpdateCompanyData {
	name?: string;
	url?: string;
	industry?: string;
	description?: string;
}

// Fetch all companies for the current user
export function useCompanies() {
	const { data: session } = useSession();

	return useQuery({
		queryKey: ["companies"],
		queryFn: async () => {
			const response = await fetch("/api/companies");
			if (!response.ok) {
				const errorData = await response
					.json()
					.catch(() => ({ message: "Failed to fetch companies" }));
				throw new Error(errorData.message || "Failed to fetch companies");
			}
			const data = await response.json();
			return data.companies as Company[];
		},
		enabled: !!session?.user,
		retry: false, // Don't retry auth failures
		staleTime: 30000, // Consider data fresh for 30 seconds
	});
}

// Fetch a specific company by ID
export function useCompany(companyId: string) {
	const { data: session } = useSession();

	return useQuery({
		queryKey: ["company", companyId],
		queryFn: async () => {
			const response = await fetch(`/api/companies/${companyId}`);
			if (!response.ok) {
				throw new Error("Failed to fetch company");
			}
			const data = await response.json();
			return data.company as Company;
		},
		enabled: !!session?.user && !!companyId,
	});
}

// Get the latest brand analysis for a company
export function useLatestAnalysis(companyId: string) {
	const { data: company } = useCompany(companyId);

	return {
		data: company?.brandAnalysisResults?.[0] || null,
		isLoading: !company,
		error: null,
	};
}

// Create a new company
export function useCreateCompany() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (companyData: CreateCompanyData) => {
			const response = await fetch("/api/companies", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(companyData),
			});

			if (!response.ok) {
				throw new Error("Failed to create company");
			}

			const data = await response.json();
			return data.company as Company;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["companies"] });
		},
	});
}

// Update a company
export function useUpdateCompany() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			companyId,
			updates,
		}: {
			companyId: string;
			updates: UpdateCompanyData;
		}) => {
			const response = await fetch(`/api/companies/${companyId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updates),
			});

			if (!response.ok) {
				throw new Error("Failed to update company");
			}

			const data = await response.json();
			return data.company as Company;
		},
		onSuccess: (_, { companyId }) => {
			queryClient.invalidateQueries({ queryKey: ["companies"] });
			queryClient.invalidateQueries({ queryKey: ["company", companyId] });
		},
	});
}

// Delete a company
export function useDeleteCompany() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (companyId: string) => {
			const response = await fetch(`/api/companies/${companyId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete company");
			}

			return { companyId };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["companies"] });
		},
	});
}

// Get demo data (for fallback when no real data exists)
export function useDemoCompany(): Company | null {
	const { data: companies } = useCompanies();

	// Return the first company if it exists, or null
	return companies?.[0] || null;
}

// Helper hook to get dashboard data
export function useDashboardData() {
	const { data: companies, isLoading: companiesLoading } = useCompanies();
	const demoCompany = useDemoCompany();
	const { data: latestAnalysis, isLoading: analysisLoading } =
		useLatestAnalysis(demoCompany?.id || "");

	const isLoading = companiesLoading || (demoCompany?.id && analysisLoading);

	// If we have real data, use it; otherwise return default values
	if (demoCompany && latestAnalysis) {
		return {
			company: demoCompany,
			analysis: latestAnalysis,
			competitors: demoCompany.competitors || [],
			platformPerformance: latestAnalysis.platformPerformance || [],
			recentActivity: latestAnalysis.recentActivity || [],
			keyInsights: latestAnalysis.keyInsights || [],
			usageStats: {
				analyses: {
					used: latestAnalysis.monthlyAnalyses || 0,
					limit: 50,
					percentage: ((latestAnalysis.monthlyAnalyses || 0) / 50) * 100,
				},
				apiCalls: { used: 1200, limit: 5000, percentage: 24 }, // Mock for now
			},
			isLoading: false,
		};
	}

	// Return default/empty state
	return {
		company: null,
		analysis: null,
		competitors: [],
		platformPerformance: [],
		recentActivity: [],
		keyInsights: [],
		usageStats: {
			analyses: { used: 0, limit: 50, percentage: 0 },
			apiCalls: { used: 0, limit: 5000, percentage: 0 },
		},
		isLoading,
	};
}
