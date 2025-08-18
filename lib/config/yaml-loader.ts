import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';

export interface YamlModelConfig {
  name: string;
  provider: string;
  costPer1kInput: number;
  costPer1kOutput: number;
  maxTokens: number;
  capabilities: Record<string, string>[];
  useCases: string[];
  isAvailable: boolean;
}

export interface YamlAgentConfig {
  agentName: string;
  primaryModel: string;
  fallbackModel?: string;
  maxTokens: number;
  temperature: number;
  useCase: string;
}

export interface YamlEnvironmentConfig {
  current: string;
  costOptimization: string;
  maxMonthlyBudget: number;
  defaultModel: string;
}

export interface YamlCostRules {
  preferredModels: string[];
  maxCostPerRequest: number;
  fallbackStrategy: string;
}

export interface YamlConfig {
  environment: YamlEnvironmentConfig;
  openai_models: Record<string, YamlModelConfig>;
  anthropic_models: Record<string, YamlModelConfig>;
  google_models: Record<string, YamlModelConfig>;
  agent_configs: Record<string, YamlAgentConfig>;
  cost_rules: Record<string, YamlCostRules>;
}

export class YamlConfigLoader {
  private config: YamlConfig | null = null;
  private configPath: string;

  constructor(configPath = 'lib/config/models.yaml') {
    this.configPath = path.resolve(process.cwd(), configPath);
  }

  loadConfig(): YamlConfig {
    if (this.config) {
      return this.config;
    }

    try {
      const fileContents = fs.readFileSync(this.configPath, 'utf8');
      this.config = yaml.load(fileContents) as YamlConfig;

      if (!this.config) {
        throw new Error('Failed to parse YAML configuration');
      }

      console.log('✅ YAML configuration loaded successfully');
      return this.config;
    } catch (error) {
      console.error('❌ Failed to load YAML configuration:', error);
      throw new Error(`Configuration loading failed: ${error}`);
    }
  }

  getEnvironmentConfig(): YamlEnvironmentConfig {
    const config = this.loadConfig();
    return config.environment;
  }

  getModelConfig(modelId: string): YamlModelConfig | null {
    const config = this.loadConfig();

    // Check all model providers
    const allModels = {
      ...config.openai_models,
      ...config.anthropic_models,
      ...config.google_models,
    };

    return allModels[modelId] || null;
  }

  getAgentConfig(agentId: string): YamlAgentConfig | null {
    const config = this.loadConfig();
    return config.agent_configs[agentId] || null;
  }

  getCostRules(environment: string): YamlCostRules | null {
    const config = this.loadConfig();
    return config.cost_rules[environment] || null;
  }

  getAllModels(): Record<string, YamlModelConfig> {
    const config = this.loadConfig();
    return {
      ...config.openai_models,
      ...config.anthropic_models,
      ...config.google_models,
    };
  }

  getAllAgents(): Record<string, YamlAgentConfig> {
    const config = this.loadConfig();
    return config.agent_configs;
  }

  getCheapestModel(capabilities: string[] = ['text']): string {
    const allModels = this.getAllModels();

    const availableModels = Object.entries(allModels).filter(
      ([id, model]) =>
        model.isAvailable &&
        capabilities.every((cap) =>
          model.capabilities.some((c) => Object.keys(c)[0] === cap),
        ),
    );

    if (availableModels.length === 0) {
      return this.getEnvironmentConfig().defaultModel;
    }

    const cheapest = availableModels.reduce((cheapest, current) =>
      current[1].costPer1kInput < cheapest[1].costPer1kInput
        ? current
        : cheapest,
    );

    return cheapest[0];
  }

  calculateCost(
    modelId: string,
    inputTokens: number,
    outputTokens: number,
  ): number {
    const model = this.getModelConfig(modelId);
    if (!model) return 0;

    const inputCost = (inputTokens / 1000) * model.costPer1kInput;
    const outputCost = (outputTokens / 1000) * model.costPer1kOutput;

    return inputCost + outputCost;
  }

  getRecommendedModel(
    useCase: string,
    budget: 'low' | 'medium' | 'high' = 'low',
  ): string {
    const allAgents = this.getAllAgents();
    const useCaseAgents = Object.entries(allAgents).filter(
      ([id, config]) => config.useCase === useCase,
    );

    if (useCaseAgents.length === 0) {
      return this.getEnvironmentConfig().defaultModel;
    }

    const agent = useCaseAgents[0][1];

    switch (budget) {
      case 'low':
        return agent.primaryModel;
      case 'medium':
        return agent.fallbackModel || agent.primaryModel;
      case 'high': {
        // Find the most capable model for this use case
        const allModels = this.getAllModels();
        const models = Object.entries(allModels).filter(
          ([id, model]) =>
            model.isAvailable &&
            model.capabilities.some((cap) =>
              useCase.includes('vision')
                ? Object.keys(cap)[0] === 'vision'
                : useCase.includes('search')
                  ? Object.keys(cap)[0] === 'search'
                  : useCase.includes('reasoning')
                    ? Object.keys(cap)[0] === 'reasoning'
                    : Object.keys(cap)[0] === 'text',
            ),
        );

        if (models.length === 0) {
          return agent.primaryModel;
        }

        return models.reduce((best, current) =>
          current[1].costPer1kInput > best[1].costPer1kInput ? current : best,
        )[0];
      }
    }
  }

  reloadConfig(): void {
    this.config = null;
    this.loadConfig();
  }
}

// Export singleton instance
export const yamlConfigLoader = new YamlConfigLoader();
