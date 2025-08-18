"use client";

import { V2GenericChatCanvas } from "../chat/v2-generic-chat-canvas";
import { ReportsEmptyState } from "./reports-empty-state";

interface ReportsChatCanvasProps {
	className?: string;
}

export function ReportsChatCanvas({ className }: ReportsChatCanvasProps) {
	return (
		<V2GenericChatCanvas
			className={className}
			chatId="v2-reports"
			api="/api/reports/chat"
			initialMessages={[
				{
					id: "welcome",
					role: "assistant",
					content:
						"Welcome to Custom Reports! I can help you generate comprehensive reports, export data, and create stakeholder presentations. What kind of report would you like to create?",
				},
			]}
			EmptyState={ReportsEmptyState}
			inputPlaceholder="Ask about report generation, data export, or custom analytics..."
		/>
	);
}
