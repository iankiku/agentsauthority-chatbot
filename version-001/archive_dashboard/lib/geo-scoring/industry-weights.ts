// Industry-specific scoring weights for GEO analysis
// These weights determine how different factors contribute to the overall GEO score
// based on what matters most for each industry vertical

export interface ScoringWeights {
  mentionFrequency: number;    // How often the brand is mentioned (0-1)
  rankingPosition: number;     // Position in AI search results (0-1)
  contextRelevance: number;    // Quality and relevance of mentions (0-1)
  sentimentScore: number;      // Sentiment of mentions (0-1)
  competitorGap: number;       // Performance vs competitors (0-1)
  contentAuthority: number;    // Authority and expertise signals (0-1)
}

export interface IndustryConfig {
  weights: ScoringWeights;
  keyQueries: string[];
  competitorSignals: string[];
  authorityIndicators: string[];
  description: string;
}

// Default weights (balanced approach)
const DEFAULT_WEIGHTS: ScoringWeights = {
  mentionFrequency: 0.25,
  rankingPosition: 0.25,
  contextRelevance: 0.20,
  sentimentScore: 0.10,
  competitorGap: 0.10,
  contentAuthority: 0.10,
};

// Industry-specific configurations
export const INDUSTRY_WEIGHTS: Record<string, IndustryConfig> = {
  'saas': {
    weights: {
      mentionFrequency: 0.30,     // High - SaaS needs visibility
      rankingPosition: 0.25,      // High - Top results matter
      contextRelevance: 0.20,     // Medium - Context quality important
      sentimentScore: 0.10,       // Medium - Reviews matter
      competitorGap: 0.10,        // Medium - Competitive landscape
      contentAuthority: 0.05,     // Low - Less about expertise, more about features
    },
    keyQueries: [
      'best {category} software',
      '{category} tools comparison',
      'top {category} platforms',
      '{brand} vs {competitor}',
      '{category} software reviews',
      'how to choose {category} tool',
      '{category} pricing comparison'
    ],
    competitorSignals: ['vs', 'alternative', 'competitor', 'comparison'],
    authorityIndicators: ['integration', 'API', 'enterprise', 'security'],
    description: 'Software as a Service companies - focus on feature visibility and competitive positioning'
  },

  'ecommerce': {
    weights: {
      mentionFrequency: 0.20,     // Medium - Brand awareness important
      rankingPosition: 0.35,      // Very High - Shopping queries need top positions
      contextRelevance: 0.15,     // Medium - Product context matters
      sentimentScore: 0.15,       // High - Customer satisfaction crucial
      competitorGap: 0.10,        // Medium - Competitive pricing
      contentAuthority: 0.05,     // Low - Less about expertise
    },
    keyQueries: [
      'best {product} to buy',
      'where to buy {product}',
      '{product} reviews',
      'cheap {product}',
      '{brand} store',
      '{product} deals',
      'top {product} brands'
    ],
    competitorSignals: ['cheaper', 'better price', 'alternative store'],
    authorityIndicators: ['shipping', 'return policy', 'customer service'],
    description: 'E-commerce businesses - focus on product visibility and customer sentiment'
  },

  'fintech': {
    weights: {
      mentionFrequency: 0.20,     // Medium - Awareness important
      rankingPosition: 0.20,      // Medium - Position matters but trust more
      contextRelevance: 0.25,     // High - Context crucial for trust
      sentimentScore: 0.15,       // High - Trust and reputation critical
      competitorGap: 0.10,        // Medium - Competitive features
      contentAuthority: 0.10,     // High - Expertise and compliance matter
    },
    keyQueries: [
      'best {service} app',
      'secure {service} platform',
      '{service} reviews',
      'trusted {service} provider',
      '{brand} vs {competitor}',
      'how to choose {service}',
      '{service} fees comparison'
    ],
    competitorSignals: ['vs', 'alternative', 'better rates', 'lower fees'],
    authorityIndicators: ['secure', 'regulated', 'compliance', 'encryption'],
    description: 'Financial technology - emphasis on trust, security, and regulatory compliance'
  },

  'healthcare': {
    weights: {
      mentionFrequency: 0.15,     // Lower - Quality over quantity
      rankingPosition: 0.20,      // Medium - Position important
      contextRelevance: 0.30,     // Very High - Medical accuracy crucial
      sentimentScore: 0.15,       // High - Patient satisfaction important
      competitorGap: 0.05,        // Low - Less about competition
      contentAuthority: 0.15,     // Very High - Medical expertise essential
    },
    keyQueries: [
      'best {treatment} options',
      '{condition} treatment',
      'how to treat {condition}',
      '{service} near me',
      '{brand} reviews',
      'trusted {service} provider',
      '{condition} specialist'
    ],
    competitorSignals: ['alternative treatment', 'better option'],
    authorityIndicators: ['FDA approved', 'clinical trial', 'medical grade', 'certified'],
    description: 'Healthcare services - focus on medical authority and patient outcomes'
  },

  'education': {
    weights: {
      mentionFrequency: 0.20,     // Medium - Awareness important
      rankingPosition: 0.25,      // High - Discoverability matters
      contextRelevance: 0.25,     // High - Educational context important
      sentimentScore: 0.10,       // Medium - Student satisfaction
      competitorGap: 0.05,        // Low - Less competitive focus
      contentAuthority: 0.15,     // High - Educational expertise matters
    },
    keyQueries: [
      'best {subject} course',
      'learn {skill} online',
      '{subject} tutorial',
      'how to learn {skill}',
      '{brand} reviews',
      'online {subject} class',
      'free {subject} resources'
    ],
    competitorSignals: ['alternative course', 'better program'],
    authorityIndicators: ['accredited', 'certified', 'expert instructor', 'curriculum'],
    description: 'Educational services - focus on learning outcomes and instructor expertise'
  },

  'consulting': {
    weights: {
      mentionFrequency: 0.15,     // Lower - Quality over quantity
      rankingPosition: 0.20,      // Medium - Discoverability important
      contextRelevance: 0.25,     // High - Context and expertise crucial
      sentimentScore: 0.15,       // High - Client satisfaction important
      competitorGap: 0.10,        // Medium - Competitive differentiation
      contentAuthority: 0.15,     // Very High - Expertise is everything
    },
    keyQueries: [
      'best {service} consultant',
      '{industry} consulting firm',
      'how to {solve problem}',
      '{service} expert',
      '{brand} case studies',
      'top {industry} advisors',
      '{service} consulting reviews'
    ],
    competitorSignals: ['vs', 'alternative firm', 'better consultant'],
    authorityIndicators: ['case study', 'certified', 'years experience', 'industry expert'],
    description: 'Consulting services - emphasis on expertise, case studies, and client results'
  },

  'manufacturing': {
    weights: {
      mentionFrequency: 0.25,     // High - B2B visibility important
      rankingPosition: 0.30,      // High - Procurement searches
      contextRelevance: 0.20,     // Medium - Technical context matters
      sentimentScore: 0.10,       // Medium - Quality reputation
      competitorGap: 0.10,        // Medium - Competitive specs
      contentAuthority: 0.05,     // Lower - More about capabilities
    },
    keyQueries: [
      'best {product} manufacturer',
      '{product} supplier',
      'custom {product} manufacturing',
      '{material} processing',
      '{brand} capabilities',
      'industrial {product}',
      '{product} specifications'
    ],
    competitorSignals: ['alternative supplier', 'better manufacturer'],
    authorityIndicators: ['ISO certified', 'quality standards', 'manufacturing capacity'],
    description: 'Manufacturing companies - focus on capabilities and quality standards'
  },

  'real-estate': {
    weights: {
      mentionFrequency: 0.20,     // Medium - Local awareness important
      rankingPosition: 0.35,      // Very High - Local search critical
      contextRelevance: 0.20,     // Medium - Location context matters
      sentimentScore: 0.15,       // High - Client satisfaction crucial
      competitorGap: 0.05,        // Low - Less direct competition
      contentAuthority: 0.05,     // Lower - More about results
    },
    keyQueries: [
      'best realtor in {location}',
      '{location} real estate agent',
      'homes for sale {location}',
      '{brand} properties',
      'real estate {location}',
      'buy house {location}',
      '{agent} reviews'
    ],
    competitorSignals: ['better agent', 'alternative realtor'],
    authorityIndicators: ['licensed', 'local expert', 'years experience', 'sales record'],
    description: 'Real estate services - focus on local visibility and client testimonials'
  },

  'legal': {
    weights: {
      mentionFrequency: 0.15,     // Lower - Quality over quantity
      rankingPosition: 0.25,      // High - Legal searches important
      contextRelevance: 0.30,     // Very High - Legal context crucial
      sentimentScore: 0.15,       // High - Client satisfaction important
      competitorGap: 0.05,        // Low - Less competitive focus
      contentAuthority: 0.10,     // High - Legal expertise essential
    },
    keyQueries: [
      'best {practice} lawyer',
      '{legal issue} attorney',
      'how to {legal process}',
      '{location} law firm',
      '{brand} legal services',
      '{practice} specialist',
      'lawyer for {issue}'
    ],
    competitorSignals: ['alternative lawyer', 'better attorney'],
    authorityIndicators: ['bar certified', 'years experience', 'case wins', 'legal expert'],
    description: 'Legal services - emphasis on expertise, case results, and professional credentials'
  }
};

