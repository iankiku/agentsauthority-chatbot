import { generateObject, generateText } from "ai";
import { z } from "zod";
import { ExternalServiceError } from "../lib/api-errors";
import { getBrandDetectionOptions } from "../lib/brand-detection-config";
import {
	detectBrandMention,
	detectMultipleBrands,
} from "../lib/brand-detection-utils";
import {
	getConfiguredProviders,
	getProviderConfig,
	getProviderModel,
	isProviderConfigured,
	normalizeProviderName,
} from "../lib/provider-config";
import {
	AIResponse,
	Company,
	CompanyRanking,
	CompetitorFoundData,
	ProgressCallback,
} from "../lib/types";

const RankingSchema = z.object({
	rankings: z.array(
		z.object({
			position: z.number(),
			company: z.string(),
			reason: z.string().optional(),
			sentiment: z.enum(["positive", "neutral", "negative"]).optional(),
		})
	),
	analysis: z.object({
		brandMentioned: z.boolean(),
		brandPosition: z.number().optional(),
		competitors: z.array(z.string()),
		overallSentiment: z.enum(["positive", "neutral", "negative"]),
		confidence: z.number().min(0).max(1),
	}),
});

const CompetitorSchema = z.object({
	competitors: z.array(
		z.object({
			name: z.string(),
			description: z.string(),
			isDirectCompetitor: z.boolean(),
			marketOverlap: z.enum(["high", "medium", "low"]),
			businessModel: z
				.string()
				.describe("e.g., DTC brand, SaaS, API service, marketplace"),
			competitorType: z
				.enum(["direct", "indirect", "retailer", "platform"])
				.describe(
					"direct = same products, indirect = adjacent products, retailer = sells products, platform = aggregates"
				),
		})
	),
});

const CompanyInfoSchema = z.object({
	name: z.string(),
	description: z.string(),
	keywords: z.array(z.string()),
	industry: z.string(),
	mainProducts: z.array(z.string()),
	competitors: z.array(z.string()).optional(),
});

/**
 * Generates a mock AI response for testing or when AI providers are not configured.
 * @param prompt The prompt used for the analysis.
 * @param provider The name of the AI provider (e.g., 'OpenAI', 'Anthropic').
 * @param brandName The name of the brand being analyzed.
 * @param competitors An array of competitor names.
 * @returns A mock AIResponse object.
 */
function generateMockResponse(
	prompt: string,
	provider: string,
	brandName: string,
	competitors: string[]
): AIResponse {
	const mentioned = Math.random() > 0.3;
	const position = mentioned ? Math.floor(Math.random() * 5) + 1 : undefined;
	const providerDisplayName =
		provider === "openai"
			? "OpenAI"
			: provider === "anthropic"
				? "Anthropic"
				: provider === "google"
					? "Google"
					: provider === "perplexity"
						? "Perplexity"
						: provider;

	return {
		provider: providerDisplayName,
		prompt,
		response: `Mock response for ${prompt}`,
		rankings: competitors.slice(0, 5).map((comp, idx) => ({
			position: idx + 1,
			company: comp,
			reason: "Mock reason",
			sentiment: "neutral" as const,
		})),
		competitors: competitors.slice(0, 3),
		brandMentioned: mentioned,
		brandPosition: position,
		sentiment: mentioned ? "positive" : "neutral",
		confidence: 0.8,
		timestamp: new Date(),
	};
}

/**
 * Identifies competitors for a given company using an AI model.
 * @param company The company for which to identify competitors.
 * @param progressCallback Optional callback for reporting progress via SSE.
 * @returns A promise that resolves to an array of competitor names.
 */
