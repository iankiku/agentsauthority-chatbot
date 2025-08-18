# Model Configuration System

A comprehensive model configuration system for the GEO Intelligence Platform
that allows easy selection of AI models based on cost, capabilities, and use
cases.

## 🎯 **Overview**

This system provides:

- **Cost-effective model selection** for test phase
- **Easy configuration management** via YAML files
- **Automatic cost tracking** and optimization
- **Environment-specific settings** (dev/test/prod)
- **Agent-specific model assignments**

## 📁 **Files**

- `models.ts` - TypeScript configuration with full type safety
- `models.yaml` - YAML configuration for easy editing
- `yaml-loader.ts` - YAML parser and utility functions

## 🏗️ **Architecture**

### **Model Configuration**

```typescript
interface ModelConfig {
	id: string;
	name: string;
	provider: "openai" | "anthropic" | "google";
	costPer1kInput: number;
	costPer1kOutput: number;
	maxTokens: number;
	capabilities: ModelCapability[];
	useCases: string[];
	isAvailable: boolean;
}
```

### **Agent Configuration**

```typescript
interface AgentModelConfig {
	agentId: string;
	agentName: string;
	primaryModel: string;
	fallbackModel?: string;
	maxTokens: number;
	temperature: number;
	useCase: string;
}
```

## 💰 **Cost-Effective Models for Testing**

### **Cheapest Options ($0.10/1k input)**

- `gpt-4.1-nano` - General text processing (CHEAPEST)
- `gpt-4o-mini` - General text processing ($0.15/1k input)
- `gpt-4o-mini-audio-preview` - Audio capabilities ($0.15/1k input)
- `gpt-4o-mini-search-preview` - Web search capabilities ($0.15/1k input)

### **Balanced Options**

- `gpt-4o-mini-realtime-preview` - Real-time streaming ($0.60/1k input)
- `gpt-4o` - Full capabilities ($2.50/1k input)

### **Specialized Options**

- `computer-use-preview` - Code execution ($3.00/1k input)
- `gpt-4o-search-preview` - Advanced search ($2.50/1k input)

## 🎛️ **Usage**

### **TypeScript Configuration**

```typescript
import {
	getModelConfig,
	getAgentModelConfig,
	calculateCost,
} from "./lib/config/models";

// Get model configuration
const model = getModelConfig("gpt-4o-mini");

// Get agent configuration
const agent = getAgentModelConfig("brand-monitor-agent");

// Calculate cost
const cost = calculateCost("gpt-4o-mini", 1000, 500); // $0.45
```

### **YAML Configuration**

```typescript
import { yamlConfigLoader } from "./lib/config/yaml-loader";

// Load configuration
const config = yamlConfigLoader.loadConfig();

// Get environment settings
const env = yamlConfigLoader.getEnvironmentConfig();

// Get cheapest model
const cheapest = yamlConfigLoader.getCheapestModel(["text", "search"]);
```

## 🔧 **Configuration Management**

### **Environment Settings**

```yaml
environment:
  current: development # development | test | production
  costOptimization: minimal # minimal | balanced | performance
  maxMonthlyBudget: 100 # $100 budget for testing
  defaultModel: gpt-4o-mini
```

### **Agent Assignment**

```yaml
agent_configs:
  brand-monitor-agent:
    agentName: "Brand Monitor Agent"
    primaryModel: gpt-4o-mini
    fallbackModel: gpt-4o-mini-audio-preview
    maxTokens: 32000
    temperature: 0.3
    useCase: brand-monitoring
```

### **Cost Rules**

```yaml
cost_rules:
  development:
    preferredModels: [gpt-4o-mini, gpt-4o-mini-audio-preview]
    maxCostPerRequest: 0.10
    fallbackStrategy: cheapest
```

## 🎯 **Agent Model Assignments**

| Agent                    | Primary Model                | Fallback Model         | Use Case              |
| ------------------------ | ---------------------------- | ---------------------- | --------------------- |
| Brand Monitor            | `gpt-4.1-nano`               | `gpt-4o-mini`          | Brand monitoring      |
| Visibility Explorer      | `gpt-4.1-nano`               | `gpt-4o-mini`          | Visibility analysis   |
| Action Implementation    | `gpt-4.1-nano`               | `computer-use-preview` | Action implementation |
| Competitive Intelligence | `gpt-4o-mini-search-preview` | `gpt-4.1-nano`         | Competitive analysis  |
| General Chat             | `gpt-4.1-nano`               | `gpt-4o-mini`          | General chat          |
| Reasoning Chat           | `gpt-4.1-nano`               | `gpt-4o`               | Reasoning chat        |
| Weather Agent            | `gpt-4.1-nano`               | `gpt-4o-mini`          | Weather information   |

## 💡 **Best Practices**

### **For Testing Phase**

1. Use `gpt-4.1-nano` as primary model (cheapest at $0.10/1k input)
2. Set `costOptimization: minimal`
3. Use fallback models for specialized capabilities
4. Monitor costs with `costTracker`

### **For Production**

1. Use `gpt-4o` for complex tasks
2. Set `costOptimization: balanced`
3. Implement proper error handling
4. Use cost tracking for budget management

### **Cost Optimization**

```typescript
// Get cheapest model for specific capabilities
const cheapest = getCheapestModel(["text", "search"]);

// Calculate expected cost
const cost = calculateCost(modelId, inputTokens, outputTokens);

// Track costs
costTracker.addCost(modelId, cost);
```

## 🔄 **Migration Guide**

### **From Hardcoded Models**

```typescript
// OLD
const model = "gpt-4o";

// NEW
const model =
	getAgentModelConfig("brand-monitor-agent")?.primaryModel || "gpt-4o-mini";
```

### **From Environment Variables**

```typescript
// OLD
const model = process.env.OPENAI_MODEL || "gpt-4o";

// NEW
const model = getRecommendedModel("brand-monitoring", "low");
```

## 📊 **Cost Tracking**

The system includes built-in cost tracking:

```typescript
import { costTracker } from "./lib/config/models";

// Track costs
costTracker.addCost("gpt-4o-mini", 0.45);

// Get total cost
const total = costTracker.getTotalCost();

// Get cost by model
const costs = costTracker.getCostByModel();

// Reset tracking
costTracker.reset();
```

## 🚀 **Quick Start**

1. **Edit YAML configuration** in `models.yaml`
2. **Use TypeScript utilities** for type-safe access
3. **Monitor costs** with built-in tracking
4. **Switch environments** by changing `environment.current`

## 🔍 **Troubleshooting**

### **Common Issues**

- **YAML parsing errors**: Check YAML syntax
- **Model not found**: Verify model ID in configuration
- **Cost calculation errors**: Check model configuration
- **Agent not found**: Verify agent ID in configuration

### **Debug Mode**

```typescript
// Enable debug logging
console.log("Model config:", getModelConfig("gpt-4o-mini"));
console.log("Agent config:", getAgentModelConfig("brand-monitor-agent"));
```

## 📈 **Performance**

- **YAML loading**: Cached after first load
- **Cost calculation**: O(1) lookup
- **Model selection**: O(n) for capability matching
- **Memory usage**: Minimal, configuration cached in memory

## 🔮 **Future Enhancements**

- [ ] Dynamic model switching based on performance
- [ ] A/B testing for model selection
- [ ] Cost prediction for requests
- [ ] Automatic fallback based on error rates
- [ ] Integration with monitoring systems
