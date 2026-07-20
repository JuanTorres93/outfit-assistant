export const STYLES = [
  'business',
  'casual',
  'elegant',
  'minimalist',
  'sport',
  'streetwear',
  'vintage',
] as const;

export type Style = (typeof STYLES)[number];

const COMPATIBILITY_THRESHOLD = 60;

// Symmetric pairwise compatibility, keyed by the two styles sorted alphabetically.
const PAIR_COMPATIBILITY: Record<string, number> = {
  'business|casual': 55,
  'business|elegant': 85,
  'business|minimalist': 70,
  'business|sport': 15,
  'business|streetwear': 30,
  'business|vintage': 50,
  'casual|elegant': 50,
  'casual|minimalist': 75,
  'casual|sport': 65,
  'casual|streetwear': 80,
  'casual|vintage': 65,
  'elegant|minimalist': 65,
  'elegant|sport': 10,
  'elegant|streetwear': 25,
  'elegant|vintage': 60,
  'minimalist|sport': 45,
  'minimalist|streetwear': 50,
  'minimalist|vintage': 45,
  'sport|streetwear': 60,
  'sport|vintage': 20,
  'streetwear|vintage': 55,
};

function pairKey(a: Style, b: Style): string {
  return [a, b].sort().join('|');
}

export class StyleMatcher {
  static compatibilityScore(a: Style, b: Style): number {
    if (a === b) return 100;

    return PAIR_COMPATIBILITY[pairKey(a, b)];
  }

  static isCompatible(a: Style, b: Style): boolean {
    return StyleMatcher.compatibilityScore(a, b) >= COMPATIBILITY_THRESHOLD;
  }

  static bestScoreAmong(stylesA: Style[], stylesB: Style[]): number {
    let best = 0;

    for (const a of stylesA) {
      for (const b of stylesB) {
        best = Math.max(best, StyleMatcher.compatibilityScore(a, b));
      }
    }

    return best;
  }
}
