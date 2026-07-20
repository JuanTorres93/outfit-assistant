export type Color = {
  name: string;
  hue: number;
  brightness: number;
  isNeutral: boolean;
};

const COMPLEMENTARY_MIN_ANGLE = 155;
const ANALOGOUS_MAX_ANGLE = 40;

const NEUTRAL_PAIR_SCORE = 85;
const COMPLEMENTARY_SCORE = 90;
const ANALOGOUS_SCORE = 75;
const CLASHING_SCORE = 45;
const MAX_BRIGHTNESS_BONUS = 15;

function hueDistance(hueA: number, hueB: number): number {
  const diff = Math.abs(hueA - hueB) % 360;

  return diff > 180 ? 360 - diff : diff;
}

export class ColorMatcher {
  static isNeutral(color: Color): boolean {
    return color.isNeutral;
  }

  static isComplementary(a: Color, b: Color): boolean {
    if (a.isNeutral || b.isNeutral) return false;

    return hueDistance(a.hue, b.hue) >= COMPLEMENTARY_MIN_ANGLE;
  }

  static isAnalogous(a: Color, b: Color): boolean {
    if (a.isNeutral || b.isNeutral) return false;

    return hueDistance(a.hue, b.hue) <= ANALOGOUS_MAX_ANGLE;
  }

  static contrastScore(a: Color, b: Color): number {
    const base = ColorMatcher.baseScore(a, b);
    const brightnessBonus = Math.round(
      (Math.abs(a.brightness - b.brightness) / 100) * MAX_BRIGHTNESS_BONUS,
    );

    return Math.min(100, base + brightnessBonus);
  }

  private static baseScore(a: Color, b: Color): number {
    if (a.isNeutral || b.isNeutral) return NEUTRAL_PAIR_SCORE;
    if (ColorMatcher.isComplementary(a, b)) return COMPLEMENTARY_SCORE;
    if (ColorMatcher.isAnalogous(a, b)) return ANALOGOUS_SCORE;

    return CLASHING_SCORE;
  }
}
