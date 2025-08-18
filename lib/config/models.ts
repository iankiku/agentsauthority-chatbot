// OpenAI Model Configuration
// Cost-effective model selection for test phase

export interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google';
  costPer1kInput: number;
  costPer1kOutput: number;
  maxTokens: number;
  capabilities: ModelCapability[];
  useCases: string[];
  isAvailable: boolean;
}

export interface ModelCapability {
  type:
    | 'text'
    | 'vision'
    | 'audio'
    | 'code'
    | 'reasoning'
    | 'search'
    | 'realtime';
  description: string;
}

export interface AgentModelConfig {
  agentId: string;
  agentName: string;
  primaryModel: string;
  fallbackModel?: string;
  maxTokens: number;
  temperature: number;
  useCase: string;
}

export interface EnvironmentConfig {
  environment: 'development' | 'test' | 'production';
  defaultModel: string;
  costOptimization: 'minimal' | 'balanced' | 'performance';
  maxMonthlyBudget?: number;
}

// OpenAI Models - Cost-effective selection for test phase
export const OPENAI_MODELS: Record<string, ModelConfig> = {
  // CHEAPEST OPTIONS FOR TESTING
  'gpt-4.1-nano': {
    id: 'gpt-4.1-nano',
    name: 'GPT-4.1 Nano',
    provider: 'openai',
    costPer1kInput: 0.1,
    costPer1kOutput: 0.4,
    maxTokens: 128000,
    capabilities: [
      { type: 'text', description: 'General text processing' },
      { type: 'reasoning', description: 'Basic reasoning capabilities' },
    ],
    useCases: ['chat', 'analysis', 'summarization', 'testing'],
    isAvailable: true,
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    costPer1kInput: 0.15,
    costPer1kOutput: 0.6,
    maxTokens: 128000,
    capabilities: [
      { type: 'text', description: 'General text processing' },
      { type: 'reasoning', description: 'Basic reasoning capabilities' },
    ],
    useCases: ['chat', 'analysis', 'summarization', 'testing'],
    isAvailable: true,
  },
  'gpt-4o-mini-audio-preview': {
    id: 'gpt-4o-mini-audio-preview',
    name: 'GPT-4o Mini Audio',
    provider: 'openai',
    costPer1kInput: 0.15,
    costPer1kOutput: 0.6,
    maxTokens: 128000,
    capabilities: [
      { type: 'text', description: 'General text processing' },
      { type: 'audio', description: 'Audio input/output' },
    ],
    useCases: ['voice-chat', 'audio-analysis', 'testing'],
    isAvailable: true,
  },
  'gpt-4o-mini-realtime-preview': {
    id: 'gpt-4o-mini-realtime-preview',
    name: 'GPT-4o Mini Realtime',
    provider: 'openai',
    costPer1kInput: 0.6,
    costPer1kOutput: 2.4,
    maxTokens: 128000,
    capabilities: [
      { type: 'text', description: 'General text processing' },
      { type: 'realtime', description: 'Real-time streaming' },
    ],
    useCases: ['real-time-chat', 'streaming', 'interactive'],
    isAvailable: true,
  },

  // BALANCED OPTIONS
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    costPer1kInput: 2.5,
    costPer1kOutput: 10.0,
    maxTokens: 128000,
    capabilities: [
      { type: 'text', description: 'Advanced text processing' },
      { type: 'vision', description: 'Image analysis' },
      { type: 'reasoning', description: 'Advanced reasoning' },
    ],
    useCases: ['complex-analysis', 'vision-tasks', 'production'],
    isAvailable: true,
  },
  'gpt-4o-mini-search-preview': {
    id: 'gpt-4o-mini-search-preview',
    name: 'GPT-4o Mini Search',
    provider: 'openai',
    costPer1kInput: 0.15,
    costPer1kOutput: 0.6,
    maxTokens: 128000,
    capabilities: [
      { type: 'text', description: 'General text processing' },
      { type: 'search', description: 'Web search capabilities' },
    ],
    useCases: ['research', 'web-search', 'fact-checking'],
    isAvailable: true,
  },

  // SPECIALIZED OPTIONS
  'gpt-4o-search-preview': {
    id: 'gpt-4o-search-preview',
    name: 'GPT-4o Search',
    provider: 'openai',
    costPer1kInput: 2.5,
    costPer1kOutput: 10.0,
    maxTokens: 128000,
    capabilities: [
      { type: 'text', description: 'Advanced text processing' },
      { type: 'search', description: 'Advanced web search' },
      { type: 'vision', description: 'Image analysis' },
    ],
    useCases: ['advanced-research', 'complex-search', 'production'],
    isAvailable: true,
  },
  'computer-use-preview': {
    id: 'computer-use-preview',
    name: 'Computer Use',
    provider: 'openai',
    costPer1kInput: 3.0,
    costPer1kOutput: 12.0,
    maxTokens: 128000,
    capabilities: [
      { type: 'text', description: 'General text processing' },
      { type: 'code', description: 'Code execution capabilities' },
    ],
    useCases: ['code-execution', 'automation', 'development'],
    isAvailable: true,
  },
};

