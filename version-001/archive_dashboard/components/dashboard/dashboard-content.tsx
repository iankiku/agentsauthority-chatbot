"use client";

import { AIInsightsPrompts } from "./ai-insights-prompts";
import { QuickActionsPanel } from "./quick-actions-panel";
import { SimplifiedDashboardOverview } from "./simplified-dashboard-overview";

export function DashboardContent() {
	return (
		<>
			{/* Simplified Dashboard Overview */}
			<div className="mb-8">
				<SimplifiedDashboardOverview />
			</div>

			{/* AI-Driven Insights and Quick Actions */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<AIInsightsPrompts />
				<QuickActionsPanel />
			</div>
		</>
	);
}
