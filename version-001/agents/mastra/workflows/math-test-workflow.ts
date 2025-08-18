import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";


const stepAdd = createStep({
	id: "add",
	inputSchema: z.object({ x: z.number(), y: z.number() }),
	outputSchema: z.object({ z: z.number() }),
	execute: async ({ inputData }) => {
		const { x, y } = inputData;
		const result = x + y;
		console.log("add result", result);
		return { z: result };
	},
});

const stepMultiplyBy = createStep({
	id: "multiply",
	inputSchema: z.object({
		x: z.number(),
		y: z.number().default(Math.random()),
	}),
	outputSchema: z.object({ z: z.number() }),
	execute: async ({ inputData }) => {
		console.log("inside multiplyBy", inputData);
		const { x } = inputData;
		const randomInt = 10;

		const result = x * randomInt; // 100 * 0.123456789 = 12.3456789
		console.log(
			`multiply result x: ${x} * randomInt: ${randomInt} = ${result}`
		);
		return { z: result };
	},
});

const result = createStep({
	id: "result",
	inputSchema: z.object({ a: z.number() }),
	outputSchema: z.object({ abc: z.number() }),
	execute: async ({ inputData }) => {
		return { abc: inputData.a };
	},
});

export const mathWorkflow = createWorkflow({
	id: "math‑workflow",
	description: "Full pipeline that does math",
	inputSchema: z.object({ x: z.number(), y: z.number() }),
	outputSchema: z.object({ z: z.number() }),
	steps: [stepAdd, stepMultiplyBy, result],
})
	.then(stepAdd)
	.map(async ({ inputData }) => {
		const { z } = inputData;
		return {
			x: z,
		};
	})

	.then(stepMultiplyBy)
	.map(async ({ inputData }) => {
		console.log("after multiplyBy", inputData);
		const { z } = inputData;
		return {
			a: z,
		};
	})
	.then(result)
	.commit();