// Anthropic Models
export const ANTHROPIC_MODELS: Record<string, ModelConfig> = {
  'claude-3-5-sonnet-20241022': {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    costPer1kInput: 3.0, // Approximate
    costPer1kOutput: 15.0, // Approximate
    maxTokens: 200000,
    capabilities: [
      { type: 'text', description: 'Advanced text processing' },
      { type: 'reasoning', description: 'Advanced reasoning' },
    ],
    useCases: ['complex-analysis', 'reasoning', 'production'],
    isAvailable: true,
  },
  'claude-3-haiku-20240307': {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    costPer1kInput: 0.25, // Approximate
    costPer1kOutput: 1.25, // Approximate
    maxTokens: 200000,
    capabilities: [
      { type: 'text', description: 'Fast text processing' },
      { type: 'reasoning', description: 'Basic reasoning' },
    ],
    useCases: ['fast-chat', 'simple-analysis', 'testing'],
    isAvailable: true,
  },
};

// Google Models
export const GOOGLE_MODELS: Record<string, ModelConfig> = {
  'gemini-1.5-flash': {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'google',
    costPer1kInput: 0.075, // Approximate
    costPer1kOutput: 0.3, // Approximate
    maxTokens: 1000000,
    capabilities: [
      { type: 'text', description: 'Fast text processing' },
      { type: 'vision', description: 'Image analysis' },
    ],
    useCases: ['fast-processing', 'vision-tasks', 'testing'],
    isAvailable: true,
  },
  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    costPer1kInput: 3.5, // Approximate
    costPer1kOutput: 10.5, // Approximate
    maxTokens: 1000000,
    capabilities: [
      { type: 'text', description: 'Advanced text processing' },
      { type: 'vision', description: 'Advanced image analysis' },
      { type: 'reasoning', description: 'Advanced reasoning' },
    ],
    useCases: ['complex-analysis', 'advanced-vision', 'production'],
    isAvailable: true,
  },
};

// All models combined
export const ALL_MODELS = {
  ...OPENAI_MODELS,
  ...ANTHROPIC_MODELS,
  ...GOOGLE_MODELS,
};

// Agent Model Configuration
export const AGENT_MODEL_CONFIG: AgentModelConfig[] = [
  // GEO Intelligence Agents
  {
    agentId: 'brand-monitor-agent',
    agentName: 'Brand Monitor Agent',
    primaryModel: 'gpt-4.1-nano', // Updated to cheapest
    fallbackModel: 'gpt-4o-mini',
    maxTokens: 32000,
    temperature: 0.3,
    useCase: 'brand-monitoring',
  },
  {
    agentId: 'visibility-explorer-agent',
    agentName: 'Visibility Explorer Agent',
    primaryModel: 'gpt-4.1-nano', // Updated to cheapest
    fallbackModel: 'gpt-4o-mini',
    maxTokens: 32000,
    temperature: 0.3,
    useCase: 'visibility-analysis',
  },
  {
    agentId: 'action-implementation-agent',
    agentName: 'Action Implementation Agent',
    primaryModel: 'gpt-4.1-nano', // Updated to cheapest
    fallbackModel: 'computer-use-preview',
    maxTokens: 32000,
    temperature: 0.2,
    useCase: 'action-implementation',
  },
  {
    agentId: 'competitive-intelligence-agent',
    agentName: 'Competitive Intelligence Agent',
    primaryModel: 'gpt-4o-mini-search-preview', // Keep search capability
    fallbackModel: 'gpt-4.1-nano', // Updated fallback
    maxTokens: 32000,
    temperature: 0.3,
    useCase: 'competitive-analysis',
  },

  // Chat Models
  {
    agentId: 'chat-model',
    agentName: 'General Chat Model',
    primaryModel: 'gpt-4.1-nano', // Updated to cheapest
    fallbackModel: 'gpt-4o-mini',
    maxTokens: 16000,
    temperature: 0.7,
    useCase: 'general-chat',
  },
  {
    agentId: 'chat-model-reasoning',
    agentName: 'Reasoning Chat Model',
    primaryModel: 'gpt-4.1-nano', // Updated to cheapest
    fallbackModel: 'gpt-4o',
    maxTokens: 32000,
    temperature: 0.3,
    useCase: 'reasoning-chat',
  },

  // Specialized Models
  {
    agentId: 'weather-agent',
    agentName: 'Weather Agent',
    primaryModel: 'gpt-4.1-nano', // Updated to cheapest
    fallbackModel: 'gpt-4o-mini',
    maxTokens: 8000,
    temperature: 0.1,
    useCase: 'weather-information',
  },
];

