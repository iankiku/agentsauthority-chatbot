"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
	ChevronLeft,
	ChevronRight,
	Edit3,
	MessageSquare,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { useState } from "react";

interface Conversation {
	id: string;
	title: string;
	lastUpdated: string;
}

interface ChatSidebarProps {
	conversations: Conversation[];
	currentConversationId: string;
	onConversationSelect: (id: string) => void;
	onNewConversation: () => void;
	onDeleteConversation: (id: string) => void;
	onUpdateConversationTitle: (id: string, title: string) => void;
	sidebarCollapsed: boolean;
	onToggleSidebar: () => void;
}

export function ChatSidebar({
	conversations,
	currentConversationId,
	onConversationSelect,
	onNewConversation,
	onDeleteConversation,
	onUpdateConversationTitle,
	sidebarCollapsed,
	onToggleSidebar,
}: ChatSidebarProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [editingConversationId, setEditingConversationId] = useState<
		string | null
	>(null);
	const [editingTitle, setEditingTitle] = useState("");

	const filteredConversations = conversations.filter((conversation) =>
		conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const startEditingConversation = (conversation: Conversation) => {
		setEditingConversationId(conversation.id);
		setEditingTitle(conversation.title);
	};

	const saveConversationTitle = () => {
		if (editingConversationId && editingTitle.trim()) {
			onUpdateConversationTitle(editingConversationId, editingTitle.trim());
		}
		setEditingConversationId(null);
		setEditingTitle("");
	};

	const cancelEditing = () => {
		setEditingConversationId(null);
		setEditingTitle("");
	};

	const handleKeyDown = (e: React.KeyboardEvent, conversationId: string) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onConversationSelect(conversationId);
		}
	};

	return (
		<div className="h-full bg-background flex flex-col">
			{/* Sidebar Header */}
			{!sidebarCollapsed && (
				<div className="h-16 px-4 border-b flex items-center gap-2">
					<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
						<MessageSquare className="w-5 h-5 text-white" />
					</div>
					<span className="text-xl font-bold text-foreground">Chat</span>
					<Button
						variant="ghost"
						size="sm"
						onClick={onToggleSidebar}
						className="h-8 w-8 p-0 ml-auto hover:bg-muted/80 transition-colors"
					>
						<ChevronLeft className="w-4 h-4" />
					</Button>
				</div>
			)}
			
			{/* Collapsed Header */}
			{sidebarCollapsed && (
				<div className="h-16 px-2 border-b flex items-center justify-center">
					<Button
						variant="ghost"
						size="sm"
						onClick={onToggleSidebar}
						className="h-8 w-8 p-0 hover:bg-muted/80 transition-colors"
					>
						<ChevronRight className="w-4 h-4" />
					</Button>
				</div>
			)}

			{/* Search */}
			{!sidebarCollapsed && (
				<div className="p-4 border-b bg-muted/20">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
						<Input
							placeholder="Search conversations..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 h-9 bg-background border-muted-foreground/20 focus:border-primary transition-colors"
						/>
					</div>
				</div>
			)}

			{/* New Chat Button */}
			<div className={`${sidebarCollapsed ? "p-2" : "p-4"} border-b bg-muted/10`}>
				<Button
					onClick={onNewConversation}
					className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm transition-all duration-200 hover:shadow-md ${sidebarCollapsed ? "w-8 h-8 p-0" : "w-full"}`}
					size="sm"
				>
					<Plus className="w-4 h-4" />
					{!sidebarCollapsed && <span className="ml-2">New Chat</span>}
				</Button>
			</div>

			{/* Conversations List */}
			<div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
				{filteredConversations.length === 0 && !sidebarCollapsed && (
					<div className="p-4 text-center text-muted-foreground text-sm">
						No conversations found
					</div>
				)}
				{filteredConversations.map((conversation, index) => (
					<div
						key={conversation.id}
						className={`relative group transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/50 ${
							currentConversationId === conversation.id
								? "bg-gradient-to-r from-primary/10 to-primary/5 border-r-2 border-primary shadow-sm"
								: "hover:bg-muted/40"
						}`}
						onClick={() => onConversationSelect(conversation.id)}
						onKeyDown={(e) => handleKeyDown(e, conversation.id)}
						tabIndex={0}
						role="button"
						aria-label={`Select conversation: ${conversation.title}`}
						aria-current={currentConversationId === conversation.id ? "true" : "false"}
					>
						{sidebarCollapsed ? (
							<div className="flex justify-center p-3 cursor-pointer">
								<div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
									currentConversationId === conversation.id
										? "bg-primary/20 text-primary"
										: "text-muted-foreground hover:bg-muted/60"
								}`}>
									<MessageSquare className="w-4 h-4" />
								</div>
							</div>
						) : (
							<div className="p-3 cursor-pointer">
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<h4 className={`font-medium text-sm truncate transition-colors ${
											currentConversationId === conversation.id
												? "text-primary"
												: "text-foreground group-hover:text-foreground"
										}`}>
											{editingConversationId === conversation.id ? (
												<input
													type="text"
													value={editingTitle}
													onChange={(e) => setEditingTitle(e.target.value)}
													onBlur={saveConversationTitle}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															saveConversationTitle();
														} else if (e.key === "Escape") {
															e.preventDefault();
															cancelEditing();
														}
													}}
													className="w-full text-sm border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2 py-1 -mx-2 -my-1"
													autoFocus
													aria-label="Edit conversation title"
												/>
											) : (
												conversation.title
											)}
										</h4>
										<div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
											<Button
												variant="ghost"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													startEditingConversation(conversation);
												}}
												className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary transition-colors rounded-md"
												title="Edit conversation"
											>
												<Edit3 className="w-3 h-3" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													onDeleteConversation(conversation.id);
												}}
												className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-md"
												title="Delete conversation"
											>
												<Trash2 className="w-3 h-3" />
											</Button>
										</div>
									</div>
									<p className="text-xs text-muted-foreground mt-1 truncate">
										{conversation.lastUpdated}
									</p>
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
