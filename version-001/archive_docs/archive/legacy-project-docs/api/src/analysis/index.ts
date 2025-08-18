import { performAnalysis } from "../lib/analyze-common";
import { Company } from "../lib/types";

export * from "./analyses";
export * from "./check-providers";
export * from "./routes";

export async function performFullAnalysis(
	company: Company,
	useWebSearch: boolean = false,
	customPrompts?: string[]
): Promise<any> {
	// Create a dummy sendEvent function for synchronous operation
	const sendEvent = async (event: any) => {
		// In synchronous mode, we just log the events
		console.log(
			"Analysis event:",
			event.type,
			event.stage,
			event.data?.message || ""
		);
	};

	// Use the SSE-aware performAnalysis function
	return await performAnalysis({
		company,
		customPrompts,
		useWebSearch,
		sendEvent,
	});
}
