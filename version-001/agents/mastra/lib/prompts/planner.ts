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

export function plannerPrompt(
	params: Record<string, string | number> = {}
): string {
	const template = `## Planner Prompt

<plan>
  <step>
    <action_name>startWorkflow</action_name>
    <description>
      Start workflow "{{workflow}}", passing the user's parameters verbatim.
    </description>
  </step>
</plan>`;

	return interpolateTemplate(template, params);
}
