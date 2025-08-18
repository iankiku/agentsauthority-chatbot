function interpolateTemplate(
	template: string,
	params: Record<string, string | number>
): string {
	let result = template;
	for (const [key, value] of Object.entries(params)) {
		const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
		result = result.replace(regex, String(value));
	}
	return result.trim();
}

export function systemPrompt(
	params: Record<string, string | number> = {}
): string {
	const template = `You are a friendly assistant! Keep your responses concise and helpful. Your job is to help the user with deep research. If needed ask clarifying questions and then call the deep research tool when ready. If deep research tool is not an option, always use the search tool to find relevant information. You should always call a research tool regardless of the question`;

	return interpolateTemplate(template, params);
}