export async function identifyCompetitors(
	company: Company,
	progressCallback?: ProgressCallback
): Promise<string[]> {
	try {
		const configuredProviders = getConfiguredProviders();
		if (configuredProviders.length === 0) {
			throw new Error("No AI providers configured and enabled");
		}

		const provider = configuredProviders[0];
		const model = getProviderModel(provider.id, provider.defaultModel);
		if (!model) {
			throw new Error(`${provider.name} model not available`);
		}

		const prompt = `Identify 6-9 real, established competitors of ${company.name} in the ${company.industry || "technology"} industry.

Company: ${company.name}
Industry: ${company.industry}
Description: ${company.description}
${company.scrapedData?.keywords ? `Keywords: ${company.scrapedData.keywords.join(", ")}` : ""}
${company.scrapedData?.competitors ? `Known competitors: ${company.scrapedData.competitors.join(", ")}` : ""}

Based on this company's specific business model and target market, identify ONLY direct competitors that:
1. Offer the SAME type of products/services (not just retailers that sell them)
2. Target the SAME customer segment
3. Have a SIMILAR business model (e.g., if it's a DTC brand, find other DTC brands)
4. Actually compete for the same customers

For example:
- If it's a DTC underwear brand, find OTHER DTC underwear brands (not department stores)
- If it's a web scraping API, find OTHER web scraping APIs (not general data tools)
- If it's an AI model provider, find OTHER AI model providers (not AI applications)

IMPORTANT: 
- Only include companies you are confident actually exist
- Focus on TRUE competitors with similar offerings
- Exclude retailers, marketplaces, or aggregators unless the company itself is one
- Aim for 6-9 competitors total
- Do NOT include general retailers or platforms that just sell/distribute products`;

		const { object } = await generateObject({
			model,
			schema: CompetitorSchema,
			prompt,
			temperature: 0.3,
		});

		const isRetailOrPlatform =
			company.industry?.toLowerCase().includes("marketplace") ||
			company.industry?.toLowerCase().includes("platform") ||
			company.industry?.toLowerCase().includes("retailer");

		const competitors = object.competitors
			.filter((c) => {
				if (c.isDirectCompetitor && c.marketOverlap === "high") return true;

				if (
					!isRetailOrPlatform &&
					(c.competitorType === "retailer" || c.competitorType === "platform")
				) {
					return false;
				}

				return (
					c.competitorType === "direct" ||
					(c.competitorType === "indirect" && c.marketOverlap === "high")
				);
			})
			.map((c) => c.name)
			.slice(0, 9);

		if (company.scrapedData?.competitors) {
			company.scrapedData.competitors.forEach((comp) => {
				if (!competitors.includes(comp)) {
					competitors.push(comp);
				}
			});
		}

		if (progressCallback) {
			for (let i = 0; i < competitors.length; i++) {
				progressCallback({
					type: "competitor-found",
					stage: "identifying-competitors",
					data: {
						competitor: competitors[i],
						index: i + 1,
						total: competitors.length,
					} as CompetitorFoundData,
					timestamp: new Date(),
				});
			}
		}

		return competitors;
	} catch (error) {
		console.error("Error identifying competitors:", error);
		return company.scrapedData?.competitors || [];
	}
}

/**
 * Analyzes a given prompt with a specified AI provider to get a response and extract structured data.
 * @param prompt The prompt to send to the AI model.
 * @param provider The ID of the AI provider (e.g., 'OpenAI', 'Anthropic').
 * @param brandName The name of the brand being analyzed.
 * @param competitors An array of competitor names.
 * @param useMockMode If true, a mock response will be generated.
 * @returns A promise that resolves to an AIResponse object.
 */
