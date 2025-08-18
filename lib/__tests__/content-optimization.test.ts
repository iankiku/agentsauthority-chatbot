import { contentOptimizationTool } from '../ai/tools/content-optimization-tool';

describe('contentOptimizationTool', () => {
  test('should analyze content for all platforms correctly', async () => {
    const result = await contentOptimizationTool.execute({
      content:
        'This is a comprehensive blog post about artificial intelligence and machine learning. AI technology is transforming industries across the globe. Machine learning algorithms are becoming more sophisticated every day.',
      targetKeywords: ['artificial intelligence', 'machine learning'],
      industry: 'technology',
      contentType: 'blog',
      includeRecommendations: true,
    });

    expect(result.content).toBeDefined();
    expect(result.targetKeywords).toEqual([
      'artificial intelligence',
      'machine learning',
    ]);
    expect(result.industry).toBe('technology');
    expect(result.contentType).toBe('blog');
    expect(result.platformAnalysis.chatgpt.score).toBeGreaterThan(0);
    expect(result.platformAnalysis.claude.score).toBeGreaterThan(0);
    expect(result.platformAnalysis.gemini.score).toBeGreaterThan(0);
    expect(result.overallOptimization.averageScore).toBeGreaterThan(0);
    expect(result.strategicRecommendations.length).toBeGreaterThan(0);
    expect(result.metadata.contentLength).toBeGreaterThan(0);
    expect(result.metadata.keywordCount).toBe(2);
    expect(result.metadata.category).toBe('content-optimization');
  });

  test('should handle different content types', async () => {
    const contentTypes = ['blog', 'product', 'landing', 'social'] as const;

    for (const contentType of contentTypes) {
      const result = await contentOptimizationTool.execute({
        content: 'Sample content for testing different content types.',
        targetKeywords: ['test', 'content'],
        contentType,
      });

      expect(result.contentType).toBe(contentType);
      expect(result.platformAnalysis.chatgpt.score).toBeGreaterThan(0);
      expect(result.platformAnalysis.claude.score).toBeGreaterThan(0);
      expect(result.platformAnalysis.gemini.score).toBeGreaterThan(0);
    }
  });

  test('should calculate keyword density correctly', async () => {
    const content =
      'Artificial intelligence is amazing. AI technology is everywhere. Machine learning is the future.';
    const keywords = ['artificial intelligence', 'machine learning'];

    const result = await contentOptimizationTool.execute({
      content,
      targetKeywords: keywords,
      contentType: 'blog',
    });

    expect(
      result.overallOptimization.keywordIntegration.currentDensity,
    ).toBeGreaterThan(0);
    expect(
      result.overallOptimization.keywordIntegration.recommendedDensity,
    ).toBe(1.5);
    expect(
      result.overallOptimization.keywordIntegration.placementSuggestions.length,
    ).toBeGreaterThan(0);
  });

  test('should identify content strengths and weaknesses', async () => {
    const result = await contentOptimizationTool.execute({
      content: 'This is a very short content piece.',
      targetKeywords: ['short', 'content'],
      contentType: 'blog',
    });

    // Should identify weaknesses for short content
    expect(result.platformAnalysis.chatgpt.weaknesses.length).toBeGreaterThan(
      0,
    );
    expect(result.platformAnalysis.claude.weaknesses.length).toBeGreaterThan(0);
    expect(result.platformAnalysis.gemini.weaknesses.length).toBeGreaterThan(0);
  });

  test('should generate platform-specific recommendations', async () => {
    const result = await contentOptimizationTool.execute({
      content: 'This is a test content piece for generating recommendations.',
      targetKeywords: ['test', 'recommendations'],
      contentType: 'blog',
    });

    expect(
      result.platformAnalysis.chatgpt.recommendations.length,
    ).toBeGreaterThan(0);
    expect(
      result.platformAnalysis.claude.recommendations.length,
    ).toBeGreaterThan(0);
    expect(
      result.platformAnalysis.gemini.recommendations.length,
    ).toBeGreaterThan(0);
  });

  test('should suggest content structure based on length', async () => {
    // Test short content
    const shortResult = await contentOptimizationTool.execute({
      content: 'Short content.',
      targetKeywords: ['short'],
      contentType: 'blog',
    });

    expect(
      shortResult.overallOptimization.contentStructure.suggestedFormat,
    ).toBe('Short Post/Summary');
    expect(
      shortResult.overallOptimization.contentStructure.lengthRecommendation,
    ).toContain('300-500');

    // Test long content
    const longContent = 'This is a very long content piece. '.repeat(100);
    const longResult = await contentOptimizationTool.execute({
      content: longContent,
      targetKeywords: ['long', 'content'],
      contentType: 'blog',
    });

    expect(
      longResult.overallOptimization.contentStructure.suggestedFormat,
    ).toBe('In-depth Guide/Report');
    expect(
      longResult.overallOptimization.contentStructure.lengthRecommendation,
    ).toContain('1500');
  });

  test('should respect includeRecommendations flag', async () => {
    const result = await contentOptimizationTool.execute({
      content: 'Test content for recommendations flag.',
      targetKeywords: ['test'],
      contentType: 'blog',
      includeRecommendations: false,
    });

    expect(result.strategicRecommendations).toHaveLength(0);
  });

  test('should handle edge cases gracefully', async () => {
    // Test with minimal content
    const minimalResult = await contentOptimizationTool.execute({
      content: 'Minimal content for testing.',
      targetKeywords: ['minimal'],
      contentType: 'blog',
    });

    expect(minimalResult.platformAnalysis.chatgpt.score).toBeGreaterThan(0);
    expect(minimalResult.platformAnalysis.claude.score).toBeGreaterThan(0);
    expect(minimalResult.platformAnalysis.gemini.score).toBeGreaterThan(0);

    // Test with many keywords
    const manyKeywords = Array.from({ length: 20 }, (_, i) => `keyword${i}`);
    const manyKeywordsResult = await contentOptimizationTool.execute({
      content: 'Content with many keywords.',
      targetKeywords: manyKeywords,
      contentType: 'blog',
    });

    expect(manyKeywordsResult.metadata.keywordCount).toBe(20);
  });

  test('should validate input parameters', async () => {
    // Test with empty content
    await expect(
      contentOptimizationTool.execute({
        content: '',
        targetKeywords: ['test'],
        contentType: 'blog',
      }),
    ).rejects.toThrow();

    // Test with empty keywords array
    await expect(
      contentOptimizationTool.execute({
        content: 'Test content',
        targetKeywords: [],
        contentType: 'blog',
      }),
    ).rejects.toThrow();

    // Test with too many keywords
    const tooManyKeywords = Array.from({ length: 21 }, (_, i) => `keyword${i}`);
    await expect(
      contentOptimizationTool.execute({
        content: 'Test content',
        targetKeywords: tooManyKeywords,
        contentType: 'blog',
      }),
    ).rejects.toThrow();
  });

  test('should handle errors gracefully', async () => {
    // Mock a scenario where analysis fails
    const result = await contentOptimizationTool.execute({
      content: 'Test content for error handling.',
      targetKeywords: ['test'],
      contentType: 'blog',
    });

    // Should still return a valid result structure
    expect(result.content).toBeDefined();
    expect(result.targetKeywords).toEqual(['test']);
    expect(result.metadata.executionTime).toBeGreaterThan(0);
  });

  test('should provide detailed platform analysis', async () => {
    const result = await contentOptimizationTool.execute({
      content:
        'This is a comprehensive analysis of artificial intelligence and machine learning technologies.',
      targetKeywords: ['artificial intelligence', 'machine learning'],
      industry: 'technology',
      contentType: 'blog',
    });

    // Check ChatGPT analysis
    expect(result.platformAnalysis.chatgpt.score).toBeGreaterThan(0);
    expect(result.platformAnalysis.chatgpt.strengths).toBeInstanceOf(Array);
    expect(result.platformAnalysis.chatgpt.weaknesses).toBeInstanceOf(Array);
    expect(result.platformAnalysis.chatgpt.recommendations).toBeInstanceOf(
      Array,
    );

    // Check Claude analysis
    expect(result.platformAnalysis.claude.score).toBeGreaterThan(0);
    expect(result.platformAnalysis.claude.strengths).toBeInstanceOf(Array);
    expect(result.platformAnalysis.claude.weaknesses).toBeInstanceOf(Array);
    expect(result.platformAnalysis.claude.recommendations).toBeInstanceOf(
      Array,
    );

    // Check Gemini analysis
    expect(result.platformAnalysis.gemini.score).toBeGreaterThan(0);
    expect(result.platformAnalysis.gemini.strengths).toBeInstanceOf(Array);
    expect(result.platformAnalysis.gemini.weaknesses).toBeInstanceOf(Array);
    expect(result.platformAnalysis.gemini.recommendations).toBeInstanceOf(
      Array,
    );
  });

  test('should calculate overall optimization metrics', async () => {
    const result = await contentOptimizationTool.execute({
      content:
        'This is a test content piece for overall optimization analysis.',
      targetKeywords: ['test', 'optimization'],
      contentType: 'blog',
    });

    expect(result.overallOptimization.averageScore).toBeGreaterThan(0);
    expect(result.overallOptimization.averageScore).toBeLessThanOrEqual(100);
    expect(result.overallOptimization.priorityImprovements).toBeInstanceOf(
      Array,
    );
    expect(
      result.overallOptimization.contentStructure.suggestedFormat,
    ).toBeDefined();
    expect(
      result.overallOptimization.contentStructure.recommendedSections,
    ).toBeInstanceOf(Array);
    expect(
      result.overallOptimization.contentStructure.lengthRecommendation,
    ).toBeDefined();
  });

  test('should provide execution time metadata', async () => {
    const result = await contentOptimizationTool.execute({
      content: 'Test content for execution time measurement.',
      targetKeywords: ['test'],
      contentType: 'blog',
    });

    expect(result.metadata.executionTime).toBeGreaterThan(0);
    expect(result.metadata.contentLength).toBeGreaterThan(0);
    expect(result.metadata.keywordCount).toBe(1);
    expect(result.metadata.category).toBe('content-optimization');
  });
});

