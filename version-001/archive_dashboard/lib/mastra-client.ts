// !! Do not change this file !!
import { MastraClient } from "@mastra/client-js";


let mastraClientInstance: MastraClient | null = null;

export async function getMastraClient() {
	if (!mastraClientInstance) {
		mastraClientInstance = new MastraClient({
			baseUrl: process.env.MASTRA_BASE_URL || "http://localhost:4111/",
			apiKey: process.env.MASTRA_API_KEY || process.env.OPENAI_API_KEY, // Add API key support
		});
	}
	return mastraClientInstance;
}

export async function getAgent(agentName: string) {
	const mastraClient = await getMastraClient();
	return mastraClient.getAgent(agentName);
}

interface CallAgentApiParams {
	agentName: string;
	messages: Array<{ role: "user" | "assistant"; content: string }>;
	method: "generate" | "stream"; // Add method parameter
	resourceId?: string;
	threadId?: string;
}

export async function callAgentApi({
	agentName,
	messages,
	method,
	resourceId,
	threadId,
}: CallAgentApiParams) {
	const agent = await getAgent(agentName);

	let result: string | Response;
	if (method === "generate") {
		const generateResult = await agent.generate({
			messages,
			resourceId,
			threadId,
		});
		result = generateResult.text;
	} else if (method === "stream") {
		console.log('calling stream in MastraClient')
		const streamResult = await agent.stream({
			messages,
			resourceId,
			threadId,
		});
		console.log('\n\n --- called stream in MastraClient', streamResult)
		result = streamResult;
	} else {
		throw new Error("Invalid method provided.");
	}

	return result;
}
