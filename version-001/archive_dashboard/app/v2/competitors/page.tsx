import { Suspense } from "react";
import { CompetitorChatCanvas } from "../../../components/v2/competitors/competitor-chat-canvas";

export default function V2CompetitorsPage() {
	return (
		<div className="container mx-auto px-4 py-6 h-full max-w-6xl">
			{/* Clean Chat Canvas without duplicate headings */}
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-[60vh]">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
					</div>
				}
			>
				<CompetitorChatCanvas className="h-[calc(100vh-140px)] min-h-[500px]" />
			</Suspense>
		</div>
	);
}
