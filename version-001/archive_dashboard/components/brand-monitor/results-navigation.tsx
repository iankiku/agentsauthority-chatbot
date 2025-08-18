import { ResultsTab } from "@/lib/brand-monitor-reducer";

interface BrandData {
	visibilityScore: number;
	sentimentScore: number;
	shareOfVoice: number;
	overallScore: number;
	averagePosition: number;
	weeklyChange?: number;
}

interface ResultsNavigationProps {
	activeTab: ResultsTab;
	onTabChange: (tab: ResultsTab) => void;
	onRestart: () => void;
	brandData?: BrandData;
	brandName?: string;
}

export function ResultsNavigation({
	activeTab,
	onTabChange,
	onRestart,
	brandData,
	brandName,
}: ResultsNavigationProps) {
	const handleTabClick = (tab: ResultsTab) => {
		onTabChange(tab);
	};

	return (
		<nav
			className="w-80 flex-shrink-0 animate-fade-in flex flex-col h-[calc(100vh-8rem)] ml-[-2rem] sticky top-8"
			style={{ animationDelay: "0.3s" }}
		>
			<div className="w-full flex flex-col justify-between flex-1">
				{/* Navigation Tabs - at the top */}
				<div className="space-y-2">
					<button
						onClick={() => handleTabClick("matrix")}
						className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
							activeTab === "matrix"
								? "bg-light-orange text-white shadow-sm"
								: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
						}`}
					>
						Comparison Matrix
					</button>
					<button
						onClick={() => handleTabClick("prompts")}
						className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
							activeTab === "prompts"
								? "bg-light-orange text-white shadow-sm"
								: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
						}`}
					>
						Prompts & Responses
					</button>
					<button
						onClick={() => handleTabClick("rankings")}
						className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
							activeTab === "rankings"
								? "bg-light-orange text-white shadow-sm"
								: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
						}`}
					>
						Provider Rankings
					</button>
					<button
						onClick={() => handleTabClick("visibility")}
						className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
							activeTab === "visibility"
								? "bg-light-orange text-white shadow-sm"
								: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
						}`}
					>
						Visibility Score
					</button>
				</div>

				{/* Analyze another website button - at the bottom */}
				<div className="pt-4 pb-8 border-t border-gray-200">
					<button
						onClick={onRestart}
						className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 bg-gray-800 text-white hover:bg-gray-700 shadow-sm flex items-center gap-2"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Analyze another website
					</button>
				</div>
			</div>
		</nav>
	);
}
