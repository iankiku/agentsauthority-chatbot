import { getWeatherInfo } from "@/app/lib/actions/agents";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const city = request.nextUrl.searchParams.get("city");
	console.log("city", city);

	if (!city) {
		return new Response("City parameter is missing", { status: 400 });
	}

	const data = new FormData();
	data.append("city", city);

	const weatherInfo = await getWeatherInfo(data, "stream");

	if (typeof weatherInfo === "string") {
		console.log("Logger: weatherInfo is a string", weatherInfo);
		return new Response(weatherInfo, { status: 200 });
	}

	console.log("Logger: weatherInfo is a response", weatherInfo);

	return new Response(weatherInfo.body, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	});
}
