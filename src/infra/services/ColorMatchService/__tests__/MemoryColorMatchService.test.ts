import { beforeEach, describe, expect, it } from 'vitest';

import { createTestGarment } from '@/../tests/createEntitiesTest/garmentCreate';
import { Garment } from '@/domain/entities/Garment/Garment';

import { MemoryColorMatchService } from '../MemoryColorMatchService';

// matchScore is a private implementation detail (not part of the ColorMatchService
// interface), so this type exposes just enough of it to exercise it directly in tests.
type WithPrivateMatchScore = {
  matchScore(garmentA: Garment, garmentB: Garment): number;
};

describe('MemoryColorMatchService', () => {
  let colorMatchService: MemoryColorMatchService;

  beforeEach(() => {
    colorMatchService = new MemoryColorMatchService();
  });

  const matchScore = (garmentA: Garment, garmentB: Garment): number =>
    (colorMatchService as unknown as WithPrivateMatchScore).matchScore(garmentA, garmentB);

  describe('matchScore', () => {
    it('should score a neutral pairing highly regardless of the other color', () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });
      const redPants = createTestGarment({ id: 'garment-2', colors: ['Red'] });

      expect(matchScore(whiteShirt, redPants)).toBe(90);
    });

    it('should score two neutrals highly', () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });
      const blackPants = createTestGarment({ id: 'garment-2', colors: ['Black'] });

      expect(matchScore(whiteShirt, blackPants)).toBe(90);
    });

    it('should score complementary colors highly', () => {
      const orangeShirt = createTestGarment({ id: 'garment-1', colors: ['Orange'] });
      const blueJacket = createTestGarment({ id: 'garment-2', colors: ['Blue'] });

      const score = matchScore(orangeShirt, blueJacket);

      expect(score).toBeGreaterThanOrEqual(85);
    });

    it('should score analogous colors well', () => {
      const redShirt = createTestGarment({ id: 'garment-1', colors: ['Red'] });
      const orangePants = createTestGarment({ id: 'garment-2', colors: ['Orange'] });

      const score = matchScore(redShirt, orangePants);

      expect(score).toBeGreaterThanOrEqual(80);
      expect(score).toBeLessThan(85);
    });

    it('should score clashing colors poorly', () => {
      const redShirt = createTestGarment({ id: 'garment-1', colors: ['Red'] });
      const greenPants = createTestGarment({ id: 'garment-2', colors: ['Green'] });

      const score = matchScore(redShirt, greenPants);

      expect(score).toBeLessThan(60);
    });

    it('should treat unrecognized color names as neutral', () => {
      const mysteryShirt = createTestGarment({ id: 'garment-1', colors: ['Chartreuse Mist'] });
      const redPants = createTestGarment({ id: 'garment-2', colors: ['Red'] });

      expect(matchScore(mysteryShirt, redPants)).toBe(90);
    });

    it('should use the best-matching pair when garments have multiple colors', () => {
      const stripedShirt = createTestGarment({ id: 'garment-1', colors: ['Green', 'White'] });
      const redPants = createTestGarment({ id: 'garment-2', colors: ['Red'] });

      expect(matchScore(stripedShirt, redPants)).toBe(90);
    });

    describe('score clamping', () => {
      it('should never exceed 100 for a neutral pairing', () => {
        const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });
        const blackPants = createTestGarment({ id: 'garment-2', colors: ['Black'] });

        expect(matchScore(whiteShirt, blackPants)).toBeLessThanOrEqual(100);
      });

      it('should never exceed 100 for the highest-scoring complementary pairing', () => {
        const maroonShirt = createTestGarment({ id: 'garment-1', colors: ['Maroon'] });
        const turquoiseJacket = createTestGarment({ id: 'garment-2', colors: ['Turquoise'] });

        expect(matchScore(maroonShirt, turquoiseJacket)).toBeLessThanOrEqual(100);
      });

      it('should never exceed 100 for the highest-scoring analogous pairing', () => {
        const pinkShirt = createTestGarment({ id: 'garment-1', colors: ['Pink'] });
        const redPants = createTestGarment({ id: 'garment-2', colors: ['Red'] });

        expect(matchScore(pinkShirt, redPants)).toBeLessThanOrEqual(100);
      });

      it('should never exceed 100 for the highest-scoring clashing pairing', () => {
        const greenShirt = createTestGarment({ id: 'garment-1', colors: ['Green'] });
        const pinkPants = createTestGarment({ id: 'garment-2', colors: ['Pink'] });

        expect(matchScore(greenShirt, pinkPants)).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('getMatchingGarments', () => {
    it('should return only candidates whose colors match the target, excluding non-matching colors', () => {
      const redShirt = createTestGarment({ id: 'garment-1', colors: ['Red'] });
      const orangePants = createTestGarment({ id: 'garment-2', colors: ['Orange'] });
      const greenPants = createTestGarment({ id: 'garment-3', colors: ['Green'] });

      const result = colorMatchService.getMatchingGarments(redShirt, [orangePants, greenPants]);

      expect(result.map((garment) => garment.id)).toEqual([orangePants.id]);
    });

    it('should exclude clashing candidates', () => {
      const redShirt = createTestGarment({ id: 'garment-1', colors: ['Red'] });
      const greenPants = createTestGarment({ id: 'garment-2', colors: ['Green'] });

      const result = colorMatchService.getMatchingGarments(redShirt, [greenPants]);

      expect(result).toEqual([]);
    });

    it('should exclude the target garment itself from the candidates', () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });

      const result = colorMatchService.getMatchingGarments(whiteShirt, [whiteShirt]);

      expect(result).toEqual([]);
    });

    it('should sort matches from best to worst', () => {
      const orangePants = createTestGarment({ id: 'garment-1', colors: ['Orange'] });
      const redShirt = createTestGarment({ id: 'garment-2', colors: ['Red'] });
      const blueJacket = createTestGarment({ id: 'garment-3', colors: ['Blue'] });

      const redScore = matchScore(orangePants, redShirt);
      const blueScore = matchScore(orangePants, blueJacket);
      expect(blueScore).toBeGreaterThan(redScore);

      const result = colorMatchService.getMatchingGarments(orangePants, [redShirt, blueJacket]);

      expect(result.map((garment) => garment.id)).toEqual([blueJacket.id, redShirt.id]);
    });

    it('should return an empty array when no candidates are provided', () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });

      const result = colorMatchService.getMatchingGarments(whiteShirt, []);

      expect(result).toEqual([]);
    });
  });

  describe('getMatchingGarmentsByCategory', () => {
    it('should group matching garments under their own category', () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });
      const bluePants = createTestGarment({ id: 'garment-2', colors: ['Blue'], category: 'pants' });
      const blueShoes = createTestGarment({ id: 'garment-3', colors: ['Blue'], category: 'shoes' });

      const result = colorMatchService.getMatchingGarmentsByCategory(whiteShirt, [bluePants, blueShoes]);

      expect(result).toEqual({
        pants: [bluePants],
        shoes: [blueShoes],
      });
    });

    it('should keep multiple matches for the same category together, best first', () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });
      const navyPants = createTestGarment({ id: 'garment-2', colors: ['Blue'], category: 'pants' });
      const greyPants = createTestGarment({ id: 'garment-3', colors: ['Gray'], category: 'pants' });

      const result = colorMatchService.getMatchingGarmentsByCategory(whiteShirt, [navyPants, greyPants]);

      expect(result.pants.map((garment) => garment.id)).toEqual([navyPants.id, greyPants.id]);
    });

    it('should exclude non-matching categories entirely', () => {
      const redShirt = createTestGarment({ id: 'garment-1', colors: ['Red'] });
      const greenPants = createTestGarment({ id: 'garment-2', colors: ['Green'], category: 'pants' });

      const result = colorMatchService.getMatchingGarmentsByCategory(redShirt, [greenPants]);

      expect(result).toEqual({});
    });

    it('should return an empty object when no candidates are provided', () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });

      const result = colorMatchService.getMatchingGarmentsByCategory(whiteShirt, []);

      expect(result).toEqual({});
    });

    it('should cap the number of distinct categories at 50', () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });
      const candidates = Array.from({ length: 60 }, (_, i) =>
        createTestGarment({ id: `garment-category-${i}`, colors: ['White'], category: `category-${i}` }),
      );

      const result = colorMatchService.getMatchingGarmentsByCategory(whiteShirt, candidates);

      expect(Object.keys(result)).toHaveLength(50);
    });

    it('should still add matches to an already-included category after the cap is reached', () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });
      const firstCategoryCandidates = Array.from({ length: 50 }, (_, i) =>
        createTestGarment({ id: `garment-category-${i}`, colors: ['White'], category: `category-${i}` }),
      );
      const secondMatchForFirstCategory = createTestGarment({
        id: 'garment-category-0-second',
        colors: ['White'],
        category: 'category-0',
      });
      const overflowCategoryCandidate = createTestGarment({
        id: 'garment-overflow',
        colors: ['White'],
        category: 'category-overflow',
      });

      const result = colorMatchService.getMatchingGarmentsByCategory(whiteShirt, [
        ...firstCategoryCandidates,
        secondMatchForFirstCategory,
        overflowCategoryCandidate,
      ]);

      expect(Object.keys(result)).toHaveLength(50);
      expect(result['category-0']).toHaveLength(2);
      expect(result['category-overflow']).toBeUndefined();
    });
  });

  describe('isValidColorCombination', () => {
    it('should allow 3 or fewer distinct colors with no neutrals at all', () => {
      const garments = [
        createTestGarment({ id: 'garment-1', colors: ['Red'] }),
        createTestGarment({ id: 'garment-2', colors: ['Blue'] }),
        createTestGarment({ id: 'garment-3', colors: ['Green'] }),
      ];

      expect(colorMatchService.isValidColorCombination(garments)).toBe(true);
    });

    it('should allow exactly 4 distinct colors when at least 2 are neutral', () => {
      const garments = [
        createTestGarment({ id: 'garment-1', colors: ['White'] }),
        createTestGarment({ id: 'garment-2', colors: ['Black'] }),
        createTestGarment({ id: 'garment-3', colors: ['Red'] }),
        createTestGarment({ id: 'garment-4', colors: ['Blue'] }),
      ];

      expect(colorMatchService.isValidColorCombination(garments)).toBe(true);
    });

    it('should reject 4 distinct colors when fewer than 2 are neutral', () => {
      const garments = [
        createTestGarment({ id: 'garment-1', colors: ['White'] }),
        createTestGarment({ id: 'garment-2', colors: ['Red'] }),
        createTestGarment({ id: 'garment-3', colors: ['Blue'] }),
        createTestGarment({ id: 'garment-4', colors: ['Green'] }),
      ];

      expect(colorMatchService.isValidColorCombination(garments)).toBe(false);
    });

    it('should reject 4 distinct colors with no neutrals at all', () => {
      const garments = [
        createTestGarment({ id: 'garment-1', colors: ['Red'] }),
        createTestGarment({ id: 'garment-2', colors: ['Blue'] }),
        createTestGarment({ id: 'garment-3', colors: ['Green'] }),
        createTestGarment({ id: 'garment-4', colors: ['Yellow'] }),
      ];

      expect(colorMatchService.isValidColorCombination(garments)).toBe(false);
    });

    it('should reject more than 4 distinct colors regardless of how many are neutral', () => {
      const garments = [
        createTestGarment({ id: 'garment-1', colors: ['White'] }),
        createTestGarment({ id: 'garment-2', colors: ['Black'] }),
        createTestGarment({ id: 'garment-3', colors: ['Gray'] }),
        createTestGarment({ id: 'garment-4', colors: ['Red'] }),
        createTestGarment({ id: 'garment-5', colors: ['Blue'] }),
      ];

      expect(colorMatchService.isValidColorCombination(garments)).toBe(false);
    });

    it('should not double-count the same color name in different casings', () => {
      const garments = [
        createTestGarment({ id: 'garment-1', colors: ['White'] }),
        createTestGarment({ id: 'garment-2', colors: ['white'] }),
        createTestGarment({ id: 'garment-3', colors: [' WHITE '] }),
      ];

      expect(colorMatchService.isValidColorCombination(garments)).toBe(true);
    });

    it('should allow an empty list of garments', () => {
      expect(colorMatchService.isValidColorCombination([])).toBe(true);
    });
  });
});
