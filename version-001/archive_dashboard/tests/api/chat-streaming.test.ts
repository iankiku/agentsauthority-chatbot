/**
 * Test for chat API route streaming functionality
 */

import { NextRequest } from "next/server";
import { callAgentApi } from "../../lib/mastra-client";

// Mock the database operations
jest.mock("../../lib/db/queries", () => ({
	saveConversation: jest.fn(() =>
		Promise.resolve({ id: "test-conversation-id" })
	),
	saveMessage: jest.fn(() => Promise.resolve("test-message-id")),
	getConversationMessages: jest.fn(() => Promise.resolve([])),
}));

// Mock auth
jest.mock("../../lib/auth-utils", () => ({
	auth: {
		api: {
			getSession: jest.fn(() =>
				Promise.resolve({ user: { id: "test-user-id" } })
			),
		},
	},
}));

// Mock the Mastra client
jest.mock("../../lib/mastra-client", () => ({
	callAgentApi: jest.fn(),
}));

// Import after mocking
import { POST } from "../../app/api/chat/route";

describe("Chat API Route", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should use streaming mode when calling agent", async () => {
		// Setup
		const mockStream = new ReadableStream({
			start(controller) {
				controller.enqueue(new TextEncoder().encode("Test response"));
				controller.close();
			},
		});

		const mockResponse = new Response(mockStream);
		(callAgentApi as jest.Mock).mockResolvedValue(mockResponse);

		// Create mock request
		const mockRequest = new NextRequest("http://localhost:3000/api/chat", {
			method: "POST",
			body: JSON.stringify({ message: "Hello", conversationId: null }),
		});

		// Execute
		const response = await POST(mockRequest);

		// Verify
		expect(callAgentApi).toHaveBeenCalledWith(
			expect.objectContaining({
				method: "stream", // Verify the method is now "stream" instead of "generate"
			})
		);

		// Verify response is a streaming response
		expect(response instanceof Response).toBe(true);
		expect(response.body).toBeDefined();

		// Read the stream content
		const reader = response.body!.getReader();
		const { done, value } = await reader.read();

		// Verify stream content
		const text = done ? "" : new TextDecoder().decode(value);
		expect(text).toContain("Test response");
	});

	it("should fall back to generate method if stream fails", async () => {
		// Setup - simulate stream failure
		(callAgentApi as jest.Mock).mockImplementation(async ({ method }) => {
			if (method === "stream") {
				// Return a non-Response value to trigger fallback
				return "Not a Response object";
			} else if (method === "generate") {
				// Return a successful generate response
				return { text: "Fallback response" };
			}
		});

		// Create mock request
		const mockRequest = new NextRequest("http://localhost:3000/api/chat", {
			method: "POST",
			body: JSON.stringify({ message: "Hello", conversationId: null }),
		});

		// Execute
		const response = await POST(mockRequest);

		// Verify
		expect(callAgentApi).toHaveBeenCalledTimes(2); // Called twice - once for stream, once for fallback

		// First call should be with method="stream"
		expect(callAgentApi).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				method: "stream",
			})
		);

		// Second call should be with method="generate"
		expect(callAgentApi).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				method: "generate",
			})
		);

		// Verify response contains fallback content
		const reader = response.body!.getReader();
		const { done, value } = await reader.read();
		const text = done ? "" : new TextDecoder().decode(value);
		expect(text).toContain("Fallback response");
	});
});
