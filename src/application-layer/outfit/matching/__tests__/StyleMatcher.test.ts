import { describe, expect, it } from 'vitest';

import { STYLES, Style, StyleMatcher } from '../StyleMatcher';

describe('StyleMatcher', () => {
  describe('compatibilityScore', () => {
    it('scores identical styles at the maximum', () => {
      expect(StyleMatcher.compatibilityScore('casual', 'casual')).toBe(100);
    });

    it('is symmetric', () => {
      expect(StyleMatcher.compatibilityScore('business', 'sport')).toBe(
        StyleMatcher.compatibilityScore('sport', 'business'),
      );
    });

    it('scores a business jacket with gym shorts poorly, matching the 15/100 example', () => {
      expect(StyleMatcher.compatibilityScore('business', 'sport')).toBe(15);
    });

    it('scores casual and streetwear highly', () => {
      expect(StyleMatcher.compatibilityScore('casual', 'streetwear')).toBeGreaterThanOrEqual(75);
    });

    it('has a defined score for every pair of known styles', () => {
      for (const a of STYLES) {
        for (const b of STYLES) {
          const score = StyleMatcher.compatibilityScore(a, b);

          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(100);
        }
      }
    });
  });

  describe('isCompatible', () => {
    it('returns true for highly compatible styles', () => {
      expect(StyleMatcher.isCompatible('casual', 'streetwear')).toBe(true);
    });

    it('returns false for poorly compatible styles', () => {
      expect(StyleMatcher.isCompatible('business', 'sport')).toBe(false);
    });
  });

  describe('bestScoreAmong', () => {
    it('returns the highest score between any style of a and any style of b', () => {
      const topStyles: Style[] = ['business', 'minimalist'];
      const bottomStyles: Style[] = ['sport', 'elegant'];

      // business/elegant (85) is the best pairing available among the combinations
      expect(StyleMatcher.bestScoreAmong(topStyles, bottomStyles)).toBe(85);
    });

    it('returns 100 when both garments share a style', () => {
      const topStyles: Style[] = ['casual', 'minimalist'];
      const bottomStyles: Style[] = ['sport', 'casual'];

      expect(StyleMatcher.bestScoreAmong(topStyles, bottomStyles)).toBe(100);
    });
  });
});
