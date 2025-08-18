# FRAG-013: Agent Configuration Service

## 🚧 Status: In Progress

## Overview

Create a centralized agent configuration service that allows for easy management
of agent settings across different environments (development, staging,
production). This service will provide a unified way to configure agent
parameters such as model selection, memory storage, and agent-specific settings.

## Business Value

- Simplifies agent configuration management
- Enables environment-specific configurations
- Facilitates A/B testing of different agent configurations
- Provides a foundation for future agent configuration UI

## Technical Details

### Requirements

1. Create a centralized configuration module in
   `apps/agents-mastra/mastra/config/`
2. Support different agent types with specific configurations
3. Support environment-specific settings (dev, staging, prod)
4. Provide helper functions to retrieve configurations

### Implementation Details

#### 1. Agent Configuration Structure

Create a configuration service that supports:

- Base configuration for all agents
- Agent-type specific configurations
- Environment-specific overrides

#### 2. Agent Types

Define a type for all available agent types:

```typescript
export type AgentType =
	| "content-cluster"
	| "brand-monitor"
	| "topical-depth"
	| "prompt-simulator"
	| "static-render"
	| "ai-copywriter"
	| "prompt-trend"
	| "ai-readiness"
	| "geo-orchestrator";
```

#### 3. Configuration Interface

```typescript
export interface AgentConfig {
	model: any;
	memory: Memory;
	systemPrompt?: string;
	temperature?: number;
	maxTokens?: number;
}
```

#### 4. Environment-specific Settings

```typescript
const environments = {
	development: {
		modelProvider: "ollama",
		modelName: "qwen2:latest",
		memoryType: "libsql",
		memoryUrl: process.env.TURSO_URL || "file:memory.db",
	},
	staging: {
		modelProvider: "openai",
		modelName: "gpt-4o",
		memoryType: "upstash",
		memoryUrl: process.env.UPSTASH_URL,
	},
	production: {
		modelProvider: "openai",
		modelName: "gpt-4o",
		memoryType: "upstash",
		memoryUrl: process.env.UPSTASH_URL,
	},
};
```

#### 5. Agent-specific Configurations

```typescript
const agentConfigs: Record<AgentType, Partial<AgentConfig>> = {
	"content-cluster": {
		systemPrompt: "...",
		temperature: 0.7,
	},
	// ... other agent types
};
```

#### 6. Configuration Retrieval

```typescript
export function getConfig(agentName: string, agentType?: AgentType): AgentConfig {
  // Base configuration
  const baseConfig = {...};

  // If agent type is provided, merge with agent-specific config
  if (agentType && agentType in agentConfigs) {
    return {
      ...baseConfig,
      ...agentConfigs[agentType],
    };
  }

  return baseConfig;
}
```

#### 7. Helper Functions

```typescript
export function getAgentType(agentName: string): AgentType | undefined {
	const nameToType: Record<string, AgentType> = {
		"Content Cluster Specialist": "content-cluster",
		// ... other mappings
	};

	return nameToType[agentName];
}
```

### Testing

- Test configuration retrieval for different agent types
- Test environment-specific configuration loading
- Test fallback to default values when specific configurations are not provided

## Acceptance Criteria

- [x] Configuration service is implemented in
      `apps/agents-mastra/mastra/config/agent-config.ts`
- [x] All agent types are supported with specific configurations
- [x] Environment-specific settings are supported
- [x] Helper functions for retrieving configurations are provided
- [x] Existing agents are updated to use the new configuration service
- [x] Documentation is added to explain how to use the configuration service

## Dependencies

- None

## Estimated Effort

- 4 hours

## Notes

- This ticket is a prerequisite for FRAG-014 (Create GEO Orchestrator Agent)
- Future enhancement: Add a UI for managing agent configurations
