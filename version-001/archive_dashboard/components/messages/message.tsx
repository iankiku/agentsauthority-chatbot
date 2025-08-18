"use client";

import { ArtifactRenderer } from "@/components/artifacts/artifact-renderer"; // To be created
import { Markdown } from "@/components/markdown"; // To be created
import { cn } from "@workspace/utils";
import type { UIMessage } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { memo } from "react";

interface MessageProps {
	message: UIMessage;
	isLoading?: boolean;
	isReadonly?: boolean;
	requiresScrollPadding?: boolean;
	mode?: "chat" | "artifact" | "split";
}

function PureMessage({
	message,
	isLoading = false,
	isReadonly = false,
	requiresScrollPadding = false,
	mode = "chat",
}: MessageProps) {
	return (
		<motion.div
			className="w-full mx-auto max-w-3xl px-4 group/message"
			initial={{ y: 5, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			data-role={message.role}
		>
			<div
				className={cn(
					"flex gap-4 w-full",
					message.role === "user" && "ml-auto max-w-2xl w-fit"
				)}
			>
				<div
					className={cn("flex flex-col gap-4 w-full", {
						"min-h-96": message.role === "assistant" && requiresScrollPadding,
					})}
				>
					{message.toolInvocations && message.toolInvocations.length > 0 ? (
						<ArtifactRenderer messages={[message]} />
					) : (
						<div
							className={cn("flex flex-col gap-4", {
								"bg-primary text-primary-foreground px-3 py-2 rounded-xl":
									message.role === "user",
							})}
						>
							<Markdown>{message.content}</Markdown>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
}

export const Message = memo(PureMessage);
