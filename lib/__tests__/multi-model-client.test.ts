import { MultiModelClient } from '../data-sources/multi-model-client';
import {
  analyzeSentiment,
  calculateAverageSentiment,
  calculateVisibilityScore,
  countBrandMentions,
  extractContext,
} from '../data-sources/utils';

describe('MultiModelClient', () => {
  let client: MultiModelClient;

  beforeEach(() => {
    client = new MultiModelClient();
  });

  describe('queryAllModels', () => {
    test('should query all models in parallel', async () => {
      const brandName = 'Tesla';
      const queries = ['What do you think about Tesla?'];

      const results = await client.queryAllModels(brandName, queries);

      expect(results).toHaveLength(3); // gpt-4, claude, gemini
      expect(results.every((r) => r.model)).toBe(true);
      expect(results.every((r) => typeof r.execution_time === 'number')).toBe(
        true,
      );
    });

    test('should handle individual model failures gracefully', async () => {
      // This test would require mocking API failures
      const brandName = 'TestBrand';
      const queries = ['Test query'];

      const results = await client.queryAllModels(brandName, queries);

      // Should still return results for all models, even if some fail
      expect(results).toHaveLength(3);
    });
  });

  describe('analyzeBrand', () => {
    test('should perform complete brand analysis', async () => {
      const request = {
        brandName: 'Apple',
        queries: ['What is Apple known for?', 'How is Apple performing?'],
      };

      const response = await client.analyzeBrand(request);

      expect(response.results).toHaveLength(3);
      expect(response.total_mentions).toBeGreaterThanOrEqual(0);
      expect(response.average_visibility_score).toBeGreaterThanOrEqual(0);
      expect(response.average_visibility_score).toBeLessThanOrEqual(100);
      expect(response.success_rate).toBeGreaterThanOrEqual(0);
      expect(response.success_rate).toBeLessThanOrEqual(100);
    });
  });

  describe('model availability', () => {
    test('should return available models', () => {
      const models = client.getAvailableModels();
      expect(models).toContain('gpt-4');
      expect(models).toContain('claude');
      expect(models).toContain('gemini');
    });

    test('should check model availability', () => {
      expect(client.isModelAvailable('gpt-4')).toBe(true);
      expect(client.isModelAvailable('claude')).toBe(true);
      expect(client.isModelAvailable('gemini')).toBe(true);
      expect(client.isModelAvailable('unknown-model')).toBe(false);
    });
  });
});

describe('Utility Functions', () => {
  describe('countBrandMentions', () => {
    test('should count brand mentions correctly', () => {
      const text = 'Tesla is amazing. Tesla cars are great.';
      const count = countBrandMentions(text, 'Tesla');
      expect(count).toBe(2);
    });

    test('should handle case insensitive matching', () => {
      const text = 'TESLA is amazing. tesla cars are great.';
      const count = countBrandMentions(text, 'Tesla');
      expect(count).toBe(2);
    });

    test('should return 0 for no mentions', () => {
      const text = 'This text has no brand mentions.';
      const count = countBrandMentions(text, 'Tesla');
      expect(count).toBe(0);
    });
  });

  describe('analyzeSentiment', () => {
    test('should identify positive sentiment', () => {
      const text = 'Tesla is excellent and innovative.';
      const sentiment = analyzeSentiment(text, 'Tesla');
      expect(sentiment).toBe('positive');
    });

    test('should identify negative sentiment', () => {
      const text = 'Tesla is terrible and failing.';
      const sentiment = analyzeSentiment(text, 'Tesla');
      expect(sentiment).toBe('negative');
    });

    test('should identify neutral sentiment', () => {
      const text = 'Tesla is a company.';
      const sentiment = analyzeSentiment(text, 'Tesla');
      expect(sentiment).toBe('neutral');
    });
  });

  describe('calculateVisibilityScore', () => {
    test('should calculate score between 0-100', () => {
      const text = 'Tesla is excellent and innovative in the market.';
      const score = calculateVisibilityScore(text, 'Tesla');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    test('should return 0 for no brand mention', () => {
      const text = 'This text has no brand mentions.';
      const score = calculateVisibilityScore(text, 'Tesla');
      expect(score).toBe(0);
    });
  });

  describe('extractContext', () => {
    test('should extract sentences with brand mentions', () => {
      const text =
        'Tesla is great. This is another sentence. Tesla cars are amazing.';
      const context = extractContext(text, 'Tesla');
      expect(context).toHaveLength(2);
      expect(context[0]).toContain('Tesla');
      expect(context[1]).toContain('Tesla');
    });
  });

  describe('calculateAverageSentiment', () => {
    test('should calculate average sentiment correctly', () => {
      const sentiments = ['positive', 'positive', 'neutral'];
      const average = calculateAverageSentiment(sentiments);
      expect(average).toBe('positive');
    });

    test('should return neutral for empty array', () => {
      const average = calculateAverageSentiment([]);
      expect(average).toBe('neutral');
    });
  });
});
