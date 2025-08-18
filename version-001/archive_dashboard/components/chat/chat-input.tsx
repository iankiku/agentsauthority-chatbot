"use client";

import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { ArrowUpIcon, Square } from "lucide-react";
import { useEffect, useRef } from "react";

interface MultimodalInputProps {
	input: string;
	setInput: (value: string) => void;
	status: "idle" | "in-progress" | "error";
	stop: () => void;
	messages: any[];
	sendMessage: (message: string) => void;
}

function PureStopButton({ stop }: { stop: () => void }) {
	return (
		<Button
			size="icon"
			variant="outline"
			onClick={stop}
			className="shrink-0"
			aria-label="Stop generating response"
			title="Stop generating response"
		>
			<Square size={14} />
		</Button>
	);
}

function PureSendButton({
	sendMessage,
	input,
}: {
	sendMessage: (message: string) => void;
	input: string;
}) {
	return (
		<Button
			size="icon"
			onClick={() => {
				if (input && input.trim()) {
					sendMessage(input);
				}
			}}
			disabled={!input || !input.trim()}
			className="shrink-0"
			aria-label="Send message"
			title="Send message"
		>
			<ArrowUpIcon size={14} />
		</Button>
	);
}

export function MultimodalInput({
	input,
	setInput,
	status,
	stop,
	messages,
	sendMessage,
}: MultimodalInputProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [input]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (input && input.trim() && status === "idle") {
				sendMessage(input);
			}
		}
	};

	return (
		<div className="flex w-full items-end gap-2">
			<Textarea
				ref={textareaRef}
				tabIndex={0}
				onKeyDown={handleKeyDown}
				rows={1}
				value={input || ""}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Send a message..."
				spellCheck={false}
				className="min-h-[60px] w-full resize-none bg-background px-3 py-[1.3rem] focus-within:outline-none sm:text-sm"
				style={{
					fontSize: 16,
					lineHeight: "1.5rem",
					maxHeight: "400px",
					overflow: "auto",
				}}
				aria-label="Chat message input"
				aria-describedby="chat-input-help"
				disabled={status === "in-progress"}
			/>
			<div id="chat-input-help" className="sr-only">
				Press Enter to send message, Shift+Enter for new line
			</div>
			{status === "in-progress" ? (
				<PureStopButton stop={stop} />
			) : (
				<PureSendButton sendMessage={sendMessage} input={input} />
			)}
		</div>
	);
}
