import { BodyRecommendationService, BodyShape } from '../body/BodyRecommendationService';
import { MatchableGarment, Occasion, Season, categoryToSlot } from '../generation/MatchableGarment';
import { OutfitGenerator } from '../generation/OutfitGenerator';
import { ColorMatcher } from '../matching/ColorMatcher';
import { StyleMatcher } from '../matching/StyleMatcher';
import { OutfitScorer } from '../scoring/OutfitScorer';
import { WeatherConditions, WeatherConstraints, WeatherFilter } from '../weather/WeatherFilter';

export type RecommendationCriteria = {
  season: Season;
  occasion: Occasion;
  weatherConditions: WeatherConditions;
  bodyShape?: BodyShape;
};

export type RecommendedOutfit = {
  garmentIds: string[];
  score: number;
  bodyScore?: number;
};

const DEFAULT_RESULT_LIMIT = 5;
const MAX_WARMTH_CENTERING_PENALTY = 20;

function averagePairwise(
  garments: MatchableGarment[],
  scorePair: (a: MatchableGarment, b: MatchableGarment) => number,
): number {
  if (garments.length < 2) return 100;

  let total = 0;
  let pairCount = 0;

  for (let i = 0; i < garments.length; i++) {
    for (let j = i + 1; j < garments.length; j++) {
      total += scorePair(garments[i], garments[j]);
      pairCount++;
    }
  }

  return total / pairCount;
}

function warmthCenteringScore(
  garments: MatchableGarment[],
  constraints: WeatherConstraints,
): number {
  const averageWarmth =
    garments.reduce((sum, garment) => sum + garment.warmthLevel, 0) / garments.length;

  const midpoint = (constraints.minWarmthLevel + constraints.maxWarmthLevel) / 2;
  const halfRange = (constraints.maxWarmthLevel - constraints.minWarmthLevel) / 2 || 1;
  const distanceRatio = Math.abs(averageWarmth - midpoint) / halfRange;

  return Math.round(Math.max(0, 100 - distanceRatio * MAX_WARMTH_CENTERING_PENALTY));
}

function bodyScoreFor(garments: MatchableGarment[], bodyShape: BodyShape): number {
  const top = garments.find((garment) => categoryToSlot(garment.category) === 'top');
  const bottom = garments.find((garment) => categoryToSlot(garment.category) === 'bottom');

  if (!top || !bottom) return 100;

  return BodyRecommendationService.scoreForBodyShape(bodyShape, top.fit, bottom.fit);
}

export class RecommendationEngine {
  static recommend(
    garments: MatchableGarment[],
    criteria: RecommendationCriteria,
    limit: number = DEFAULT_RESULT_LIMIT,
  ): RecommendedOutfit[] {
    const weatherConstraints = WeatherFilter.getConstraints(criteria.weatherConditions);

    const candidates = OutfitGenerator.generate(garments, {
      season: criteria.season,
      occasion: criteria.occasion,
      weatherConstraints,
    });

    const garmentsById = new Map(garments.map((garment) => [garment.id, garment]));

    const recommendations = candidates.map((candidate): RecommendedOutfit => {
      const candidateGarments = candidate.garmentIds.map((id) => garmentsById.get(id)!);

      const colorScore = averagePairwise(candidateGarments, (a, b) =>
        ColorMatcher.contrastScore(a.color, b.color),
      );
      const styleScore = averagePairwise(candidateGarments, (a, b) =>
        StyleMatcher.bestScoreAmong(a.style, b.style),
      );
      const weatherScore = warmthCenteringScore(candidateGarments, weatherConstraints);
      // occasion is already guaranteed by OutfitGenerator's eligibility filter
      const occasionScore = 100;

      const score = OutfitScorer.score({ colorScore, weatherScore, occasionScore, styleScore });
      const bodyScore = criteria.bodyShape
        ? bodyScoreFor(candidateGarments, criteria.bodyShape)
        : undefined;

      return { garmentIds: candidate.garmentIds, score, bodyScore };
    });

    recommendations.sort((a, b) => b.score - a.score || (b.bodyScore ?? 0) - (a.bodyScore ?? 0));

    return recommendations.slice(0, limit);
  }
}
