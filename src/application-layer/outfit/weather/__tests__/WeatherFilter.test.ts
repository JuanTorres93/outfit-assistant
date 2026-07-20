import { describe, expect, it } from 'vitest';

import { WeatherFilter } from '../WeatherFilter';

describe('WeatherFilter', () => {
  describe('getConstraints', () => {
    it('allows a moderate warmth range for a mild 18°C day, matching the sweater/jeans example', () => {
      const constraints = WeatherFilter.getConstraints({ temperatureCelsius: 18 });

      expect(constraints.minWarmthLevel).toBeGreaterThan(0);
      expect(constraints.maxWarmthLevel).toBeLessThan(10);
    });

    it('requires high warmth garments in freezing temperatures', () => {
      const constraints = WeatherFilter.getConstraints({ temperatureCelsius: -5 });

      expect(constraints.minWarmthLevel).toBeGreaterThanOrEqual(8);
    });

    it('allows only light garments in hot temperatures', () => {
      const constraints = WeatherFilter.getConstraints({ temperatureCelsius: 32 });

      expect(constraints.maxWarmthLevel).toBeLessThanOrEqual(2);
    });

    it('requires a lower warmth range in hot weather than in cold weather', () => {
      const hot = WeatherFilter.getConstraints({ temperatureCelsius: 30 });
      const cold = WeatherFilter.getConstraints({ temperatureCelsius: -5 });

      expect(hot.maxWarmthLevel).toBeLessThan(cold.minWarmthLevel);
    });

    it('requires waterproof garments when it is raining', () => {
      const constraints = WeatherFilter.getConstraints({
        temperatureCelsius: 15,
        isRaining: true,
      });

      expect(constraints.requiresWaterproof).toBe(true);
    });

    it('requires waterproof garments when it is snowing', () => {
      const constraints = WeatherFilter.getConstraints({
        temperatureCelsius: -2,
        isSnowing: true,
      });

      expect(constraints.requiresWaterproof).toBe(true);
    });

    it('does not require waterproof garments on a dry day', () => {
      const constraints = WeatherFilter.getConstraints({ temperatureCelsius: 20 });

      expect(constraints.requiresWaterproof).toBe(false);
    });

    it('requires windproof garments above the wind speed threshold', () => {
      const constraints = WeatherFilter.getConstraints({
        temperatureCelsius: 15,
        windSpeedKph: 45,
      });

      expect(constraints.requiresWindproof).toBe(true);
    });

    it('does not require windproof garments below the wind speed threshold', () => {
      const constraints = WeatherFilter.getConstraints({
        temperatureCelsius: 15,
        windSpeedKph: 10,
      });

      expect(constraints.requiresWindproof).toBe(false);
    });
  });

  describe('isWarmthAllowed', () => {
    it('returns true when a warmth level falls within the constraints', () => {
      const constraints = WeatherFilter.getConstraints({ temperatureCelsius: 18 });

      expect(WeatherFilter.isWarmthAllowed(constraints, constraints.minWarmthLevel)).toBe(true);
      expect(WeatherFilter.isWarmthAllowed(constraints, constraints.maxWarmthLevel)).toBe(true);
    });

    it('returns false when a warmth level falls outside the constraints', () => {
      const constraints = WeatherFilter.getConstraints({ temperatureCelsius: 30 });

      expect(WeatherFilter.isWarmthAllowed(constraints, 10)).toBe(false);
    });
  });
});
