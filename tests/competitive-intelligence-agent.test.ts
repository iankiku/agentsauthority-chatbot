import { describe, expect, test } from 'vitest';
import { competitiveIntelligenceAgent } from '../lib/ai/tools/competitive-intelligence-agent';

describe('competitiveIntelligenceAgent', () => {
  const mockTargetCompany = {
    name: 'TechCorp',
    description: 'A leading technology company specializing in AI solutions',
    website: 'https://techcorp.com',
    industry: 'Technology',
    marketFocus: 'b2b' as const,
    companySize: 'enterprise' as const,
  };

  const mockMarketContext = {
    industry: 'Technology',
    geographicScope: 'global' as const,
    timeframe: 'current' as const,
    keyMetrics: ['market share', 'revenue growth', 'customer satisfaction'],
  };

  describe('basic functionality', () => {
    test('should perform comprehensive competitive intelligence analysis', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        marketContext: mockMarketContext,
        includeTrends: true,
        includeForecasting: false,
      });

      expect(result.targetCompany).toEqual(mockTargetCompany);
      expect(result.analysisType).toBe('comprehensive');
      expect(result.marketContext).toEqual(mockMarketContext);
      expect(result.metadata.success).toBe(true);
      expect(result.metadata.category).toBe('competitive-intelligence');
    });

    test('should handle strategic analysis type', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'strategic',
        includeTrends: false,
        includeForecasting: false,
      });

      expect(result.analysisType).toBe('strategic');
      expect(result.trendAnalysis).toBeNull();
      expect(result.forecasting).toBeNull();
      expect(result.metadata.success).toBe(true);
    });

    test('should handle tactical analysis type', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'tactical',
        includeTrends: true,
        includeForecasting: true,
      });

      expect(result.analysisType).toBe('tactical');
      expect(result.trendAnalysis).toBeDefined();
      expect(result.forecasting).toBeDefined();
      expect(result.metadata.success).toBe(true);
    });

    test('should handle market analysis type', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'market',
        includeTrends: false,
        includeForecasting: false,
      });

      expect(result.analysisType).toBe('market');
      expect(result.metadata.success).toBe(true);
    });

    test('should handle trends analysis type', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'trends',
        includeTrends: true,
        includeForecasting: false,
      });

      expect(result.analysisType).toBe('trends');
      expect(result.trendAnalysis).toBeDefined();
      expect(result.metadata.success).toBe(true);
    });
  });

  describe('competitor research', () => {
    test('should research competitors when not provided', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
      });

      expect(result.competitorResearch.competitors).toBeDefined();
      expect(result.competitorResearch.competitors.length).toBeGreaterThan(0);
      expect(result.competitorResearch.marketLandscape).toBeDefined();
      expect(
        result.competitorResearch.marketLandscape.totalMarketSize,
      ).toBeDefined();
      expect(
        result.competitorResearch.marketLandscape.growthRate,
      ).toBeDefined();
    });

    test('should research specific competitors when provided', async () => {
      const specificCompetitors = ['Competitor X', 'Competitor Y'];
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        competitors: specificCompetitors,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
      });

      expect(result.competitorResearch.competitors).toBeDefined();
      expect(result.competitorResearch.competitors.length).toBe(2);
      expect(result.competitorResearch.competitors[0].name).toBe(
        'Competitor X',
      );
      expect(result.competitorResearch.competitors[1].name).toBe(
        'Competitor Y',
      );
    });

    test('should include comprehensive competitor data', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
      });

      const competitor = result.competitorResearch.competitors[0];
      expect(competitor.name).toBeDefined();
      expect(competitor.description).toBeDefined();
      expect(competitor.website).toBeDefined();
      expect(competitor.industry).toBeDefined();
      expect(competitor.strengths).toBeDefined();
      expect(competitor.weaknesses).toBeDefined();
      expect(competitor.marketShare).toBeDefined();
      expect(competitor.revenue).toBeDefined();
      expect(competitor.employees).toBeDefined();
      expect(competitor.keyProducts).toBeDefined();
      expect(competitor.competitiveAdvantages).toBeDefined();
      expect(competitor.recentDevelopments).toBeDefined();
    });
  });

  describe('market analysis', () => {
    test('should perform comprehensive market analysis', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
      });

      expect(result.marketAnalysis).toBeDefined();
      expect(result.marketAnalysis.marketDynamics).toBeDefined();
      expect(result.marketAnalysis.competitiveLandscape).toBeDefined();
      expect(result.marketAnalysis.customerAnalysis).toBeDefined();
    });

    test('should analyze market dynamics', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'market',
        includeTrends: false,
        includeForecasting: false,
      });

      const dynamics = result.marketAnalysis.marketDynamics;
      expect(dynamics.drivers).toBeDefined();
      expect(dynamics.restraints).toBeDefined();
      expect(dynamics.opportunities).toBeDefined();
      expect(dynamics.threats).toBeDefined();
      expect(Array.isArray(dynamics.drivers)).toBe(true);
      expect(Array.isArray(dynamics.restraints)).toBe(true);
      expect(Array.isArray(dynamics.opportunities)).toBe(true);
      expect(Array.isArray(dynamics.threats)).toBe(true);
    });

    test('should analyze competitive landscape', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'market',
        includeTrends: false,
        includeForecasting: false,
      });

      const landscape = result.marketAnalysis.competitiveLandscape;
      expect(landscape.marketLeaders).toBeDefined();
      expect(landscape.emergingPlayers).toBeDefined();
      expect(landscape.nichePlayers).toBeDefined();
      expect(landscape.competitiveIntensity).toBeDefined();
      expect(['low', 'medium', 'high']).toContain(
        landscape.competitiveIntensity,
      );
    });

    test('should analyze customer segments', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'market',
        includeTrends: false,
        includeForecasting: false,
      });

      const customerAnalysis = result.marketAnalysis.customerAnalysis;
      expect(customerAnalysis.customerSegments).toBeDefined();
      expect(customerAnalysis.customerSatisfaction).toBeDefined();
      expect(Array.isArray(customerAnalysis.customerSegments)).toBe(true);
      expect(customerAnalysis.customerSatisfaction.overall).toBeDefined();
      expect(customerAnalysis.customerSatisfaction.bySegment).toBeDefined();
      expect(customerAnalysis.customerSatisfaction.keyFactors).toBeDefined();
    });
  });

  describe('strategy assessment', () => {
    test('should assess competitive strategies', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'strategic',
        includeTrends: false,
        includeForecasting: false,
      });

      expect(result.strategyAssessment).toBeDefined();
      expect(result.strategyAssessment.competitiveStrategies).toBeDefined();
      expect(result.strategyAssessment.strategicPositions).toBeDefined();
      expect(result.strategyAssessment.innovationAnalysis).toBeDefined();
    });

    test('should analyze competitive strategies', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'strategic',
        includeTrends: false,
        includeForecasting: false,
      });

      const strategies = result.strategyAssessment.competitiveStrategies;
      expect(Array.isArray(strategies)).toBe(true);
      expect(strategies.length).toBeGreaterThan(0);

      const strategy = strategies[0];
      expect(strategy.competitor).toBeDefined();
      expect(strategy.strategy).toBeDefined();
      expect(strategy.description).toBeDefined();
      expect(strategy.strengths).toBeDefined();
      expect(strategy.weaknesses).toBeDefined();
      expect(strategy.effectiveness).toBeDefined();
      expect(strategy.effectiveness).toBeGreaterThanOrEqual(0);
      expect(strategy.effectiveness).toBeLessThanOrEqual(100);
    });

    test('should analyze strategic positions', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'strategic',
        includeTrends: false,
        includeForecasting: false,
      });

      const positions = result.strategyAssessment.strategicPositions;
      expect(Array.isArray(positions)).toBe(true);
      expect(positions.length).toBeGreaterThan(0);

      const position = positions[0];
      expect(position.competitor).toBeDefined();
      expect(position.position).toBeDefined();
      expect(position.differentiation).toBeDefined();
      expect(position.valueProposition).toBeDefined();
      expect(Array.isArray(position.differentiation)).toBe(true);
    });

    test('should analyze innovation', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'strategic',
        includeTrends: false,
        includeForecasting: false,
      });

      const innovation = result.strategyAssessment.innovationAnalysis;
      expect(innovation.innovationLeaders).toBeDefined();
      expect(innovation.innovationAreas).toBeDefined();
      expect(innovation.innovationGaps).toBeDefined();
      expect(Array.isArray(innovation.innovationLeaders)).toBe(true);
      expect(Array.isArray(innovation.innovationAreas)).toBe(true);
      expect(Array.isArray(innovation.innovationGaps)).toBe(true);
    });
  });

  describe('competitive positioning', () => {
    test('should analyze competitive positioning', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
      });

      expect(result.competitivePositioning).toBeDefined();
      expect(result.competitivePositioning.positioningMap).toBeDefined();
      expect(result.competitivePositioning.competitiveAdvantages).toBeDefined();
      expect(result.competitivePositioning.marketGaps).toBeDefined();
    });

    test('should create positioning map', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
      });

      const positioningMap = result.competitivePositioning.positioningMap;
      expect(Array.isArray(positioningMap)).toBe(true);
      expect(positioningMap.length).toBeGreaterThan(0);

      const position = positioningMap[0];
      expect(position.company).toBeDefined();
      expect(position.price).toBeDefined();
      expect(position.quality).toBeDefined();
      expect(position.features).toBeDefined();
      expect(position.marketShare).toBeDefined();
      expect(position.price).toBeGreaterThanOrEqual(0);
      expect(position.price).toBeLessThanOrEqual(100);
      expect(position.quality).toBeGreaterThanOrEqual(0);
      expect(position.quality).toBeLessThanOrEqual(100);
      expect(position.features).toBeGreaterThanOrEqual(0);
      expect(position.features).toBeLessThanOrEqual(100);
      expect(position.marketShare).toBeGreaterThanOrEqual(0);
      expect(position.marketShare).toBeLessThanOrEqual(100);
    });

    test('should analyze competitive advantages', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
      });

      const advantages = result.competitivePositioning.competitiveAdvantages;
      expect(Array.isArray(advantages)).toBe(true);
      expect(advantages.length).toBeGreaterThan(0);

      const advantage = advantages[0];
      expect(advantage.company).toBeDefined();
      expect(advantage.advantages).toBeDefined();
      expect(advantage.sustainability).toBeDefined();
      expect(Array.isArray(advantage.advantages)).toBe(true);
      expect(advantage.sustainability).toBeGreaterThanOrEqual(0);
      expect(advantage.sustainability).toBeLessThanOrEqual(100);
    });

    test('should identify market gaps', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
      });

      const marketGaps = result.competitivePositioning.marketGaps;
      expect(Array.isArray(marketGaps)).toBe(true);
      expect(marketGaps.length).toBeGreaterThan(0);

      const gap = marketGaps[0];
      expect(gap.segment).toBeDefined();
      expect(gap.description).toBeDefined();
      expect(gap.opportunity).toBeDefined();
      expect(gap.barriers).toBeDefined();
      expect(Array.isArray(gap.barriers)).toBe(true);
      expect(gap.opportunity).toBeGreaterThanOrEqual(0);
      expect(gap.opportunity).toBeLessThanOrEqual(10);
    });
  });

  describe('trend analysis', () => {
    test('should perform trend analysis when enabled', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'trends',
        includeTrends: true,
        includeForecasting: false,
      });

      expect(result.trendAnalysis).toBeDefined();
      expect(result.trendAnalysis.marketTrends).toBeDefined();
      expect(result.trendAnalysis.technologyTrends).toBeDefined();
      expect(result.trendAnalysis.consumerTrends).toBeDefined();
    });

    test('should not perform trend analysis when disabled', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
      });

      expect(result.trendAnalysis).toBeNull();
    });

    test('should analyze market trends', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'trends',
        includeTrends: true,
        includeForecasting: false,
      });

      const marketTrends = result.trendAnalysis.marketTrends;
      expect(Array.isArray(marketTrends)).toBe(true);
      expect(marketTrends.length).toBeGreaterThan(0);

      const trend = marketTrends[0];
      expect(trend.trend).toBeDefined();
      expect(trend.description).toBeDefined();
      expect(trend.impact).toBeDefined();
      expect(trend.timeframe).toBeDefined();
      expect(trend.confidence).toBeDefined();
      expect(['positive', 'negative', 'neutral']).toContain(trend.impact);
      expect(trend.confidence).toBeGreaterThanOrEqual(0);
      expect(trend.confidence).toBeLessThanOrEqual(1);
    });

    test('should analyze technology trends', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'trends',
        includeTrends: true,
        includeForecasting: false,
      });

      const technologyTrends = result.trendAnalysis.technologyTrends;
      expect(Array.isArray(technologyTrends)).toBe(true);
      expect(technologyTrends.length).toBeGreaterThan(0);

      const trend = technologyTrends[0];
      expect(trend.technology).toBeDefined();
      expect(trend.adoption).toBeDefined();
      expect(trend.impact).toBeDefined();
      expect(trend.timeframe).toBeDefined();
      expect(trend.adoption).toBeGreaterThanOrEqual(0);
      expect(trend.adoption).toBeLessThanOrEqual(100);
    });

    test('should analyze consumer trends', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'trends',
        includeTrends: true,
        includeForecasting: false,
      });

      const consumerTrends = result.trendAnalysis.consumerTrends;
      expect(Array.isArray(consumerTrends)).toBe(true);
      expect(consumerTrends.length).toBeGreaterThan(0);

      const trend = consumerTrends[0];
      expect(trend.trend).toBeDefined();
      expect(trend.description).toBeDefined();
      expect(trend.impact).toBeDefined();
      expect(trend.timeframe).toBeDefined();
    });
  });

  describe('forecasting', () => {
    test('should perform forecasting when enabled', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: true,
        includeForecasting: true,
      });

      expect(result.forecasting).toBeDefined();
      expect(result.forecasting.marketForecast).toBeDefined();
      expect(result.forecasting.competitiveForecast).toBeDefined();
    });

    test('should not perform forecasting when disabled', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: true,
        includeForecasting: false,
      });

      expect(result.forecasting).toBeNull();
    });

    test('should generate market forecasts', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: true,
        includeForecasting: true,
      });

      const marketForecast = result.forecasting.marketForecast;
      expect(marketForecast.shortTerm).toBeDefined();
      expect(marketForecast.longTerm).toBeDefined();
      expect(Array.isArray(marketForecast.shortTerm)).toBe(true);
      expect(Array.isArray(marketForecast.longTerm)).toBe(true);

      const shortTermForecast = marketForecast.shortTerm[0];
      expect(shortTermForecast.period).toBeDefined();
      expect(shortTermForecast.prediction).toBeDefined();
      expect(shortTermForecast.confidence).toBeDefined();
      expect(shortTermForecast.confidence).toBeGreaterThanOrEqual(0);
      expect(shortTermForecast.confidence).toBeLessThanOrEqual(1);
    });

    test('should generate competitive forecasts', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: true,
        includeForecasting: true,
      });

      const competitiveForecast = result.forecasting.competitiveForecast;
      expect(Array.isArray(competitiveForecast)).toBe(true);
      expect(competitiveForecast.length).toBeGreaterThan(0);

      const forecast = competitiveForecast[0];
      expect(forecast.competitor).toBeDefined();
      expect(forecast.prediction).toBeDefined();
      expect(forecast.timeframe).toBeDefined();
      expect(forecast.confidence).toBeDefined();
      expect(forecast.confidence).toBeGreaterThanOrEqual(0);
      expect(forecast.confidence).toBeLessThanOrEqual(100);
    });
  });

  describe('custom analysis', () => {
    test('should perform custom analysis when provided', async () => {
      const customAnalysis = ['pricing analysis', 'distribution analysis'];
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
        customAnalysis,
      });

      expect(result.customAnalysisResults).toBeDefined();
      expect(Array.isArray(result.customAnalysisResults)).toBe(true);
      expect(result.customAnalysisResults.length).toBe(2);
      expect(result.metadata.customAnalysisCount).toBe(2);
    });

    test('should not perform custom analysis when not provided', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
      });

      expect(result.customAnalysisResults).toBeNull();
      expect(result.metadata.customAnalysisCount).toBe(0);
    });

    test('should include custom analysis results', async () => {
      const customAnalysis = ['pricing analysis'];
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
        customAnalysis,
      });

      const customResult = result.customAnalysisResults[0];
      expect(customResult.analysis).toBe('pricing analysis');
      expect(customResult.results).toBeDefined();
      expect(customResult.insights).toBeDefined();
      expect(customResult.recommendations).toBeDefined();
      expect(Array.isArray(customResult.insights)).toBe(true);
      expect(Array.isArray(customResult.recommendations)).toBe(true);
    });
  });

  describe('summary generation', () => {
    test('should generate comprehensive summary', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: true,
        includeForecasting: true,
      });

      expect(result.summary).toBeDefined();
      expect(result.summary.totalCompetitors).toBeDefined();
      expect(result.summary.analysisDepth).toBeDefined();
      expect(result.summary.keyInsights).toBeDefined();
      expect(result.summary.recommendations).toBeDefined();
      expect(result.summary.riskAssessment).toBeDefined();
      expect(result.summary.opportunityAnalysis).toBeDefined();
    });

    test('should include key insights', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
      });

      const insights = result.summary.keyInsights;
      expect(Array.isArray(insights)).toBe(true);
      expect(insights.length).toBeGreaterThan(0);
      expect(typeof insights[0]).toBe('string');
    });

    test('should include recommendations', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
      });

      const recommendations = result.summary.recommendations;
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);

      const recommendation = recommendations[0];
      expect(recommendation.category).toBeDefined();
      expect(recommendation.recommendation).toBeDefined();
      expect(recommendation.priority).toBeDefined();
      expect(recommendation.impact).toBeDefined();
      expect(recommendation.effort).toBeDefined();
      expect(['low', 'medium', 'high']).toContain(recommendation.priority);
      expect(recommendation.impact).toBeGreaterThanOrEqual(0);
      expect(recommendation.impact).toBeLessThanOrEqual(10);
      expect(recommendation.effort).toBeGreaterThanOrEqual(0);
      expect(recommendation.effort).toBeLessThanOrEqual(10);
    });

    test('should include risk assessment', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
      });

      const risks = result.summary.riskAssessment;
      expect(Array.isArray(risks)).toBe(true);
      expect(risks.length).toBeGreaterThan(0);

      const risk = risks[0];
      expect(risk.risk).toBeDefined();
      expect(risk.probability).toBeDefined();
      expect(risk.impact).toBeDefined();
      expect(risk.mitigation).toBeDefined();
      expect(risk.probability).toBeGreaterThanOrEqual(0);
      expect(risk.probability).toBeLessThanOrEqual(1);
      expect(risk.impact).toBeGreaterThanOrEqual(0);
      expect(risk.impact).toBeLessThanOrEqual(10);
    });

    test('should include opportunity analysis', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: false,
        includeForecasting: false,
      });

      const opportunities = result.summary.opportunityAnalysis;
      expect(Array.isArray(opportunities)).toBe(true);
      expect(opportunities.length).toBeGreaterThan(0);

      const opportunity = opportunities[0];
      expect(opportunity.opportunity).toBeDefined();
      expect(opportunity.potential).toBeDefined();
      expect(opportunity.timeframe).toBeDefined();
      expect(opportunity.requirements).toBeDefined();
      expect(opportunity.potential).toBeGreaterThanOrEqual(0);
      expect(opportunity.potential).toBeLessThanOrEqual(10);
      expect(Array.isArray(opportunity.requirements)).toBe(true);
    });
  });

  describe('error handling', () => {
    test('should handle invalid target company', async () => {
      await expect(
        competitiveIntelligenceAgent.execute({
          targetCompany: {
            name: '',
            description: 'Invalid company',
            website: 'https://example.com',
          },
          analysisType: 'comprehensive',
          includeTrends: false,
          includeForecasting: false,
        }),
      ).rejects.toThrow();
    });

    test('should handle invalid website URL', async () => {
      await expect(
        competitiveIntelligenceAgent.execute({
          targetCompany: {
            name: 'Test Company',
            description: 'A test company',
            website: 'invalid-url',
          },
          analysisType: 'comprehensive',
          includeTrends: false,
          includeForecasting: false,
        }),
      ).rejects.toThrow();
    });

    test('should handle empty competitors array', async () => {
      await expect(
        competitiveIntelligenceAgent.execute({
          targetCompany: mockTargetCompany,
          competitors: [],
          analysisType: 'comprehensive',
          includeTrends: false,
          includeForecasting: false,
        }),
      ).rejects.toThrow();
    });

    test('should handle too many competitors', async () => {
      const tooManyCompetitors = Array.from(
        { length: 25 },
        (_, i) => `Competitor ${i}`,
      );
      await expect(
        competitiveIntelligenceAgent.execute({
          targetCompany: mockTargetCompany,
          competitors: tooManyCompetitors,
          analysisType: 'comprehensive',
          includeTrends: false,
          includeForecasting: false,
        }),
      ).rejects.toThrow();
    });
  });

  describe('metadata', () => {
    test('should include correct metadata', async () => {
      const result = await competitiveIntelligenceAgent.execute({
        targetCompany: mockTargetCompany,
        analysisType: 'comprehensive',
        includeTrends: true,
        includeForecasting: true,
        customAnalysis: ['test analysis'],
      });

      expect(result.metadata).toBeDefined();
      expect(result.metadata.executionTime).toBeDefined();
      expect(result.metadata.category).toBe('competitive-intelligence');
      expect(result.metadata.analysisType).toBe('comprehensive');
      expect(result.metadata.includeTrends).toBe(true);
      expect(result.metadata.includeForecasting).toBe(true);
      expect(result.metadata.customAnalysisCount).toBe(1);
      expect(result.metadata.success).toBe(true);
      expect(typeof result.metadata.executionTime).toBe('number');
    });
  });
});