export async function analyzePromptWithProvider(
	prompt: string,
	provider: string,
	brandName: string,
	competitors: string[],
	useMockMode: boolean = false
): Promise<AIResponse> {
	if (useMockMode || provider === "Mock") {
		return generateMockResponse(prompt, provider, brandName, competitors);
	}

	const normalizedProvider = normalizeProviderName(provider);
	const model = getProviderModel(normalizedProvider);

	if (!model) {
		console.warn(`Provider ${provider} not configured, skipping provider`);
		return null as any;
	}

	const systemPrompt = `You are an AI assistant analyzing brand visibility and rankings.
When responding to prompts about tools, platforms, or services:
1. Provide rankings with specific positions (1st, 2nd, etc.)
2. Focus on the companies mentioned in the prompt
3. Be objective and factual
4. Explain briefly why each tool is ranked where it is
5. If you don't have enough information about a specific company, you can mention that`;

	try {
		const { text } = await generateText({
			model,
			system: systemPrompt,
			prompt,
			temperature: 0.7,
			maxTokens: 800,
		});

		if (!text || text.length === 0) {
			console.error(
				`${provider} returned empty response for prompt: "${prompt}"`
			);
			throw new Error(`${provider} returned empty response`);
		}

		const analysisPrompt = `Analyze this AI response about ${brandName} and its competitors:

Response: "${text}"

Your task:
1. Look for ANY mention of ${brandName} anywhere in the response, including:
   - Direct mentions (exact name)
   - Variations (with or without spaces, punctuation)
   - With suffixes (Inc, LLC, Corp, etc.)
   - In possessive form (${brandName}'s)
   - As part of compound words
2. Look for ANY mention of these competitors: ${competitors.join(", ")}
   - Apply the same detection rules as above
3. For each mentioned company, determine if it has a specific ranking position
4. Identify the sentiment towards each mentioned company
5. Rate your confidence in this analysis (0-1)

IMPORTANT: 
- A company is "mentioned" if it appears ANYWHERE in the response text, even without a specific ranking
- Count ALL mentions, not just ranked ones
- Be very thorough - check for variations like "${brandName}", "${brandName.replace(/\s+/g, "")}", "${brandName.toLowerCase()}"
- Look in all contexts: listed, compared, recommended, discussed, referenced, etc.

Examples of mentions to catch:
- "${brandName} is a great tool" (direct mention)
- "compared to ${brandName}" (comparison context)  
- "${brandName}'s features" (possessive)
- "alternatives like ${brandName}" (listing context)
- "${brandName.replace(/\s+/g, "")} offers" (no spaces variant)`;

		let object;

		try {
			const structuredModel =
				normalizedProvider === "anthropic"
					? getProviderModel("openai", "gpt-4o-mini") || model
					: model;

			const result = await generateObject({
				model: structuredModel,
				schema: RankingSchema,
				prompt: analysisPrompt,
				temperature: 0.3,
				maxRetries: 2,
			});
			object = result.object;
		} catch (error) {
			console.error(
				`Error generating structured object with ${provider}:`,
				(error as any).message
			);

			if (provider === "Anthropic") {
				try {
					const simplePrompt = `Analyze this AI response about ${brandName} and competitors ${competitors.join(", ")}:

"${text}"

Return a simple analysis:
1. Is ${brandName} mentioned? (yes/no)
2. What position/ranking does it have? (number or "not ranked")
3. Which competitors are mentioned? (list names)
4. What's the overall sentiment? (positive/neutral/negative)`;

					const { text: simpleResponse } = await generateText({
						model,
						prompt: simplePrompt,
						temperature: 0.3,
					});

					const lines = simpleResponse.toLowerCase().split("\n");
					const aiSaysBrandMentioned = lines.some((line) =>
						line.includes("yes")
					);

					const brandDetection = detectBrandMention(text, brandName, {
						caseSensitive: false,
						wholeWordOnly: true,
						includeVariations: true,
					});

					const competitorDetections = detectMultipleBrands(text, competitors, {
						caseSensitive: false,
						wholeWordOnly: true,
						includeVariations: true,
					});

					const competitors_mentioned = competitors.filter(
						(c) => competitorDetections.get(c)?.mentioned || false
					);

					return {
						provider,
						prompt,
						response: text,
						brandMentioned: aiSaysBrandMentioned || brandDetection.mentioned,
						brandPosition: undefined,
						competitors: competitors_mentioned,
						rankings: [],
						sentiment: "neutral" as const,
						confidence: 0.7,
						timestamp: new Date(),
					};
				} catch (fallbackError) {
					console.error(
						"Fallback analysis also failed:",
						(fallbackError as any).message
					);
				}
			}

			const brandDetection = detectBrandMention(text, brandName, {
				caseSensitive: false,
				wholeWordOnly: true,
				includeVariations: true,
			});

			const competitorDetections = detectMultipleBrands(text, competitors, {
				caseSensitive: false,
				wholeWordOnly: true,
				includeVariations: true,
			});

			return {
				provider,
				prompt,
				response: text,
				brandMentioned: brandDetection.mentioned,
				brandPosition: undefined,
				competitors: competitors.filter(
					(c) => competitorDetections.get(c)?.mentioned || false
				),
				rankings: [],
				sentiment: "neutral" as const,
				confidence: brandDetection.confidence * 0.5,
				timestamp: new Date(),
			};
		}

		const rankings = object.rankings.map(
			(r): CompanyRanking => ({
				position: r.position,
				company: r.company,
				reason: r.reason,
				sentiment: r.sentiment,
			})
		);

		const brandDetectionOptions = getBrandDetectionOptions(brandName);
		const brandDetectionResult = detectBrandMention(
			text,
			brandName,
			brandDetectionOptions
		);
		const brandMentioned =
			object.analysis.brandMentioned || brandDetectionResult.mentioned;

		const competitorDetectionResults = new Map<string, any>();
		competitors.forEach((competitor) => {
			const competitorOptions = getBrandDetectionOptions(competitor);
			const result = detectBrandMention(text, competitor, competitorOptions);
			competitorDetectionResults.set(competitor, result);
		});

		const aiCompetitors = new Set(object.analysis.competitors);
		const allMentionedCompetitors = new Set([...aiCompetitors]);

		competitorDetectionResults.forEach((result, competitorName) => {
			if (result.mentioned && competitorName !== brandName) {
				allMentionedCompetitors.add(competitorName);
			}
		});

		const relevantCompetitors = Array.from(allMentionedCompetitors).filter(
			(c) => competitors.includes(c) && c !== brandName
		);

		const providerDisplayName =
			provider === "openai"
				? "OpenAI"
				: provider === "anthropic"
					? "Anthropic"
					: provider === "google"
						? "Google"
						: provider === "perplexity"
							? "Perplexity"
							: provider;

		return {
			provider: providerDisplayName,
			prompt,
			response: text,
			rankings,
			competitors: relevantCompetitors,
			brandMentioned,
			brandPosition: object.analysis.brandPosition,
			sentiment: object.analysis.overallSentiment,
			confidence: object.analysis.confidence,
			timestamp: new Date(),
			detectionDetails: {
				brandMatches: brandDetectionResult.matches.map((m) => ({
					text: m.text,
					index: m.index,
					confidence: m.confidence,
				})),
				competitorMatches: new Map(
					Array.from(competitorDetectionResults.entries())
						.filter(([_, result]) => result.mentioned)
						.map(([name, result]) => [
							name,
							result.matches.map((m: any) => ({
								text: m.text,
								index: m.index,
								confidence: m.confidence,
							})),
						])
				),
			},
		};
	} catch (error) {
		console.error(`Error with ${provider}:`, error);
		throw error;
	}
}

