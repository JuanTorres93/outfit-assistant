export type OutfitScoreComponents = {
  colorScore: number;
  weatherScore: number;
  occasionScore: number;
  styleScore: number;
  preferenceScore?: number;
};

const DEFAULT_PREFERENCE_SCORE = 50;

const WEIGHTS = {
  color: 0.3,
  weather: 0.2,
  occasion: 0.2,
  style: 0.2,
  preference: 0.1,
};

export class OutfitScorer {
  static score(components: OutfitScoreComponents): number {
    const preferenceScore = components.preferenceScore ?? DEFAULT_PREFERENCE_SCORE;

    const weighted =
      components.colorScore * WEIGHTS.color +
      components.weatherScore * WEIGHTS.weather +
      components.occasionScore * WEIGHTS.occasion +
      components.styleScore * WEIGHTS.style +
      preferenceScore * WEIGHTS.preference;

    return Math.round(Math.min(100, Math.max(0, weighted)));
  }
}
