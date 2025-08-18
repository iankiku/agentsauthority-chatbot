export interface DemoScript {
  introduction: DemoSection;
  scenario1_multiModel: DemoScenario;
  scenario2_webMonitoring: DemoScenario;
  scenario3_competitiveIntelligence: DemoScenario;
  scenario4_contentOptimization: DemoScenario;
  conclusion: DemoSection;
}

export interface DemoSection {
  duration: number; // seconds
  talking_points: string[];
}

export interface DemoScenario extends DemoSection {
  user_query: string;
  expected_results: {
    [key: string]: any;
  };
  key_highlights: string[];
  potential_questions: string[];
  fallback_plan: string;
}

export const demoScript: DemoScript = {
  introduction: {
    duration: 30, // seconds
    talking_points: [
      'Brand visibility in the AI era is complex and fragmented across multiple platforms',
      'Current tools require manual checking across ChatGPT, Claude, Gemini, and web sources',
      'Our solution provides real-time, comprehensive analysis through natural conversation',
      'Professional business intelligence created instantly with persistent artifacts',
    ],
  },

  scenario1_multiModel: {
    duration: 120, // seconds
    user_query: 'Show my Tesla brand visibility across AI models',
    talking_points: [
      'Watch as we query ChatGPT, Claude, and Gemini simultaneously',
      'Real-time analysis provides comprehensive visibility matrix',
      'Professional visualization suitable for executive presentations',
      'Actionable insights with platform-specific recommendations',
      'Notice the overall score and individual platform breakdown',
    ],
    expected_results: {
      overall_score: { min: 60, max: 90 },
      model_count: 3,
      insights_count: { min: 3, max: 6 },
      recommendations_count: { min: 2, max: 5 },
    },
    key_highlights: [
      'Multi-model parallel processing',
      'Professional visualization',
      'Actionable recommendations',
      'Executive-ready insights',
    ],
    potential_questions: [
      'How accurate are the visibility scores?',
      'Can we analyze other brands?',
      'What data sources are used?',
      'How often is this updated?',
    ],
    fallback_plan:
      'Use pre-prepared Tesla visibility data with realistic scores and insights',
  },

  scenario2_webMonitoring: {
    duration: 90, // seconds
    user_query: 'Monitor Apple brand mentions this week',
    talking_points: [
      'Real-time web scraping across Reddit, HackerNews, and Twitter',
      'Comprehensive sentiment analysis with trending topic identification',
      'Source breakdown shows where conversations are happening',
      'Credibility scoring ensures data quality',
      'Trending topics reveal current brand perception',
    ],
    expected_results: {
      total_mentions: { min: 10, max: 100 },
      sentiment_distribution: 'mixed',
      trending_topics: { min: 3, max: 8 },
      sources: ['reddit', 'hackernews', 'twitter'],
      credibility_score: { min: 70, max: 95 },
    },
    key_highlights: [
      'Real-time web scraping',
      'Sentiment analysis',
      'Trending topics',
      'Credibility scoring',
    ],
    potential_questions: [
      'How recent is this data?',
      'Can we monitor multiple brands?',
      'What about other social platforms?',
      'How do you handle fake news?',
    ],
    fallback_plan:
      'Use pre-prepared Apple monitoring data with realistic mention counts and sentiment',
  },

  scenario3_competitiveIntelligence: {
    duration: 90, // seconds
    user_query:
      'Analyze competitive position of Nike vs Adidas and Under Armour',
    talking_points: [
      'Comprehensive competitive analysis across multiple brands',
      'Market positioning and share of voice calculation',
      'Competitive gaps identification for strategic planning',
      'Strategic recommendations for market advantage',
      'Professional competitive intelligence in seconds',
    ],
    expected_results: {
      primary_brand: 'Nike',
      competitor_count: 2,
      market_position: 'leader',
      share_of_voice: { min: 30, max: 60 },
      competitive_gaps: { min: 2, max: 5 },
      recommendations: { min: 2, max: 5 },
    },
    key_highlights: [
      'Multi-brand comparison',
      'Market positioning',
      'Share of voice analysis',
      'Strategic recommendations',
    ],
    potential_questions: [
      'How do you calculate market position?',
      'Can we analyze different industries?',
      'What data sources are used?',
      'How often should this be updated?',
    ],
    fallback_plan:
      'Use pre-prepared competitive analysis with realistic market positions and insights',
  },

  scenario4_contentOptimization: {
    duration: 60, // seconds
    user_query:
      'Optimize this content for AI platforms: "Our AI-powered solution helps businesses improve their GEO performance through intelligent analysis and actionable insights."',
    talking_points: [
      'AI-powered content optimization for multiple platforms',
      'Platform-specific recommendations for ChatGPT, Claude, and Gemini',
      'Keyword integration and content structure suggestions',
      'Professional content strategy in seconds',
      'Actionable optimization recommendations',
    ],
    expected_results: {
      platform_analysis: 3,
      overall_score: { min: 60, max: 85 },
      recommendations: { min: 3, max: 8 },
      content_structure: 'defined',
      keyword_integration: 'analyzed',
    },
    key_highlights: [
      'Multi-platform optimization',
      'AI-powered analysis',
      'Content structure recommendations',
      'Keyword integration',
    ],
    potential_questions: [
      'How accurate are the optimization scores?',
      'Can we optimize different content types?',
      'What about SEO optimization?',
      'How do you measure effectiveness?',
    ],
    fallback_plan:
      'Use pre-prepared content optimization with realistic scores and recommendations',
  },

  conclusion: {
    duration: 30, // seconds
    talking_points: [
      'Professional business intelligence created through conversation',
      'Artifacts persist and build intelligence over time',
      'First-mover advantage in conversational GEO analytics',
      'Ready for immediate business use and strategic decision-making',
      'Scalable solution for enterprise brand monitoring',
    ],
  },
};

