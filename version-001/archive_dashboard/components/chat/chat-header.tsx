"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";

import { Button } from "@workspace/ui/components/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { PlusIcon } from "lucide-react";
import { memo } from "react";

interface ChatHeaderProps {
	status: string;
}

function PureChatHeader({ status }: ChatHeaderProps) {
	const router = useRouter();
	const { width: windowWidth } = useWindowSize();

	return (
		<header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2 border-b">
			{windowWidth < 768 && (
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
							onClick={() => {
								router.push("/");
								router.refresh();
							}}
						>
							<PlusIcon />
							<span className="md:sr-only">New Chat</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>New Chat</TooltipContent>
				</Tooltip>
			)}

			<div className="flex-1" />

			{status === "submitted" || status === "streaming" ? (
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
					<span className="text-sm text-muted-foreground">
						AI is thinking...
					</span>
				</div>
			) : null}

			<Button className="py-1.5 px-2 h-fit md:h-[34px] order-4" asChild>
				<Link href="/dashboard">Dashboard</Link>
			</Button>
		</header>
	);
}

export const ChatHeader = memo(PureChatHeader);
