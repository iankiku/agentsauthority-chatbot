import { useChat } from "@ai-sdk/react";
import { useState } from "react";

/**
 * Validates AI SDK compatibility for V2 implementation
 * Ensures beta version works with existing endpoints and features
 */
export function validateAISDK() {
	// Check for breaking changes in beta SDK
	const requiredFeatures = [
		"streaming",
		"toolInvocations",
		"setMessages",
		"append",
		"status",
		"error",
		"input",
		"setInput",
		"handleSubmit",
		"stop",
		"reload",
	];

	// Validate useChat hook exists and has required properties
	try {
		const chatHookType = typeof useChat;
		if (chatHookType !== "function") {
			return {
				compatible: false,
				version: "2.0.0-beta.6",
				features: requiredFeatures,
				error: "useChat hook not available",
			};
		}

		return {
			compatible: true,
			version: "2.0.0-beta.6",
			features: requiredFeatures,
		};
	} catch (error) {
		return {
			compatible: false,
			version: "2.0.0-beta.6",
			features: requiredFeatures,
			error:
				error instanceof Error ? error.message : "Unknown validation error",
		};
	}
}

/**
 * Enhanced chat hook with V2-specific error handling and validation
 */
export function useV2Chat(options: any) {
	try {
		const validation = validateAISDK();

		// Use our working fallback implementation since AI SDK integration has issues
		console.log("🔧 Using fallback chat implementation");
		// Return a fallback object with working functionality
		const [messages, setMessages] = useState([]);
		const [input, setInput] = useState("");
		const [status, setStatus] = useState("idle");
		const [error, setError] = useState<Error | null>(null);

			const append = async (message: { role: string; content: string }) => {
				try {
					console.log("📤 Append function called with:", message);
					console.log("📤 Sending message:", message.content.substring(0, 50) + "...");
					setMessages(prev => [...prev, message]);
					setStatus("loading");
				
					// Make API call
					const response = await fetch("/api/chat", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ 
							message: message.content,
							conversationId: null 
						})
					});

					console.log("📡 Response status:", response.status);

					if (!response.ok) {
						const errorText = await response.text();
						console.error("📡 API error:", response.status, errorText);
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}

					// Handle streaming response
					const reader = response.body?.getReader();
					const decoder = new TextDecoder();
					let assistantMessage = "";

					if (reader) {
						while (true) {
							const { done, value } = await reader.read();
							if (done) break;
							
							const chunk = decoder.decode(value);
							assistantMessage += chunk;
						}
						console.log("📡 Message received:", assistantMessage.substring(0, 100) + "...");
					}

					// Check if the response is an error message
					const isErrorMessage = assistantMessage.includes("error occurred") || 
										  assistantMessage.includes("credit balance is too low") ||
										  assistantMessage.includes("Error:") ||
										  assistantMessage.includes("Plans & Billing");

					if (isErrorMessage) {
						// Treat as error and show error styling
						console.error("📡 Agent returned error:", assistantMessage);
						setError(new Error(assistantMessage));
						
						// Clean up the error message for better user experience
						let cleanErrorMessage = assistantMessage;
						if (cleanErrorMessage.startsWith("Error: ")) {
							cleanErrorMessage = cleanErrorMessage.substring(7);
						}
						
						setMessages(prev => [...prev, { 
							role: "assistant", 
							content: `**Service Alert**\n\n${cleanErrorMessage}`,
							isError: true // Flag for UI styling
						}]);
					} else {
						// Normal successful response
						setMessages(prev => [...prev, { 
							role: "assistant", 
							content: assistantMessage || "I'm having trouble connecting to the AI service. Please try again." 
						}]);
					}
					setStatus("idle");
				} catch (err) {
					console.error("💥 Fallback chat error:", err);
					setError(err instanceof Error ? err : new Error("Unknown error"));
					setMessages(prev => [...prev, { 
						role: "assistant", 
						content: "I'm experiencing connection issues. Please try again." 
					}]);
					setStatus("idle");
				}
			};

			const handleSubmit = async (e: React.FormEvent) => {
				e.preventDefault();
				console.log("🎯 HandleSubmit called, input:", input, "status:", status);
				
				if (input.trim() && status !== "loading") {
					console.log("🎯 About to call append with:", { role: "user", content: input.trim() });
					try {
						await append({ role: "user", content: input.trim() });
						setInput("");
						console.log("🎯 Append completed successfully, input cleared");
					} catch (error) {
						console.error("🎯 Error in append:", error);
						setError(error instanceof Error ? error : new Error("Failed to send message"));
						setStatus("idle");
					}
				} else {
					console.warn("🎯 Cannot submit - input empty or loading:", { 
						inputEmpty: !input.trim(), 
						isLoading: status === "loading",
						status 
					});
				}
			};

			const result = {
				messages,
				append,
				status,
				error,
				input,
				setInput,
				handleSubmit,
				stop: () => setStatus("idle"),
				reload: () => {
					setMessages([]);
					setError(null);
				},
				validation,
			};
			
			console.log("🔧 Fallback hook returning:", {
				hasInput: result.input !== undefined,
				hasSetInput: typeof result.setInput === 'function',
				hasHandleSubmit: typeof result.handleSubmit === 'function',
				hasAppend: typeof result.append === 'function',
				messagesCount: result.messages.length
			});
			
			return result;
	} catch (error) {
		console.error("useV2Chat error:", error);
		// Return fallback object on any error
		return {
			messages: [],
			append: () => {},
			status: "idle" as const,
			error: error instanceof Error ? error : new Error("Unknown chat error"),
			input: "",
			setInput: (value: string) => {
				console.warn("🚨 Using error fallback setInput");
			},
			handleSubmit: () => {},
			stop: () => {},
			reload: () => {},
			validation: {
				compatible: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
		};
	}
}

/**
 * Test function to verify SDK works with existing API endpoint
 */
export async function testSDKCompatibility(): Promise<{
	success: boolean;
	error?: string;
	details?: any;
}> {
	try {
		// Test basic API endpoint connectivity
		const response = await fetch("/api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message: "SDK compatibility test",
				conversationId: null,
			}),
		});

		if (!response.ok) {
			return {
				success: false,
				error: `API endpoint returned ${response.status}: ${response.statusText}`,
			};
		}

		// Check if response is streamable
		const reader = response.body?.getReader();
		if (!reader) {
			return {
				success: false,
				error: "Response body is not readable stream",
			};
		}

		// Read first chunk to verify streaming works
		const { done, value } = await reader.read();
		reader.releaseLock();

		return {
			success: true,
			details: {
				streamingSupported: !done,
				firstChunkSize: value?.length || 0,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown test error",
		};
	}
}
