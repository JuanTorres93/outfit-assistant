import { describe, expect, it } from 'vitest';

import { OutfitScorer } from '../OutfitScorer';

describe('OutfitScorer', () => {
  it('returns 100 when every component is perfect', () => {
    const score = OutfitScorer.score({
      colorScore: 100,
      weatherScore: 100,
      occasionScore: 100,
      styleScore: 100,
      preferenceScore: 100,
    });

    expect(score).toBe(100);
  });

  it('returns 0 when every component (including preference) is at its worst', () => {
    const score = OutfitScorer.score({
      colorScore: 0,
      weatherScore: 0,
      occasionScore: 0,
      styleScore: 0,
      preferenceScore: 0,
    });

    expect(score).toBe(0);
  });

  it('defaults preferenceScore to a neutral 50 when the user has no history yet', () => {
    const withDefault = OutfitScorer.score({
      colorScore: 0,
      weatherScore: 0,
      occasionScore: 0,
      styleScore: 0,
    });

    const withExplicitNeutral = OutfitScorer.score({
      colorScore: 0,
      weatherScore: 0,
      occasionScore: 0,
      styleScore: 0,
      preferenceScore: 50,
    });

    expect(withDefault).toBe(withExplicitNeutral);
  });

  it('weighs color the heaviest, matching the 30/20/20/20/10 split', () => {
    const highColor = OutfitScorer.score({
      colorScore: 100,
      weatherScore: 0,
      occasionScore: 0,
      styleScore: 0,
      preferenceScore: 0,
    });

    const highStyle = OutfitScorer.score({
      colorScore: 0,
      weatherScore: 0,
      occasionScore: 0,
      styleScore: 100,
      preferenceScore: 0,
    });

    expect(highColor).toBeGreaterThan(highStyle);
  });

  it('rounds to the nearest whole number', () => {
    const score = OutfitScorer.score({
      colorScore: 91,
      weatherScore: 87,
      occasionScore: 79,
      styleScore: 83,
      preferenceScore: 60,
    });

    expect(Number.isInteger(score)).toBe(true);
  });
});
