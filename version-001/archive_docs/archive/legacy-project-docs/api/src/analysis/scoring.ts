import { AIResponse, CompetitorRanking } from '../lib/types';

export function calculateBrandScores(responses: AIResponse[], brandName: string, competitors: CompetitorRanking[]) {
  const totalResponses = responses.length;
  if (totalResponses === 0) {
    return {
      visibilityScore: 0,
      sentimentScore: 0,
      shareOfVoice: 0,
      overallScore: 0,
      averagePosition: 0,
    };
  }

  const brandRanking = competitors.find(c => c.isOwn);
  
  if (!brandRanking) {
    return {
      visibilityScore: 0,
      sentimentScore: 0,
      shareOfVoice: 0,
      overallScore: 0,
      averagePosition: 0,
    };
  }

  const visibilityScore = brandRanking.visibilityScore;
  const sentimentScore = brandRanking.sentimentScore;
  const shareOfVoice = brandRanking.shareOfVoice;
  const averagePosition = brandRanking.averagePosition;

  const positionScore = averagePosition <= 10 
    ? (11 - averagePosition) * 10 
    : Math.max(0, 100 - (averagePosition * 2));

  const overallScore = (
    visibilityScore * 0.3 + 
    sentimentScore * 0.2 + 
    shareOfVoice * 0.3 +
    positionScore * 0.2
  );

  return {
    visibilityScore: Math.round(visibilityScore * 10) / 10,
    sentimentScore: Math.round(sentimentScore * 10) / 10,
    shareOfVoice: Math.round(shareOfVoice * 10) / 10,
    overallScore: Math.round(overallScore * 10) / 10,
    averagePosition: Math.round(averagePosition * 10) / 10,
  };
}
