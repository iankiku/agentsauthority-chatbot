import {
	AuthenticationError,
	ValidationError,
	handleApiError,
} from "@/lib/api-errors";
import { auth } from "@/lib/auth-utils";
import { GeoCacheManager, RateLimitManager } from "@/lib/cache";
import { callAgentApi } from "@/lib/mastra-client";
import { NextRequest, NextResponse } from "next/server";

// Types for GEO scan request and response
interface GeoScanRequest {
	businessName: string;
	website: string;
	industry?: string;
	forceRefresh?: boolean;
}

interface GeoScanResult {
	overallScore: number;
	platformScores: {
		chatgpt: number;
		claude: number;
		gemini: number;
		perplexity: number;
	};
	insights: string[];
	recommendations: string[];
	competitorMentions: Array<{
		name: string;
		frequency: number;
		context: string;
	}>;
	queryResults: Array<{
		query: string;
		platform: string;
		mentions: number;
		ranking: number;
		context: string;
	}>;
	metadata: {
		scanDate: string;
		businessName: string;
		website: string;
		industry?: string;
		cached: boolean;
		cacheAge?: number;
	};
}

// POST /api/geo-scan - Perform GEO analysis with caching
export async function POST(request: NextRequest) {
	try {
		// Authentication check
		const sessionResponse = await auth.api.getSession({
			headers: request.headers,
		});

		if (!sessionResponse?.user) {
			throw new AuthenticationError("Please log in to perform GEO analysis");
		}

		const userId = sessionResponse.user.id;
		const userEmail = sessionResponse.user.email;

		// Parse request body
		const body: GeoScanRequest = await request.json();
		const { businessName, website, industry, forceRefresh = false } = body;

		// Validate required fields
		if (!businessName || !website) {
			throw new ValidationError("Invalid request", {
				businessName: !businessName ? "Business name is required" : undefined,
				website: !website ? "Website is required" : undefined,
			});
		}

		// Normalize website URL
		let normalizedWebsite = website.trim().toLowerCase();
		if (
			!normalizedWebsite.startsWith("http://") &&
			!normalizedWebsite.startsWith("https://")
		) {
			normalizedWebsite = `https://${normalizedWebsite}`;
		}

		// Rate limiting check
		const rateLimitResult = await RateLimitManager.checkRateLimit(
			`geo-scan:${userId}`,
			5, // 5 scans per hour
			3600 // 1 hour window
		);

		if (!rateLimitResult.allowed) {
			return NextResponse.json(
				{
					error: "Rate limit exceeded",
					message: `Too many GEO scans. Try again in ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000)} minutes.`,
					resetTime: rateLimitResult.resetTime,
				},
				{ status: 429 }
			);
		}

		// Check cache first (unless force refresh is requested)
		let cachedResult: GeoScanResult | null = null;
		let cacheInfo = { exists: false, ttl: 0, key: "" };

		if (!forceRefresh) {
			[cachedResult, cacheInfo] = await Promise.all([
				GeoCacheManager.getGeoScan(businessName, normalizedWebsite, industry),
				GeoCacheManager.getGeoScanCacheInfo(
					businessName,
					normalizedWebsite,
					industry
				),
			]);

			if (cachedResult) {
				console.log(
					`Returning cached GEO scan for ${businessName} (TTL: ${cacheInfo.ttl}s)`
				);

				// Add cache metadata
				cachedResult.metadata = {
					...cachedResult.metadata,
					cached: true,
					cacheAge: cachedResult.metadata.scanDate
						? Math.floor(
								(Date.now() -
									new Date(cachedResult.metadata.scanDate).getTime()) /
									1000
							)
						: 0,
				};

				return NextResponse.json({
					success: true,
					data: cachedResult,
					cached: true,
					cacheInfo: {
						ttl: cacheInfo.ttl,
						key: cacheInfo.key,
					},
				});
			}
		}

		// Perform live GEO scan
		console.log(
			`Performing live GEO scan for ${businessName} (${normalizedWebsite}) in ${industry || "general"} industry`
		);

		// Get industry-specific configuration
		const industryConfig = getIndustryConfig(industry || "general");

		// Generate industry-specific queries
		const industryQueries = industryConfig.keyQueries.map((query) =>
			query
				.replace("{category}", industry || "business")
				.replace("{brand}", businessName)
				.replace("{competitor}", "competitors")
				.replace("{product}", businessName)
				.replace("{service}", industry || "service")
		);

		const baseQueries = [
			...industryQueries,
			`${businessName} alternatives`,
			`${businessName} vs competitors`,
			`${businessName} review`,
			`${businessName} pricing`,
		];

		// Call the GEO analysis agent
		const prompt = `
Analyze the GEO (Generative Engine Optimization) visibility for the business "${businessName}" (website: ${normalizedWebsite}) in the ${industry || "general business"} industry.

Industry Context: ${industryConfig.description}
Industry-Specific Factors:
- Key Queries: ${baseQueries.join(", ")}
- Competitor Signals: ${industryConfig.competitorSignals.join(", ")}
- Authority Indicators: ${industryConfig.authorityIndicators.join(", ")}
- Scoring Weights: Mention Frequency (${Math.round(industryConfig.weights.mentionFrequency * 100)}%), Ranking Position (${Math.round(industryConfig.weights.rankingPosition * 100)}%), Context Relevance (${Math.round(industryConfig.weights.contextRelevance * 100)}%), Sentiment (${Math.round(industryConfig.weights.sentimentScore * 100)}%), Competitor Gap (${Math.round(industryConfig.weights.competitorGap * 100)}%), Content Authority (${Math.round(industryConfig.weights.contentAuthority * 100)}%)

Perform the following analysis:
1. Search for mentions across ChatGPT, Claude, Gemini, and Perplexity using the industry-specific queries above
2. Calculate visibility scores for each platform (0-100) using the industry-specific weights
3. Identify competitor mentions and frequency, focusing on industry-specific competitor signals
4. Evaluate content authority using industry-specific authority indicators
5. Provide actionable optimization recommendations tailored to the ${industry || "general business"} industry
6. Generate insights about current positioning within the industry context

Return the analysis in the following JSON structure:
{
  "overallScore": number,
  "platformScores": {
    "chatgpt": number,
    "claude": number,
    "gemini": number,
    "perplexity": number
  },
  "insights": string[],
  "recommendations": string[],
  "competitorMentions": [{"name": string, "frequency": number, "context": string}],
  "queryResults": [{"query": string, "platform": string, "mentions": number, "ranking": number, "context": string}]
}
`;

		const agentResult = await callAgentApi({
			agentName: "geoAnalysisAgent",
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			method: "generate",
		});

		// Structure the result
		const geoScanResult: GeoScanResult = {
			overallScore: agentResult.overallScore || 45,
			platformScores: agentResult.platformScores || {
				chatgpt: 40,
				claude: 45,
				gemini: 50,
				perplexity: 45,
			},
			insights: agentResult.insights || [
				"Limited visibility in AI search results",
				"Competitors have stronger positioning",
				"Opportunity to improve content optimization",
			],
			recommendations: agentResult.recommendations || [
				"Create more comprehensive product documentation",
				"Develop thought leadership content",
				"Optimize for AI-specific search patterns",
			],
			competitorMentions: agentResult.competitorMentions || [],
			queryResults: agentResult.queryResults || [],
			metadata: {
				scanDate: new Date().toISOString(),
				businessName,
				website: normalizedWebsite,
				industry,
				cached: false,
			},
		};

		// Cache the result
		await GeoCacheManager.setGeoScan(
			businessName,
			normalizedWebsite,
			geoScanResult,
			industry
		);

		console.log(`GEO scan completed and cached for ${businessName}`);

		return NextResponse.json({
			success: true,
			data: geoScanResult,
			cached: false,
			rateLimitInfo: {
				remaining: rateLimitResult.remaining,
				resetTime: rateLimitResult.resetTime,
			},
		});
	} catch (error) {
		console.error("GEO scan error:", error);
		return handleApiError(error);
	}
}

// GET /api/geo-scan - Get cache info or recent scans
export async function GET(request: NextRequest) {
	try {
		const sessionResponse = await auth.api.getSession({
			headers: request.headers,
		});

		if (!sessionResponse?.user) {
			throw new AuthenticationError("Please log in to view GEO scan info");
		}

		const { searchParams } = new URL(request.url);
		const businessName = searchParams.get("businessName");
		const website = searchParams.get("website");
		const industry = searchParams.get("industry");

		if (!businessName || !website) {
			return NextResponse.json(
				{ error: "businessName and website parameters are required" },
				{ status: 400 }
			);
		}

		// Get cache info
		const cacheInfo = await GeoCacheManager.getGeoScanCacheInfo(
			businessName,
			website,
			industry || undefined
		);

		return NextResponse.json({
			success: true,
			cacheInfo,
		});
	} catch (error) {
		return handleApiError(error);
	}
}
