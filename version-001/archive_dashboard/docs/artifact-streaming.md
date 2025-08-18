# Artifact Streaming and Multi-Agent Orchestration

This document explains the implementation of artifact detection and multi-agent
orchestration in the chat streaming system.

## Features Implemented

1. **Artifact Detection**: Parses agent responses for structured artifacts like
   charts, tables, and scorecards
2. **Artifact Rendering**: Converts artifacts to AI SDK format for seamless UI
   rendering
3. **Multi-Agent Orchestration**: Enables automatic delegation between
   specialized agents
4. **Agent Progress Visibility**: Shows which agent is handling the request in
   real-time

## Technical Implementation

### Artifact Detection

Artifacts are detected using a pattern-based approach:

```
<artifact type="data-table">
  {
    "headers": ["Platform", "Visibility Score", "Change"],
    "rows": [
      ["ChatGPT", 85, "+12%"],
      ["Claude", 76, "+8%"],
      ["Perplexity", 62, "+5%"],
      ["Gemini", 71, "+10%"]
    ],
    "title": "Platform Visibility Scores"
  }
</artifact>
```

The system detects these patterns in the stream, parses the JSON payload, and
converts them to the appropriate format for rendering in the UI.

### Agent Orchestration

Agent delegation is detected using a similar pattern:

```
<delegate to="Brand Analysis Agent">
  {
    "query": "Perform detailed brand visibility analysis for acme corp",
    "metrics": ["mentions", "sentiment", "visibility_score"],
    "timeframe": "last_30_days"
  }
</delegate>
```

When delegation is detected:

1. The streaming is paused
2. The specialized agent is called with the delegation data
3. The specialized agent's response is streamed back to the client
4. Progress indicators show which agent is handling the request

### Integration with AI SDK

The system transforms Mastra stream responses into AI SDK compatible format:

```typescript
// Original Mastra stream chunk
<artifact type="geo-score-card">{"score": 78, "description": "..."}</artifact>

// Transformed for AI SDK
data: {"type": "tool", "value": {"id": "artifact-123", "type": "artifact", "result": {"type": "geo_score_card", "data": {"score": 78, "description": "..."}}}}
```

This allows the existing UI components to render the artifacts without
modification.

## Supported Artifact Types

1. **geo_score_card**: Brand visibility score metrics
2. **data_table**: Tabular data with headers and rows
3. **line_chart**: Time-series visualizations
4. **competitor_matrix**: Side-by-side comparison of competitors
5. **recommendations_card**: Actionable recommendations with impact assessment
6. **dashboard_layout**: Grid layout with multiple artifacts

## Specialized Agent Integration

The following specialized agents can be called by the main chatAgent:

1. **plannerAgent**: Creates plans for complex queries
2. **brandAnalysisAgent**: Performs detailed brand analysis
3. **visibilityAnalysisAgent**: Assesses visibility across AI platforms
4. **keywordClusterAgent**: Analyzes keyword patterns and groupings
5. **brandMonitorAgent**: Monitors brand mentions and sentiment
6. **promptSimulatorAgent**: Tests how prompts would perform across platforms
7. **aiCopywriterAgent**: Generates optimized content for AI visibility

## Testing

Two test scripts are available to verify the implementation:

1. `scripts/test-artifacts.sh`: Tests artifact detection and agent delegation
2. `scripts/test-streaming.sh`: Tests the streaming integration with Mastra
   agents

## Example Usage

Users can now ask complex questions that trigger multi-agent workflows:

```
User: "Analyze my brand's visibility across AI platforms and give me recommendations"

System:
- chatAgent determines this needs specialized analysis
- Delegates to brandAnalysisAgent
- brandAnalysisAgent responds with text AND geo_score_card artifact
- UI shows real-time streaming with visual artifact
```

## Next Steps

After validation of this implementation, further enhancements could include:

1. Parallel agent execution for complex queries
2. More sophisticated artifact types (interactive dashboards)
3. Client-side artifact manipulation and exploration
4. Export functionality for artifacts
