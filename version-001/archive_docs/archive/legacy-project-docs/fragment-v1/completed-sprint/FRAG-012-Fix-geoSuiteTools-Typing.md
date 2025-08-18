> **GOTCHA**: As a general rule, we are currently ignoring Mastra-related
> linting errors. This ticket is the exception, as its entire purpose is to
> investigate and fix the root cause of one such error in `geoSuiteTools.ts`.

# FRAG-012: Resolve TypeScript Type Inference Error in geoSuiteTools.ts

- **Status**: 🚨 PENDING
- **Priority**: Medium
- **Effort**: Medium
- **Author**: AI

## 1. Overview

The tool definition file at `apps/agents-mastra/mastra/tools/geoSuiteTools.ts`
has a persistent and complex TypeScript error that prevents the project from
building cleanly. The error relates to the inferred return type of the
`makeTool` factory function, which TypeScript flags as "not portable" because it
references a complex, un-exported type from the `@mastra/core` dependency.

Multiple automated attempts to fix this by applying different type annotation
strategies have failed, leading to a loop of related errors. This ticket is for
a developer to manually investigate and apply a robust fix.

## 2. Problem Details

- **File with Error**: `apps/agents-mastra/mastra/tools/geoSuiteTools.ts`
- **Error Message**:
  `The inferred type of '...' cannot be named without a reference to '../../node_modules/@mastra/core/dist/base-....'. This is likely not portable. A type annotation is necessary.`
- **Core Issue**: The `makeTool` function in
  `apps/agents-mastra/mastra/tools/base/toolFactory.ts` returns the result of
  `createTool` from `@mastra/core/tools`. The return type of `createTool` is a
  complex, anonymous object type that TypeScript struggles to handle when it's
  exported from `geoSuiteTools.ts`.

## 3. Recommended Approach

A developer should investigate the following potential solutions:

1.  **Direct `createTool` Usage**: Instead of using the `makeTool` factory,
    refactor `geoSuiteTools.ts` to use `createTool` directly, as shown in the
    Mastra documentation. This is the most likely solution to succeed.

    ```typescript
    import { createTool } from "@mastra/core/tools";
    import { z } from "zod";

    export const keywordClusterTool = createTool({
    	id: "keyword-cluster",
    	description: "...",
    	inputSchema: z.object({
    		/* ... */
    	}),
    	outputSchema: z.object({
    		/* ... */
    	}),
    	execute: async ({ context }) => {
    		// handler logic here, using 'context' as input
    		return { clusters: [] };
    	},
    });
    ```

2.  **Explicit Return Type on `makeTool`**: If the factory pattern is preferred,
    define an explicit `Tool` interface in `toolFactory.ts` that precisely
    matches the structure returned by `createTool` and use it as the return type
    for `makeTool`. This has proven difficult for the AI to get right but may be
    possible with manual effort.

## 4. Acceptance Criteria

- The file `apps/agents-mastra/mastra/tools/geoSuiteTools.ts` no longer produces
  any TypeScript or linter errors.
- The project successfully builds (`pnpm build`).
- The solution is robust and does not introduce new type-related issues in other
  files.