/**
 * Analyzes a given prompt with a specified AI provider, optionally using web search.
 * @param prompt The prompt to send to the AI model.
 * @param provider The ID of the AI provider (e.g., 'openai', 'anthropic').
 * @param brandName The name of the brand being analyzed.
 * @param competitors An array of competitor names.
 * @param useMockMode If true, a mock response will be generated.
 * @param useWebSearch If true, the AI model will use web search capabilities if supported.
 * @returns A promise that resolves to an AIResponse object.
 */
export async function analyzePromptWithProviderEnhanced(
	prompt: string,
	provider: string,
	brandName: string,
	competitors: string[],
	useMockMode: boolean = false,
	useWebSearch: boolean = true
): Promise<AIResponse> {
	if (useMockMode || provider === "Mock") {
		return generateMockResponse(prompt, provider, brandName, competitors);
	}

	const normalizedProvider = normalizeProviderName(provider);
	const providerConfig = getProviderConfig(normalizedProvider);

	if (!providerConfig || !providerConfig.isConfigured()) {
		console.warn(`Provider ${provider} not configured, skipping provider`);
		return null as any;
	}

	let model;
	const generateConfig: any = {};

	if (normalizedProvider === "openai" && useWebSearch) {
		model = getProviderModel("openai", "gpt-4o-mini", { useWebSearch: true });
	} else {
		model = getProviderModel(normalizedProvider, undefined, { useWebSearch });
	}

	if (!model) {
		console.warn(`Failed to get model for ${provider}`);
		return null as any;
	}

	const systemPrompt = `You are an AI assistant analyzing brand visibility and rankings.
When responding to prompts about tools, platforms, or services:
1. Provide rankings with specific positions (1st, 2nd, etc.)
2. Focus on the companies mentioned in the prompt
3. Be objective and factual${useWebSearch ? ", using current web information when available" : ""}
4. Explain briefly why each tool is ranked where it is
5. If you don't have enough information about a specific company, you can mention that
6. ${useWebSearch ? "Prioritize recent, factual information from web searches" : "Use your knowledge base"}`;

	const enhancedPrompt = useWebSearch
		? `${prompt}

Please search for current, factual information to answer this question. Focus on recent data and real user opinions.`
		: prompt;

	try {
		const { text, sources } = await generateText({
			model,
			system: systemPrompt,
			prompt: enhancedPrompt,
			temperature: 0.7,
			maxTokens: 800,
			...generateConfig,
		});

		let object;

		try {
			const analysisModel = getProviderModel("openai", "gpt-4o-mini");
			if (!analysisModel) {
				throw new Error("Analysis model not available");
			}

			const result = await generateObject({
				model: analysisModel,
				system:
					"You are an expert at analyzing text and extracting structured information about companies and rankings.",
				prompt: `Analyze this AI response about ${brandName} and its competitors:

Response: "${text}"

Your task:
1. Look for ANY mention of ${brandName} anywhere in the response (even if not ranked)
2. Look for ANY mention of these competitors: ${competitors.join(", ")}
3. For each mentioned company, determine if it has a specific ranking position
4. Identify the sentiment towards each mentioned company
5. Rate your confidence in this analysis (0-1)

IMPORTANT: A company is "mentioned" if it appears anywhere in the response text, even without a specific ranking. Count ALL mentions, not just ranked ones.

Be very thorough in detecting company names - they might appear in different contexts (listed, compared, recommended, etc.)`,
				schema: RankingSchema,
				temperature: 0.3,
			});
			object = result.object;
		} catch (error) {
			console.error("Structured analysis failed:", error);

			const textLower = text.toLowerCase();
			const brandNameLower = brandName.toLowerCase();

			const mentioned =
				textLower.includes(brandNameLower) ||
				textLower.includes(brandNameLower.replace(/\s+/g, "")) ||
				textLower.includes(brandNameLower.replace(/[^a-z0-9]/g, ""));

			const detectedCompetitors = competitors.filter((c) => {
				const cLower = c.toLowerCase();
				return (
					textLower.includes(cLower) ||
					textLower.includes(cLower.replace(/\s+/g, "")) ||
					textLower.includes(cLower.replace(/[^a-z0-9]/g, ""))
				);
			});

			object = {
				rankings: [],
				analysis: {
					brandMentioned: mentioned,
					brandPosition: undefined,
					competitors: detectedCompetitors,
					overallSentiment: "neutral" as const,
					confidence: 0.5,
				},
			};
		}

		const textLower = text.toLowerCase();
		const brandNameLower = brandName.toLowerCase();

		const brandMentioned =
			object.analysis.brandMentioned ||
			textLower.includes(brandNameLower) ||
			textLower.includes(brandNameLower.replace(/\s+/g, "")) ||
			textLower.includes(brandNameLower.replace(/[^a-z0-9]/g, ""));

		const aiCompetitors = new Set(object.analysis.competitors);
		const allMentionedCompetitors = new Set([...aiCompetitors]);

		competitors.forEach((competitor) => {
			const competitorLower = competitor.toLowerCase();
			if (
				textLower.includes(competitorLower) ||
				textLower.includes(competitorLower.replace(/\s+/g, "")) ||
				textLower.includes(competitorLower.replace(/[^a-z0-9]/g, ""))
			) {
				allMentionedCompetitors.add(competitor);
			}
		});

		const relevantCompetitors = Array.from(allMentionedCompetitors).filter(
			(c) => competitors.includes(c) && c !== brandName
		);

		const providerDisplayName =
			provider === "openai"
				? "OpenAI"
				: provider === "anthropic"
					? "Anthropic"
					: provider === "google"
						? "Google"
						: provider === "perplexity"
							? "Perplexity"
							: provider;

		return {
			provider: providerDisplayName,
			prompt,
			response: text,
			rankings: object.rankings,
			competitors: relevantCompetitors,
			brandMentioned,
			brandPosition: object.analysis.brandPosition,
			sentiment: object.analysis.overallSentiment,
			confidence: object.analysis.confidence,
			timestamp: new Date(),
		};
	} catch (error) {
		console.error(`Error with ${provider}:`, error);
		throw error;
	}
}

