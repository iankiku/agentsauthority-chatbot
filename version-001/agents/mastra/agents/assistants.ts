// assistants.ts

import { defaultModel, claudeModel, ollamaModel, openaiModel } from "@/mastra/lib/llm/models";
import { Agent } from "@mastra/core/agent";
import { memoryKlass } from "../config/memory";
import { masterPlannerPrompt } from "../lib/prompts/masterPlanner";
import { openai } from "@ai-sdk/openai";

/**
 * 1. Chat Assistant Agent
 *
 * This is the front‑line assistant that directly converses with the user,
 * captures their request, and delegates to the Supervisor for orchestration.
 */
export const chatAgent = new Agent({
	name: "Chat Agent",
	description:
		"The Chat Assistant is the front-line assistant that directly converses with the user and orchestrates planning and execution.",
	instructions: () => `
    You are the Chat Assistant. Engage with the user, clarify their request,
    and then delegate planning to the Master Planner Agent.

    1. Greet the user and confirm understanding of the request.
    2. If any clarification is needed, ask exactly one follow‑up question.
    3. Once the request is clear, package the user's goal into JSON:
       {
         "userId": "<user_id>",
         "goal": "<user's request>"
       }
    4. Call the Master Planner Agent by returning:
       <delegate to="Master Planner">{{JSON_payload}}</delegate>

    Never attempt to solve the goal yourself—always delegate to Master Planner.
    `,
	model: openaiModel,
	tools: {},
	memory: memoryKlass,
});

/**
 * 2. Master Planner Agent
 *
 * Breaks down the user's goal into an ordered plan of atomic steps,
 * with clear actions, descriptions, and conditional logic.
 */
export const plannerAgent = new Agent({
	name: "Master Planner",
	description:
		"The Master Planner is responsible for breaking down the user's goal into an ordered plan of atomic steps, with clear actions, descriptions, and conditional logic.",
	instructions: () =>
		masterPlannerPrompt({
			dynamicGoalDescription: `User goal: "{{goal}}"`,
			condition: `no <toolResult> found`,
		}),
	model: defaultModel,
	tools: {},
	memory: memoryKlass,
});

/**
 * Export the three MVP agents
 */
export const assistants = {
	chatAgent,
	plannerAgent,
};