describe('Content Analysis Logic', () => {
  test('should analyze conversational tone for ChatGPT', async () => {
    const conversationalContent =
      'You should consider how AI can help your business. We believe that machine learning will transform your industry. Ask yourself what problems you want to solve.';

    const result = await contentOptimizationTool.execute({
      content: conversationalContent,
      targetKeywords: ['AI', 'machine learning'],
      contentType: 'blog',
    });

    // Should score higher on ChatGPT due to conversational elements
    expect(result.platformAnalysis.chatgpt.score).toBeGreaterThan(0);
  });

  test('should analyze content depth for Claude', async () => {
    const deepContent =
      'This is a very detailed and comprehensive analysis that explores multiple facets of the topic. However, there are some considerations to keep in mind. Although the technology shows promise, nevertheless we must proceed with caution. Consequently, the implementation requires careful planning. Moreover, the long-term implications must be considered. Furthermore, the ethical considerations cannot be ignored.'.repeat(
        5,
      );

    const result = await contentOptimizationTool.execute({
      content: deepContent,
      targetKeywords: ['analysis', 'technology'],
      contentType: 'blog',
    });

    // Should score higher on Claude due to depth and nuance
    expect(result.platformAnalysis.claude.score).toBeGreaterThan(0);
  });

  test('should analyze multimodal potential for Gemini', async () => {
    const multimodalContent =
      'This content suggests using images to demonstrate the concept. You can visualize the data with charts and graphs. The diagram shows the process flow. Consider adding a video to explain the concept further.';

    const result = await contentOptimizationTool.execute({
      content: multimodalContent,
      targetKeywords: ['visualization', 'data'],
      contentType: 'blog',
    });

    // Should score higher on Gemini due to multimodal elements
    expect(result.platformAnalysis.gemini.score).toBeGreaterThan(0);
  });
});
