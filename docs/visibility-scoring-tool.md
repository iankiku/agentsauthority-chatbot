# Visibility Scoring Tool Documentation

## Overview

The Visibility Scoring Tool (GEO-206) provides comprehensive competitive
visibility analysis for brands. It calculates visibility scores, provides
competitive positioning analysis, calculates share of voice metrics, generates
competitive rankings, and delivers actionable insights and recommendations.

## Features

### Core Functionality

- **Visibility Scoring**: Calculates 0-100 visibility scores for all brands
- **Competitive Positioning**: Determines market position (leader, challenger,
  follower, niche)
- **Share of Voice**: Calculates market share and voice distribution
- **Competitive Rankings**: Generates ranked competitive landscape
- **Trend Analysis**: Historical trend analysis and predictions
- **Insights & Recommendations**: Actionable strategic recommendations

### Technical Features

- **Real-time Progress Tracking**: SSE integration for live progress updates
- **Customizable Scoring Weights**: Configurable scoring algorithm
- **Error Handling**: Robust error handling and recovery
- **Performance Optimized**: Fast analysis with <20 second response time
- **Scalable**: Supports 20+ simultaneous executions

## Architecture

### Components

1. **Visibility Scoring Tool** (`lib/ai/tools/visibility-scoring-tool.ts`)
   - Main tool implementation with SSE integration
   - Scoring algorithms and calculations
   - Competitive analysis functions

2. **Frontend Components**
   - `VisibilityScoringResults`: Results display component
   - `VisibilityScoringDemo`: Demo component for testing

3. **SSE Integration**
   - Real-time progress tracking
   - Connection management
   - Error handling and recovery

### Scoring Algorithm

The visibility scoring algorithm uses a weighted approach with four main
factors:

```typescript
visibilityScore =
	mentionCount * weights.mentions +
	sentimentScore * weights.sentiment +
	contextRelevance * weights.context +
	reachScore * weights.reach;
```

**Default Weights:**

- Mentions: 30%
- Sentiment: 20%
- Context: 20%
- Reach: 30%

## Usage

### Basic Usage

```typescript
import { visibilityScoringTool } from '../lib/ai/tools/visibility-scoring-tool';

const result = await visibilityScoringTool.handler({} as any, {
  brandName: 'Tesla',
  competitors: ['Ford', 'GM', 'Volkswagen'],
  analysisResults: [...], // From multi-provider analysis
  taskId: 'unique-task-id', // For SSE tracking
});
```

### Advanced Usage with Custom Weights

```typescript
const result = await visibilityScoringTool.handler({} as any, {
  brandName: 'Tesla',
  competitors: ['Ford', 'GM', 'Volkswagen'],
  analysisResults: [...],
  brandDetectionResults: [...],
  historicalData: [...],
  scoringWeights: {
    mentions: 0.4,
    sentiment: 0.3,
    context: 0.2,
    reach: 0.1
  },
  includeTrends: true,
  taskId: 'custom-task-id',
});
```

### Frontend Integration

```tsx
import { VisibilityScoringResults } from "./components/visibility-scoring-results";

function MyComponent() {
	return (
		<VisibilityScoringResults
			taskId="my-task-id"
			onComplete={(results) => {
				console.log("Analysis completed:", results);
			}}
		/>
	);
}
```

## Data Structures

### Input Schema

```typescript
{
  brandName: string;           // Target brand name
  competitors: string[];       // Array of competitor names
  analysisResults: any[];      // Results from multi-provider analysis
  brandDetectionResults?: any[]; // Optional brand detection results
  historicalData?: any[];      // Optional historical data for trends
  scoringWeights?: {           // Optional custom weights
    mentions: number;
    sentiment: number;
    context: number;
    reach: number;
  };
  includeTrends?: boolean;     // Include trend analysis
  taskId?: string;             // For SSE progress tracking
}
```

### Output Schema

```typescript
{
  brandName: string;
  competitors: string[];
  brandScores: BrandScore[];
  competitivePositioning: CompetitivePositioning;
  shareOfVoice: ShareOfVoice;
  competitiveRankings: CompetitiveRanking[];
  trendAnalysis?: TrendAnalysis;
  insights: Insight;
  metadata: {
    scoringWeights: Record<string, number>;
    totalBrands: number;
    analysisTime: number;
    category: 'visibility-scoring';
  };
}
```