/**
 * Performs a web search using Google AI and summarizes the results.
 * @param query The search query.
 * @returns A promise that resolves to an object containing the summary of search results.
 */
export async function googleWebSearch(query: string): Promise<any> {
	if (!isProviderConfigured("google")) {
		throw new ExternalServiceError(
			"Google AI provider is not configured",
			"Google"
		);
	}

	try {
		const model = getProviderModel("google", "gemini-1.5-pro", {
			useSearchGrounding: true,
		});
		if (!model) {
			throw new ExternalServiceError(
				"Google Gemini model not available",
				"Google"
			);
		}

		const result = await generateText({
			model: model,
			prompt: `Perform a web search for: ${query}. Summarize the key findings and provide relevant URLs.`,
			maxTokens: 1000,
		});

		return {
			summary: result.text,
		};
	} catch (error) {
		console.error("Error performing Google web search:", error);
		throw new ExternalServiceError(
			`Failed to perform web search: ${(error as Error).message}`,
			"Google"
		);
	}
}

/**
 * Scrapes a given URL and extracts structured company information using Firecrawl and an AI model.
 * @param url The URL to scrape.
 * @param maxAge Optional maximum age for cached content in milliseconds.
 * @returns A promise that resolves to a Company object with scraped data.
 */
export async function scrapeUrl(
	url: string,
	maxAge?: number
): Promise<Company> {
	try {
		let normalizedUrl = url.trim();
		if (
			!normalizedUrl.startsWith("http://") &&
			!normalizedUrl.startsWith("https://")
		) {
			normalizedUrl = `https://${normalizedUrl}`;
		}

		const cacheAge = maxAge ? Math.floor(maxAge / 1000) : 604800; // 1 week in seconds

		// Firecrawl dependency removed - return placeholder data
		const response = {
			success: true,
			markdown: `Placeholder content for ${normalizedUrl} - Firecrawl dependency removed`,
			metadata: {
				title: "Unknown Company",
				description: "No description available",
			},
		};

		const html = response.markdown;
		const metadata = response.metadata;

		const configuredProviders = getConfiguredProviders();
		if (configuredProviders.length === 0) {
			throw new Error(
				"No AI providers configured and enabled for content extraction"
			);
		}

		const provider = configuredProviders[0];
		const model = getProviderModel(
			provider.id,
			provider.models.find(
				(m) =>
					m.name.toLowerCase().includes("mini") ||
					m.name.toLowerCase().includes("flash")
			)?.id || provider.defaultModel
		);
		if (!model) {
			throw new Error(`${provider.name} model not available`);
		}

		const { object } = await generateObject({
			model,
			schema: CompanyInfoSchema,
			prompt: `Extract company information from this website content:

      URL: ${normalizedUrl}
      Content: ${html}

      Extract the company name, a brief description, relevant keywords, and identify the PRIMARY industry category. 
      
      Industry detection rules:
      - If the company makes coolers, drinkware, outdoor equipment, camping gear, categorize as "outdoor gear"
      - If the company offers web scraping, crawling, data extraction, or HTML parsing tools/services, categorize as "web scraping"
      - If the company primarily provides AI/ML models or services, categorize as "AI"
      - If the company offers hosting, deployment, or cloud infrastructure, categorize as "deployment"
      - If the company is an e-commerce platform or online store builder, categorize as "e-commerce platform"
      - If the company sells physical products directly to consumers (clothing, accessories, etc.), categorize as "direct-to-consumer brand"
      - If the company is in fashion/apparel/underwear/clothing, categorize as "apparel & fashion"
      - If the company provides software tools or APIs, categorize as "developer tools"
      - If the company is a marketplace or aggregator, categorize as "marketplace"
      - For other B2B software, use "SaaS"
      - For other consumer products, use "consumer goods"
      
      IMPORTANT: 
      1. For mainProducts, list the ACTUAL PRODUCTS (e.g., "coolers", "tumblers", "drinkware") not product categories
      2. For competitors, extract FULL COMPANY NAMES (e.g., "RTIC", "IGLOO", "Coleman") not just initials
      3. Focus on what the company MAKES/SELLS, not what goes IN their products (e.g., Yeti makes coolers, not beverages)`,
		});

		const urlObj = new URL(normalizedUrl);
		const domain = urlObj.hostname.replace("www.", "");

		const faviconUrl =
			metadata?.favicon ||
			`https://www.google.com/s2/favicons?domain=${domain}&sz=128` ||
			`${urlObj.origin}/favicon.ico`;

		return {
			id: crypto.randomUUID(),
			url: normalizedUrl,
			name: object.name,
			description: object.description,
			industry: object.industry,
			logo: metadata?.ogImage || undefined,
			favicon: faviconUrl,
			scraped: true,
			scrapedData: {
				title: object.name,
				description: object.description,
				keywords: object.keywords,
				mainContent: html || "",
				mainProducts: object.mainProducts,
				competitors: object.competitors,
				ogImage: metadata?.ogImage || undefined,
				favicon: faviconUrl,
			},
		};
	} catch (error) {
		console.error("Error scraping company info:", error);

		let normalizedUrl = url.trim();
		if (
			!normalizedUrl.startsWith("http://") &&
			!normalizedUrl.startsWith("https://")
		) {
			normalizedUrl = `https://${normalizedUrl}`;
		}

		const urlObj = new URL(normalizedUrl);
		const domain = urlObj.hostname.replace("www.", "");
		const companyName = domain.split(".")[0];
		const formattedName =
			companyName.charAt(0).toUpperCase() + companyName.slice(1);

		return {
			id: crypto.randomUUID(),
			url: normalizedUrl,
			name: formattedName,
			description: `Information about ${formattedName}`,
			industry: "technology",
			scraped: false,
		};
	}
}