// Utility functions
export function getIndustryWeights(industry: string): ScoringWeights {
  const normalizedIndustry = industry.toLowerCase().trim();
  return INDUSTRY_WEIGHTS[normalizedIndustry]?.weights || DEFAULT_WEIGHTS;
}

export function getIndustryConfig(industry: string): IndustryConfig {
  const normalizedIndustry = industry.toLowerCase().trim();
  return INDUSTRY_WEIGHTS[normalizedIndustry] || {
    weights: DEFAULT_WEIGHTS,
    keyQueries: [
      'best {category} service',
      '{category} provider',
      'top {category} company',
      '{brand} reviews',
      'how to choose {category}'
    ],
    competitorSignals: ['vs', 'alternative', 'competitor'],
    authorityIndicators: ['expert', 'professional', 'certified'],
    description: 'General business - balanced scoring approach'
  };
}

export function getAvailableIndustries(): string[] {
  return Object.keys(INDUSTRY_WEIGHTS);
}

export function calculateWeightedScore(
  scores: {
    mentionFrequency: number;
    rankingPosition: number;
    contextRelevance: number;
    sentimentScore: number;
    competitorGap: number;
    contentAuthority: number;
  },
  industry?: string
): number {
  const weights = getIndustryWeights(industry || 'general');
  
  return Math.round(
    scores.mentionFrequency * weights.mentionFrequency * 100 +
    scores.rankingPosition * weights.rankingPosition * 100 +
    scores.contextRelevance * weights.contextRelevance * 100 +
    scores.sentimentScore * weights.sentimentScore * 100 +
    scores.competitorGap * weights.competitorGap * 100 +
    scores.contentAuthority * weights.contentAuthority * 100
  );
}
