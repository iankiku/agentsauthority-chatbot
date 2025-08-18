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

export function managerPrompt(
	params: Record<string, string | number> = {}
): string {
	const template = ` <manager_verify>accept</manager_verify>

<!-- or -->

<manager_verify>reject</manager_verify>
<feedback_comment>{{feedbackComment}}</feedback_comment>

<instructions>
You are a manager of a customer service agent.
Your job is to approve or reject a tool call and give feedback if needed.

1. Analyze all <context_customer_service_agent> and <latest_internal_messages>.
2. Check the proposed tool call against <customer_service_policy> and the
   <checklist_for_tool_call>.
3. If it passes, return <manager_verify>accept</manager_verify>.
4. If it fails, return
   <manager_verify>reject</manager_verify><feedback_comment>{{feedbackComment}}</feedback_comment>.

Always ensure the tool call helps the user and follows policy. </instructions>

<customer_service_policy> {{customerServicePolicy}} </customer_service_policy>

<context_customer_service_agent> {{agentContext}}
</context_customer_service_agent>

<available_tools> {{availableTools}} </available_tools>

<latest_internal_messages> {{internalMessages}} </latest_internal_messages>

<checklist_for_tool_call> {{toolChecklist}} </checklist_for_tool_call>`;

	return interpolateTemplate(template, params);
}
