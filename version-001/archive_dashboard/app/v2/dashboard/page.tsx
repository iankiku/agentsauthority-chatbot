import { Suspense } from "react";
import { DashboardChatCanvas } from "../../../components/v2/dashboard/dashboard-chat-canvas";

export default function V2DashboardPage() {
	return (
		<div className="container mx-auto px-4 py-6 h-full max-w-6xl">
			{/* Optimized Chat Canvas without extra headings to avoid duplication */}
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-[60vh]">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
					</div>
				}
			>
				<DashboardChatCanvas className="h-[calc(100vh-140px)] min-h-[500px]" />
			</Suspense>
		</div>
	);
}