export interface DemoExecutionPlan {
  total_duration: number;
  sections: Array<{
    name: string;
    duration: number;
    description: string;
  }>;
  key_messages: string[];
  success_criteria: string[];
  risk_mitigation: string[];
}

export const demoExecutionPlan: DemoExecutionPlan = {
  total_duration: 420, // 7 minutes total
  sections: [
    {
      name: 'Introduction',
      duration: 30,
      description: 'Set up the problem and solution overview',
    },
    {
      name: 'Multi-Model Visibility Analysis',
      duration: 120,
      description: 'Demonstrate Tesla brand visibility across AI platforms',
    },
    {
      name: 'Brand Mention Monitoring',
      duration: 90,
      description: 'Show Apple brand monitoring with web scraping',
    },
    {
      name: 'Competitive Intelligence',
      duration: 90,
      description: 'Analyze Nike vs competitors market position',
    },
    {
      name: 'Content Optimization',
      duration: 60,
      description: 'Optimize content for AI platforms',
    },
    {
      name: 'Conclusion',
      duration: 30,
      description: 'Wrap up with key value propositions',
    },
  ],
  key_messages: [
    'Conversational GEO analytics - the future of brand intelligence',
    'Real-time multi-platform analysis through natural language',
    'Professional business intelligence instantly available',
    'Persistent artifacts that build intelligence over time',
    'First-mover advantage in AI-powered brand monitoring',
  ],
  success_criteria: [
    'All scenarios execute successfully within time limits',
    'Professional visualizations render correctly',
    'Realistic and compelling data is displayed',
    'Smooth transitions between scenarios',
    'Clear business value is communicated',
  ],
  risk_mitigation: [
    'Pre-prepared fallback data for all scenarios',
    'Multiple demo environments available',
    'Screen recording backup in case of technical issues',
    'Clear talking points for common questions',
    'Alternative scenarios ready if primary ones fail',
  ],
};

export interface DemoChecklist {
  pre_demo: string[];
  during_demo: string[];
  post_demo: string[];
}

export const demoChecklist: DemoChecklist = {
  pre_demo: [
    'Environment health check completed',
    'Network connectivity verified',
    'Browser cache cleared',
    'Fallback systems armed',
    'Screen recording started',
    'Demo script reviewed',
    'Talking points memorized',
    'Backup materials prepared',
    'Stakeholder availability confirmed',
    'Demo environment tested',
  ],
  during_demo: [
    'Maintain professional presentation style',
    'Follow timing for each section',
    'Highlight key value propositions',
    'Address questions confidently',
    'Use fallback data if needed',
    'Monitor audience engagement',
    'Stay within time limits',
    'Emphasize business value',
    'Show technical capabilities',
    'Demonstrate competitive advantage',
  ],
  post_demo: [
    'Collect stakeholder feedback',
    'Review technical metrics',
    'Document any issues encountered',
    'Plan follow-up actions',
    'Share demo recording if requested',
    'Schedule next steps discussion',
    'Update demo materials based on feedback',
    'Prepare for potential questions',
    'Document lessons learned',
    'Plan improvements for next demo',
  ],
};

export function getDemoTalkingPoints(scenario: keyof DemoScript): string[] {
  const section = demoScript[scenario];
  if ('talking_points' in section) {
    return section.talking_points;
  }
  return [];
}

export function getDemoDuration(scenario: keyof DemoScript): number {
  const section = demoScript[scenario];
  return section.duration;
}

export function validateDemoTiming(): {
  total_duration: number;
  within_limits: boolean;
  recommendations: string[];
} {
  const totalDuration = Object.values(demoScript).reduce(
    (sum, section) => sum + section.duration,
    0,
  );
  const withinLimits = totalDuration <= 420; // 7 minutes max
  const recommendations: string[] = [];

  if (!withinLimits) {
    recommendations.push(`Demo is ${totalDuration - 420} seconds too long`);
    recommendations.push('Consider reducing scenario durations');
    recommendations.push('Focus on key value propositions');
  }

  if (totalDuration < 300) {
    recommendations.push(
      'Demo might be too short - consider adding more detail',
    );
  }

  return {
    total_duration: totalDuration,
    within_limits: withinLimits,
    recommendations,
  };
}
