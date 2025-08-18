import { getAgent } from "@/lib/mastra-client";

export async function getWeatherInfo(
	city: string,
	method: "generate" | "stream"
): Promise<string | Response> {
	console.log("Logger: getWeatherInfo called city", city);

	const agent = await getAgent("weatherAgent");
	const prompt = `What's the weather like in ${city}?`;
	let result: string | Response;
	if (method === "generate") {
		const generateResult = await agent.generate({
			messages: [
				{
					role: "user",
					content: prompt,
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
					content: prompt,
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
