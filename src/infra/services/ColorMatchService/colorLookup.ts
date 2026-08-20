export type ColorInfo = {
  hue: number;
  brightness: number;
  isNeutral: boolean;
};

export const neutralColorInfo: ColorInfo = {
  hue: 0,
  brightness: 50,
  isNeutral: true,
};

const colorLookup: Record<string, ColorInfo> = {
  white: { hue: 0, brightness: 100, isNeutral: true },
  black: { hue: 0, brightness: 0, isNeutral: true },
  gray: { hue: 0, brightness: 50, isNeutral: true },
  grey: { hue: 0, brightness: 50, isNeutral: true },
  beige: { hue: 40, brightness: 85, isNeutral: true },
  cream: { hue: 45, brightness: 92, isNeutral: true },
  ivory: { hue: 50, brightness: 96, isNeutral: true },
  tan: { hue: 35, brightness: 70, isNeutral: true },
  khaki: { hue: 55, brightness: 75, isNeutral: true },
  navy: { hue: 220, brightness: 25, isNeutral: true },
  denim: { hue: 210, brightness: 45, isNeutral: true },
  brown: { hue: 25, brightness: 35, isNeutral: true },
  silver: { hue: 0, brightness: 75, isNeutral: true },

  red: { hue: 0, brightness: 50, isNeutral: false },
  maroon: { hue: 0, brightness: 30, isNeutral: false },
  pink: { hue: 330, brightness: 80, isNeutral: false },
  orange: { hue: 30, brightness: 60, isNeutral: false },
  gold: { hue: 45, brightness: 65, isNeutral: false },
  yellow: { hue: 55, brightness: 80, isNeutral: false },
  olive: { hue: 70, brightness: 40, isNeutral: false },
  green: { hue: 120, brightness: 45, isNeutral: false },
  teal: { hue: 180, brightness: 40, isNeutral: false },
  turquoise: { hue: 175, brightness: 65, isNeutral: false },
  blue: { hue: 220, brightness: 55, isNeutral: false },
  purple: { hue: 280, brightness: 40, isNeutral: false },
  lavender: { hue: 260, brightness: 80, isNeutral: false },
  violet: { hue: 270, brightness: 50, isNeutral: false },
};

export function getColorInfo(colorName: string): ColorInfo {
  const normalized = colorName.trim().toLowerCase();

  return colorLookup[normalized] ?? neutralColorInfo;
}
