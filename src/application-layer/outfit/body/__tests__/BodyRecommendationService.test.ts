import { describe, expect, it } from 'vitest';

import { BodyRecommendationService } from '../BodyRecommendationService';

describe('BodyRecommendationService', () => {
  describe('silhouetteScore', () => {
    it('avoids an oversized top with oversized bottom', () => {
      expect(BodyRecommendationService.silhouetteScore('wide', 'wide')).toBeLessThanOrEqual(40);
    });

    it('favors a slim top with slim bottom', () => {
      expect(BodyRecommendationService.silhouetteScore('slim', 'slim')).toBeGreaterThanOrEqual(85);
    });

    it('scores a balanced silhouette (one wide, one slim) decently', () => {
      expect(BodyRecommendationService.silhouetteScore('wide', 'slim')).toBeGreaterThanOrEqual(70);
    });

    it('scores a wide top + wide bottom lower than a slim top + slim bottom', () => {
      const wide = BodyRecommendationService.silhouetteScore('wide', 'wide');
      const slim = BodyRecommendationService.silhouetteScore('slim', 'slim');

      expect(wide).toBeLessThan(slim);
    });
  });

  describe('scoreForBodyShape', () => {
    it('rewards a pear body shape for balancing a wide bottom with a non-wide top', () => {
      const balanced = BodyRecommendationService.scoreForBodyShape('pear', 'regular', 'wide');
      const unbalanced = BodyRecommendationService.scoreForBodyShape('pear', 'wide', 'wide');

      expect(balanced).toBeGreaterThan(unbalanced);
    });

    it('rewards a triangle body shape for balancing a wide top with a non-wide bottom', () => {
      const balanced = BodyRecommendationService.scoreForBodyShape('triangle', 'wide', 'regular');
      const unbalanced = BodyRecommendationService.scoreForBodyShape('triangle', 'wide', 'wide');

      expect(balanced).toBeGreaterThan(unbalanced);
    });

    it('rewards a rectangle body shape for wearing oversized silhouettes', () => {
      const rectangleScore = BodyRecommendationService.scoreForBodyShape(
        'rectangle',
        'wide',
        'wide',
      );
      const baseline = BodyRecommendationService.silhouetteScore('wide', 'wide');

      expect(rectangleScore).toBeGreaterThan(baseline);
    });

    it('never returns a score outside 0-100', () => {
      expect(
        BodyRecommendationService.scoreForBodyShape('hourglass', 'slim', 'slim'),
      ).toBeLessThanOrEqual(100);
      expect(
        BodyRecommendationService.scoreForBodyShape('oval', 'wide', 'wide'),
      ).toBeGreaterThanOrEqual(0);
    });
  });
});
