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

export function regularPrompt(
	params: Record<string, string | number> = {}
): string {
	const template = `You are a friendly assistant! Keep your responses concise and helpful.`;

	return interpolateTemplate(template, params);
}
