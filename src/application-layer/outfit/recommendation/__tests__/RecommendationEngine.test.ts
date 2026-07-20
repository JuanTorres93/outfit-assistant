import { describe, expect, it } from 'vitest';

import { MatchableGarment } from '../../generation/MatchableGarment';
import { RecommendationEngine } from '../RecommendationEngine';

const white = { name: 'white', hue: 0, brightness: 90, isNeutral: true };
const neonGreen = { name: 'neon green', hue: 110, brightness: 90, isNeutral: false };
const darkBrown = { name: 'dark brown', hue: 25, brightness: 15, isNeutral: false };

const baseCriteria = {
  season: 'winter' as const,
  occasion: 'office' as const,
  weatherConditions: { temperatureCelsius: 5 },
};

function garment(
  overrides: Partial<MatchableGarment> & Pick<MatchableGarment, 'id' | 'category'>,
): MatchableGarment {
  return {
    color: white,
    style: ['business'],
    season: ['winter'],
    occasion: ['office'],
    fit: 'regular',
    warmthLevel: 7,
    ...overrides,
  };
}

describe('RecommendationEngine', () => {
  it('returns no recommendations when nothing in the closet matches the criteria', () => {
    const garments = [garment({ id: 'shirt-1', category: 'shirt', season: ['summer'] })];

    expect(RecommendationEngine.recommend(garments, baseCriteria)).toHaveLength(0);
  });

  it('recommends a complete outfit sorted by score, best first', () => {
    const goodShirt = garment({ id: 'shirt-good', category: 'shirt', color: white });
    const clashingShirt = garment({ id: 'shirt-clash', category: 'shirt', color: neonGreen });
    const pants = garment({ id: 'pants-1', category: 'pants', color: darkBrown });
    const shoes = garment({ id: 'shoes-1', category: 'shoes', color: darkBrown });

    const recommendations = RecommendationEngine.recommend(
      [goodShirt, clashingShirt, pants, shoes],
      baseCriteria,
    );

    expect(recommendations.length).toBe(2);
    expect(recommendations[0].garmentIds).toContain('shirt-good');
    expect(recommendations[0].score).toBeGreaterThanOrEqual(recommendations[1].score);
  });

  it('caps the results at the requested limit', () => {
    const shirts = ['a', 'b', 'c'].map((suffix) =>
      garment({ id: `shirt-${suffix}`, category: 'shirt' }),
    );
    const pants = garment({ id: 'pants-1', category: 'pants' });
    const shoes = garment({ id: 'shoes-1', category: 'shoes' });

    const recommendations = RecommendationEngine.recommend(
      [...shirts, pants, shoes],
      baseCriteria,
      2,
    );

    expect(recommendations).toHaveLength(2);
  });

  it('uses body shape as a tie-breaker between otherwise equally scored outfits', () => {
    const shirt = garment({ id: 'shirt-1', category: 'shirt', fit: 'regular' });
    const widePants = garment({ id: 'pants-wide', category: 'pants', fit: 'wide' });
    const regularPants = garment({ id: 'pants-regular', category: 'pants', fit: 'regular' });
    const shoes = garment({ id: 'shoes-1', category: 'shoes' });

    const recommendations = RecommendationEngine.recommend(
      [shirt, widePants, regularPants, shoes],
      { ...baseCriteria, bodyShape: 'pear' },
    );

    expect(recommendations[0].garmentIds).toContain('pants-wide');
  });
});
