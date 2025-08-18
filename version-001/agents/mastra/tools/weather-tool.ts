import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface GeocodingResponse {
	results: {
		latitude: number;
		longitude: number;
		name: string;
	}[];
}
interface WeatherResponse {
	current: {
		time: string;
		temperature_2m: number;
		apparent_temperature: number;
		relative_humidity_2m: number;
		wind_speed_10m: number;
		wind_gusts_10m: number;
		weather_code: number;
	};
}

export const weatherTool = createTool({
	id: "get-weather",
	description: "Get current weather for a location",
	inputSchema: z.object({
		location: z.string().describe("City name"),
	}),
	outputSchema: z.object({
		type: z.literal("weather-card"),
		data: z.object({
			location: z.string().describe("The city and country for the weather."),
			temperature: z.number().describe("Current temperature in Celsius."),
			unit: z.enum(["C", "F"]).describe("Unit of temperature."),
			condition: z
				.string()
				.describe("Weather condition (e.g., 'Sunny', 'Partly Cloudy')."),
			icon: z
				.string()
				.optional()
				.describe("Optional: URL or identifier for a weather icon."),
			humidity: z
				.number()
				.optional()
				.describe("Optional: Humidity percentage."),
			windSpeed: z
				.number()
				.optional()
				.describe("Optional: Wind speed in km/h."),
			forecast: z
				.array(
					z.object({
						day: z
							.string()
							.describe("Day of the forecast (e.g., 'Tomorrow', 'Friday')."),
						temperature: z
							.number()
							.describe("Forecasted temperature for the day."),
						condition: z.string().describe("Forecasted weather condition."),
						icon: z
							.string()
							.optional()
							.describe("Optional: URL or identifier for a weather icon."),
					})
				)
				.optional()
				.describe("Optional: Array of daily forecasts."),
		}),
		metadata: z.record(z.any()).optional(),
	}),
	execute: async ({ context }) => {
		const weatherData = await getWeather(context.location);
		const forecastData = await getWeatherForecast(context.location);

		return {
			type: "weather-card" as const,
			data: {
				location: weatherData.location,
				temperature: weatherData.temperature,
				unit: "C" as const,
				condition: weatherData.conditions,
				humidity: weatherData.humidity,
				windSpeed: weatherData.windSpeed,
				forecast: forecastData,
			},
			metadata: {
				agentName: "Weather Agent",
				toolUsed: "get-weather",
				timestamp: new Date().toISOString(),
			},
		};
	},
});

interface GeocodingResponse {
	results: {
		latitude: number;
		longitude: number;
		name: string;
	}[];
}

interface CurrentWeatherResponse {
	current: {
		time: string;
		temperature_2m: number;
		apparent_temperature: number;
		relative_humidity_2m: number;
		wind_speed_10m: number;
		wind_gusts_10m: number;
		weather_code: number;
	};
}

interface DailyWeatherResponse {
	daily: {
		time: string[];
		temperature_2m_max: number[];
		weather_code: number[];
	};
}

const getWeather = async (location: string) => {
	const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
	const geocodingResponse = await fetch(geocodingUrl);
	const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;

	if (!geocodingData.results?.[0]) {
		throw new Error(`Location '${location}' not found`);
	}

	const { latitude, longitude, name } = geocodingData.results[0];

	const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;

	const response = await fetch(weatherUrl);
	const data = (await response.json()) as CurrentWeatherResponse;

	return {
		temperature: data.current.temperature_2m,
		feelsLike: data.current.apparent_temperature,
		humidity: data.current.relative_humidity_2m,
		windSpeed: data.current.wind_speed_10m,
		windGust: data.current.wind_gusts_10m,
		conditions: getWeatherCondition(data.current.weather_code),
		location: name,
	};
};

const getWeatherForecast = async (location: string) => {
	const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
	const geocodingResponse = await fetch(geocodingUrl);
	const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;

	if (!geocodingData.results?.[0]) {
		throw new Error(`Location '${location}' not found`);
	}

	const { latitude, longitude } = geocodingData.results[0];

	const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max&forecast_days=5`;

	const response = await fetch(forecastUrl);
	const data = (await response.json()) as DailyWeatherResponse;

	const forecast = data.daily.time.map((time, index) => ({
		day: new Date(time).toLocaleDateString("en-US", { weekday: "short" }),
		temperature: data.daily.temperature_2m_max[index],
		condition: getWeatherCondition(data.daily.weather_code[index]),
	}));

	return forecast;
};

function getWeatherCondition(code: number): string {
	const conditions: Record<number, string> = {
		0: "Clear sky",
		1: "Mainly clear",
		2: "Partly cloudy",
		3: "Overcast",
		45: "Foggy",
		48: "Depositing rime fog",
		51: "Light drizzle",
		53: "Moderate drizzle",
		55: "Dense drizzle",
		56: "Light freezing drizzle",
		57: "Dense freezing drizzle",
		61: "Slight rain",
		63: "Moderate rain",
		65: "Heavy rain",
		66: "Light freezing rain",
		67: "Heavy freezing rain",
		71: "Slight snow fall",
		73: "Moderate snow fall",
		75: "Heavy snow fall",
		77: "Snow grains",
		80: "Slight rain showers",
		81: "Moderate rain showers",
		82: "Violent rain showers",
		85: "Slight snow showers",
		86: "Heavy snow showers",
		95: "Thunderstorm",
		96: "Thunderstorm with slight hail",
		99: "Thunderstorm with heavy hail",
	};
	return conditions[code] || "Unknown";
}
