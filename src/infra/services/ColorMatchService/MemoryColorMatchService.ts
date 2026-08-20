import { ColorMatchService } from '@/application-layer/services/ColorMatchService.port';
import { Garment } from '@/domain/entities/Garment/Garment';

import { ColorInfo, getColorInfo } from './colorLookup';

const NEUTRAL_PAIR_SCORE = 90;
const COMPLEMENTARY_SCORE = 85;
const ANALOGOUS_SCORE = 80;
const CLASHING_SCORE = 40;

const COMPLEMENTARY_HUE_DISTANCE = 155;
const ANALOGOUS_HUE_DISTANCE = 40;

const MAX_BRIGHTNESS_BONUS = 10;
const MAX_SCORE = 100;

const MAX_CATEGORIES = 50;

function hueDistance(hueA: number, hueB: number): number {
  const diff = Math.abs(hueA - hueB) % 360;

  return diff > 180 ? 360 - diff : diff;
}

function colorPairScore(colorA: ColorInfo, colorB: ColorInfo): number {
  if (colorA.isNeutral || colorB.isNeutral) return NEUTRAL_PAIR_SCORE;

  const distance = hueDistance(colorA.hue, colorB.hue);

  let baseScore: number;
  if (distance >= COMPLEMENTARY_HUE_DISTANCE) {
    baseScore = COMPLEMENTARY_SCORE;
  } else if (distance <= ANALOGOUS_HUE_DISTANCE) {
    baseScore = ANALOGOUS_SCORE;
  } else {
    baseScore = CLASHING_SCORE;
  }

  const brightnessDiff = Math.abs(colorA.brightness - colorB.brightness);
  const brightnessBonus = Math.min(brightnessDiff, 30) / 30 * MAX_BRIGHTNESS_BONUS;

  return Math.min(MAX_SCORE, baseScore + brightnessBonus);
}

export class MemoryColorMatchService implements ColorMatchService {
  matchScore(garmentA: Garment, garmentB: Garment): number {
    const colorsA = garmentA.colors.map(getColorInfo);
    const colorsB = garmentB.colors.map(getColorInfo);

    let best = 0;
    for (const colorA of colorsA) {
      for (const colorB of colorsB) {
        best = Math.max(best, colorPairScore(colorA, colorB));
      }
    }

    return best;
  }

  getMatchingGarments(target: Garment, candidates: Garment[]): Garment[] {
    return candidates
      .filter((candidate) => candidate.id !== target.id)
      .filter((candidate) => this.matchScore(target, candidate) >= ANALOGOUS_SCORE)
      .sort((a, b) => this.matchScore(target, b) - this.matchScore(target, a));
  }

  getMatchingGarmentsByCategory(target: Garment, candidates: Garment[]): Record<string, Garment[]> {
    const grouped: Record<string, Garment[]> = {};

    for (const garment of this.getMatchingGarments(target, candidates)) {
      const isNewCategory = !(garment.category in grouped);
      if (isNewCategory && Object.keys(grouped).length >= MAX_CATEGORIES) continue;

      (grouped[garment.category] ??= []).push(garment);
    }

    return grouped;
  }
}