### Brand Score Structure

```typescript
interface BrandScore {
	brandName: string;
	visibilityScore: number; // 0-100 score
	mentionCount: number; // Number of mentions
	sentimentScore: number; // 0-100 sentiment score
	contextRelevance: number; // 0-100 context relevance
	reachScore: number; // 0-100 reach score
	confidence: number; // 0-1 confidence score
	breakdown: {
		mentions: number;
		sentiment: number;
		context: number;
		reach: number;
	};
}
```

## SSE Integration

### Progress Tracking

The tool integrates with the SSE infrastructure to provide real-time progress
updates:

1. **Task Creation**: Creates a task with initial status
2. **Progress Updates**: Updates progress at each analysis stage
3. **Completion**: Marks task as completed with results
4. **Error Handling**: Marks task as failed with error details

### Progress Stages

1. **Initializing** (0-10%): Setting up analysis
2. **Calculating brand scores** (10-30%): Computing visibility metrics
3. **Analyzing competitive positioning** (30-50%): Determining market position
4. **Calculating share of voice** (50-70%): Computing market share
5. **Generating competitive rankings** (70-85%): Creating rankings
6. **Analyzing trends and generating insights** (85-100%): Final analysis

## Testing

### Running Tests

```bash
# Run all visibility scoring tests
npx vitest run tests/visibility-scoring.test.ts

# Run with verbose output
npx vitest run tests/visibility-scoring.test.ts --reporter=verbose
```

### Test Coverage

The test suite covers:

- Basic functionality validation
- Custom scoring weights
- Trend analysis
- Error handling
- Data structure validation
- SSE integration

## Performance

### Benchmarks

- **Response Time**: <20 seconds for visibility scoring
- **Data Size**: Response payload <250 KB
- **Reliability**: >90% accuracy in scoring calculations
- **Concurrent Usage**: Support 20+ simultaneous executions

### Optimization

- Efficient scoring algorithms
- Minimal memory footprint
- Optimized data structures
- Caching for repeated calculations

## Error Handling

### Common Errors

1. **Invalid Input**: Missing required parameters
2. **Empty Results**: No analysis data available
3. **SSE Connection**: Connection failures
4. **Calculation Errors**: Algorithm failures

### Error Recovery

- Graceful degradation for missing data
- Automatic retry for SSE connections
- Fallback calculations for edge cases
- User-friendly error messages

## Integration Points

### Dependencies

- **GEO-204**: Brand Detection Tool (optional)
- **SSE Infrastructure**: Progress tracking
- **Multi-Provider Analysis**: Input data source

### Integration with Other Tools

- **Brand Monitor Agent**: Uses visibility scoring for competitive analysis
- **Competitive Intelligence Agent**: Incorporates visibility insights
- **Content Optimization Tool**: Uses visibility data for recommendations

## Future Enhancements

### Planned Features

1. **Advanced Trend Analysis**: More sophisticated trend prediction
2. **Industry-Specific Scoring**: Custom scoring for different industries
3. **Real-time Monitoring**: Continuous visibility tracking
4. **Advanced Visualizations**: Enhanced result displays
5. **API Integration**: External data source integration

### Scalability Improvements

1. **Distributed Processing**: Parallel analysis for large datasets
2. **Caching Layer**: Result caching for performance
3. **Database Integration**: Persistent storage for historical data
4. **Microservices**: Service decomposition for scalability

## Troubleshooting

### Common Issues

1. **Slow Performance**: Check analysis results size and complexity
2. **SSE Connection Issues**: Verify network connectivity and server status
3. **Inaccurate Scores**: Validate input data quality and scoring weights
4. **Memory Issues**: Monitor concurrent usage and data size

### Debugging

1. **Enable Logging**: Check console for detailed error messages
2. **Validate Input**: Ensure all required parameters are provided
3. **Test Incrementally**: Test with minimal data first
4. **Check Dependencies**: Verify all required tools are available

## Support

For issues and questions:

1. Check the test suite for examples
2. Review error messages in console
3. Validate input data structure
4. Test with known good data

## Changelog

### Version 1.0.0 (Current)

- Initial implementation
- SSE integration
- Basic scoring algorithm
- Frontend components
- Comprehensive test suite