// Environment Configuration
export const ENVIRONMENT_CONFIG: EnvironmentConfig = {
  environment:
    (process.env.NODE_ENV as 'development' | 'test' | 'production') ||
    'development',
  defaultModel: 'gpt-4.1-nano', // Updated to cheapest option
  costOptimization: 'minimal', // Use cheapest models for testing
  maxMonthlyBudget: 100, // $100 budget for testing
};

// Utility Functions
export function getModelConfig(modelId: string): ModelConfig | null {
  return ALL_MODELS[modelId] || null;
}

export function getAgentModelConfig(agentId: string): AgentModelConfig | null {
  return (
    AGENT_MODEL_CONFIG.find((config) => config.agentId === agentId) || null
  );
}

export function getCheapestModel(
  capabilities: ModelCapability['type'][] = ['text'],
): ModelConfig {
  const availableModels = Object.values(ALL_MODELS).filter(
    (model) =>
      model.isAvailable &&
      capabilities.every((cap) =>
        model.capabilities.some((c) => c.type === cap),
      ),
  );

  return availableModels.reduce((cheapest, current) =>
    current.costPer1kInput < cheapest.costPer1kInput ? current : cheapest,
  );
}

export function calculateCost(
  modelId: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const model = getModelConfig(modelId);
  if (!model) return 0;

  const inputCost = (inputTokens / 1000) * model.costPer1kInput;
  const outputCost = (outputTokens / 1000) * model.costPer1kOutput;

  return inputCost + outputCost;
}

export function getRecommendedModel(
  useCase: string,
  budget: 'low' | 'medium' | 'high' = 'low',
): string {
  const useCaseConfigs = AGENT_MODEL_CONFIG.filter(
    (config) => config.useCase === useCase,
  );

  if (useCaseConfigs.length === 0) {
    return ENVIRONMENT_CONFIG.defaultModel;
  }

  const config = useCaseConfigs[0];

  switch (budget) {
    case 'low':
      return config.primaryModel;
    case 'medium':
      return config.fallbackModel || config.primaryModel;
    case 'high': {
      // Find the most capable model for this use case
      const models = Object.values(ALL_MODELS).filter(
        (model) =>
          model.isAvailable &&
          model.capabilities.some((cap) =>
            useCase.includes('vision')
              ? cap.type === 'vision'
              : useCase.includes('search')
                ? cap.type === 'search'
                : useCase.includes('reasoning')
                  ? cap.type === 'reasoning'
                  : cap.type === 'text',
          ),
      );
      return models.reduce((best, current) =>
        current.costPer1kInput > best.costPer1kInput ? current : best,
      ).id;
    }
  }
}

// Cost tracking
export class ModelCostTracker {
  private costs: Map<string, number> = new Map();

  addCost(modelId: string, cost: number): void {
    const current = this.costs.get(modelId) || 0;
    this.costs.set(modelId, current + cost);
  }

  getTotalCost(): number {
    return Array.from(this.costs.values()).reduce((sum, cost) => sum + cost, 0);
  }

  getCostByModel(): Record<string, number> {
    return Object.fromEntries(this.costs);
  }

  reset(): void {
    this.costs.clear();
  }
}

// Export singleton instance
export const costTracker = new ModelCostTracker();
