import { generateObject } from "ai";
import { z } from "zod";
import {
	getConfiguredProviders,
	getProviderModel,
} from "../lib/provider-config";
import { Company } from "../lib/types";

const CompanyInfoSchema = z.object({
	name: z.string(),
	description: z.string(),
	keywords: z.array(z.string()),
	industry: z.string(),
	mainProducts: z.array(z.string()),
	competitors: z.array(z.string()).optional(),
});

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

		// Use AI to extract structured information - use first available provider
		const configuredProviders = getConfiguredProviders();
		if (configuredProviders.length === 0) {
			throw new Error(
				"No AI providers configured and enabled for content extraction"
			);
		}

		// Use the first available provider with a fast model
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
			prompt: `Extract company information from this website content:\n\n      URL: ${normalizedUrl}\n      Content: ${html}\n\n      Extract the company name, a brief description, relevant keywords, and identify the PRIMARY industry category. \n      \n      Industry detection rules:\n      - If the company makes coolers, drinkware, outdoor equipment, camping gear, categorize as "outdoor gear"\n      - If the company offers web scraping, crawling, data extraction, or HTML parsing tools/services, categorize as "web scraping"\n      - If the company primarily provides AI/ML models or services, categorize as "AI"\n      - If the company offers hosting, deployment, or cloud infrastructure, categorize as "deployment"\n      - If the company is an e-commerce platform or online store builder, categorize as "e-commerce platform"\n      - If the company sells physical products directly to consumers (clothing, accessories, etc.), categorize as "direct-to-consumer brand"\n      - If the company is in fashion/apparel/underwear/clothing, categorize as "apparel & fashion"\n      - If the company provides software tools or APIs, categorize as "developer tools"\n      - If the company is a marketplace or aggregator, categorize as "marketplace"\n      - For other B2B software, use "SaaS"\n      - For other consumer products, use "consumer goods"\n      \n      IMPORTANT: \n      1. For mainProducts, list the ACTUAL PRODUCTS (e.g., "coolers", "tumblers", "drinkware") not product categories\n      2. For competitors, extract FULL COMPANY NAMES (e.g., "RTIC", "IGLOO", "Coleman") not just initials\n      3. Focus on what the company MAKES/SELLS, not what goes IN their products (e.g., Yeti makes coolers, not beverages)`,
		});

		// Extract favicon URL - try multiple sources
		const urlObj = new URL(normalizedUrl);
		const domain = urlObj.hostname.replace("www.", "");

		// Try to get a high-quality favicon from various sources
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

		// Ensure URL has protocol for fallback
		let normalizedUrl = url.trim();
		if (
			!normalizedUrl.startsWith("http://") &&
			!normalizedUrl.startsWith("https://")
		) {
			normalizedUrl = `https://${normalizedUrl}`;
		}

		// Fallback: extract company name from URL
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
