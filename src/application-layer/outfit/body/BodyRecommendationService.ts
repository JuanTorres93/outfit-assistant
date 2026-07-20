export type Fit = 'slim' | 'regular' | 'wide';

export const BODY_SHAPES = [
  'pear',
  'rectangle',
  'triangle',
  'hourglass',
  'oval',
  'athletic',
] as const;

export type BodyShape = (typeof BODY_SHAPES)[number];

const WIDE_WIDE_SCORE = 30;
const SLIM_SLIM_SCORE = 90;
const SAME_REGULAR_SCORE = 70;
const BALANCED_SCORE = 80;

// Heuristic styling adjustments, not an absolute rule - nudges the base silhouette
// score up or down depending on how well the fit combination flatters each body shape.
const BODY_SHAPE_ADJUSTMENTS: Record<BodyShape, (topFit: Fit, bottomFit: Fit) => number> = {
  pear: (topFit, bottomFit) => (bottomFit === 'wide' && topFit !== 'wide' ? 10 : 0),
  triangle: (topFit, bottomFit) => (topFit === 'wide' && bottomFit !== 'wide' ? 10 : 0),
  rectangle: (topFit, bottomFit) => (topFit === 'wide' && bottomFit === 'wide' ? 10 : 0),
  hourglass: (topFit, bottomFit) => (topFit === 'slim' && bottomFit === 'slim' ? 5 : 0),
  oval: (topFit, bottomFit) => (topFit === 'slim' && bottomFit !== 'slim' ? 10 : 0),
  athletic: (topFit, bottomFit) => (topFit === 'wide' && bottomFit === 'wide' ? 5 : 0),
};

export class BodyRecommendationService {
  static silhouetteScore(topFit: Fit, bottomFit: Fit): number {
    if (topFit === 'wide' && bottomFit === 'wide') return WIDE_WIDE_SCORE;
    if (topFit === 'slim' && bottomFit === 'slim') return SLIM_SLIM_SCORE;
    if (topFit === bottomFit) return SAME_REGULAR_SCORE;

    return BALANCED_SCORE;
  }

  static scoreForBodyShape(bodyShape: BodyShape, topFit: Fit, bottomFit: Fit): number {
    const base = BodyRecommendationService.silhouetteScore(topFit, bottomFit);
    const adjustment = BODY_SHAPE_ADJUSTMENTS[bodyShape](topFit, bottomFit);

    return Math.max(0, Math.min(100, base + adjustment));
  }
}
