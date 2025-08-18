export async function scrapeCompanyInfo(url: string, maxAge?: number) {
	try {
		// Ensure URL has protocol
		let normalizedUrl = url.trim();
		if (
			!normalizedUrl.startsWith("http://") &&
			!normalizedUrl.startsWith("https://")
		) {
			normalizedUrl = `https://${normalizedUrl}`;
		}

		// Default to 1 week cache if not specified
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

		return {
			url: normalizedUrl,
			name: response.metadata?.title || "Unknown Company",
			description: response.metadata?.description || "No description available",
			industry: "technology",
			scraped: true,
			scrapedData: {
				title: response.metadata?.title || "Unknown Company",
				description:
					response.metadata?.description || "No description available",
				mainContent: response.markdown || "",
				ogImage: response.metadata?.ogImage || undefined,
				favicon: response.metadata?.favicon || undefined,
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
			url: normalizedUrl,
			name: formattedName,
			description: `Information about ${formattedName}`,
			industry: "technology",
			scraped: false,
		};
	}
}
