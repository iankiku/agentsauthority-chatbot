"use server";

import { MastraClient } from "@mastra/client-js";

let mastraClientInstance: MastraClient | null = null;

async function getMastraClient() {
	if (!mastraClientInstance) {
		mastraClientInstance = new MastraClient({
			baseUrl: "http://localhost:4111/",
		});
	}
	return mastraClientInstance;
}

export async function getWeatherInfo(
	data: FormData,
	method: "generate" | "stream"
): Promise<string | Response> {
	console.log("Logger: getWeatherInfo called data", data);

	const mastraClient = await getMastraClient();

	const city = data.get("city")?.toString();
	const agent = mastraClient.getAgent("weatherAgent");

	let result: string | Response;
	if (method === "generate") {
		const generateResult = await agent.generate({
			messages: [
				{
					role: "user",
					content: `What's the weather like in ${city}?`,
				},
			],
		});
		console.log(
			"Logger: getWeatherInfo called generate result",
			generateResult
		);
		result = generateResult.text;
	} else if (method === "stream") {
		console.log("Logger: getWeatherInfo called stream");
		result = await agent.stream({
			messages: [
				{
					role: "user",
					content: `What's the weather like in ${city}?`,
				},
			],
		});
		console.log("Logger: getWeatherInfo called stream result", result);
	} else {
		console.log("Logger: getWeatherInfo called invalid method", method);
		throw new Error("Invalid method provided.");
	}

	return result;
}
