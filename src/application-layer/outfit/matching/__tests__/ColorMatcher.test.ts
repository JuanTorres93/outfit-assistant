import { describe, expect, it } from 'vitest';

import { Color, ColorMatcher } from '../ColorMatcher';

const white: Color = { name: 'white', hue: 0, brightness: 95, isNeutral: true };
const black: Color = { name: 'black', hue: 0, brightness: 5, isNeutral: true };
const brown: Color = { name: 'brown', hue: 30, brightness: 35, isNeutral: false };

const orange: Color = { name: 'orange', hue: 30, brightness: 80, isNeutral: false };
const blue: Color = { name: 'blue', hue: 210, brightness: 40, isNeutral: false };

const skyBlue: Color = { name: 'sky blue', hue: 200, brightness: 70, isNeutral: false };
const deepBlue: Color = { name: 'deep blue', hue: 220, brightness: 50, isNeutral: false };

const red: Color = { name: 'red', hue: 0, brightness: 60, isNeutral: false };
const green: Color = { name: 'green', hue: 120, brightness: 55, isNeutral: false };

const neonGreen: Color = { name: 'neon green', hue: 110, brightness: 90, isNeutral: false };
const darkBrown: Color = { name: 'dark brown', hue: 25, brightness: 15, isNeutral: false };

describe('ColorMatcher', () => {
  describe('isNeutral', () => {
    it('returns true for a neutral color', () => {
      expect(ColorMatcher.isNeutral(white)).toBe(true);
    });

    it('returns false for a non-neutral color', () => {
      expect(ColorMatcher.isNeutral(brown)).toBe(false);
    });
  });

  describe('isComplementary', () => {
    it('returns true for colors roughly opposite on the color wheel', () => {
      expect(ColorMatcher.isComplementary(orange, blue)).toBe(true);
    });

    it('returns false for colors close together on the color wheel', () => {
      expect(ColorMatcher.isComplementary(skyBlue, deepBlue)).toBe(false);
    });

    it('returns false when either color is neutral', () => {
      expect(ColorMatcher.isComplementary(white, black)).toBe(false);
    });
  });

  describe('isAnalogous', () => {
    it('returns true for colors close together on the color wheel', () => {
      expect(ColorMatcher.isAnalogous(skyBlue, deepBlue)).toBe(true);
    });

    it('returns false for colors roughly opposite on the color wheel', () => {
      expect(ColorMatcher.isAnalogous(orange, blue)).toBe(false);
    });

    it('returns false when either color is neutral', () => {
      expect(ColorMatcher.isAnalogous(white, black)).toBe(false);
    });
  });

  describe('contrastScore', () => {
    it('matches white shirt with black pants highly', () => {
      expect(ColorMatcher.contrastScore(white, black)).toBeGreaterThanOrEqual(90);
    });

    it('scores neutral + non-neutral pairs highly', () => {
      expect(ColorMatcher.contrastScore(white, brown)).toBeGreaterThanOrEqual(80);
    });

    it('scores complementary pairs highly', () => {
      expect(ColorMatcher.contrastScore(orange, blue)).toBeGreaterThanOrEqual(80);
    });

    it('scores analogous pairs decently', () => {
      const score = ColorMatcher.contrastScore(skyBlue, deepBlue);

      expect(score).toBeGreaterThanOrEqual(60);
      expect(score).toBeLessThan(90);
    });

    it('rejects neon green with dark brown', () => {
      expect(ColorMatcher.contrastScore(neonGreen, darkBrown)).toBeLessThan(60);
    });

    it('scores clashing non-analogous, non-complementary pairs poorly', () => {
      expect(ColorMatcher.contrastScore(red, green)).toBeLessThan(60);
    });

    it('scores clashing pairs lower than neutral pairs', () => {
      const neutralScore = ColorMatcher.contrastScore(white, black);
      const clashingScore = ColorMatcher.contrastScore(red, green);

      expect(clashingScore).toBeLessThan(neutralScore);
    });

    it('never returns a score above 100', () => {
      expect(ColorMatcher.contrastScore(white, black)).toBeLessThanOrEqual(100);
    });
  });
});
