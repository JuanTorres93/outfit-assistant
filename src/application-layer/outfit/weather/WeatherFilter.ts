export type WeatherConditions = {
  temperatureCelsius: number;
  isRaining?: boolean;
  isSnowing?: boolean;
  windSpeedKph?: number;
};

export type WeatherConstraints = {
  minWarmthLevel: number;
  maxWarmthLevel: number;
  requiresWaterproof: boolean;
  requiresWindproof: boolean;
};

const WINDPROOF_THRESHOLD_KPH = 30;

// Warmth levels are on the same 0 (lightest) - 10 (warmest) scale as Garment.warmthLevel.
const TEMPERATURE_BANDS: { maxCelsius: number; minWarmthLevel: number; maxWarmthLevel: number }[] =
  [
    { maxCelsius: 0, minWarmthLevel: 8, maxWarmthLevel: 10 },
    { maxCelsius: 9, minWarmthLevel: 6, maxWarmthLevel: 9 },
    { maxCelsius: 15, minWarmthLevel: 4, maxWarmthLevel: 7 },
    { maxCelsius: 21, minWarmthLevel: 2, maxWarmthLevel: 5 },
    { maxCelsius: 27, minWarmthLevel: 0, maxWarmthLevel: 3 },
    { maxCelsius: Infinity, minWarmthLevel: 0, maxWarmthLevel: 1 },
  ];

export class WeatherFilter {
  static getConstraints(conditions: WeatherConditions): WeatherConstraints {
    const band = TEMPERATURE_BANDS.find(
      (candidate) => conditions.temperatureCelsius <= candidate.maxCelsius,
    )!;

    return {
      minWarmthLevel: band.minWarmthLevel,
      maxWarmthLevel: band.maxWarmthLevel,
      requiresWaterproof: Boolean(conditions.isRaining || conditions.isSnowing),
      requiresWindproof: (conditions.windSpeedKph ?? 0) >= WINDPROOF_THRESHOLD_KPH,
    };
  }

  static isWarmthAllowed(constraints: WeatherConstraints, warmthLevel: number): boolean {
    return warmthLevel >= constraints.minWarmthLevel && warmthLevel <= constraints.maxWarmthLevel;
  }
}
