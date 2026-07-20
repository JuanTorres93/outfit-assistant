import { WeatherConstraints, WeatherFilter } from '../weather/WeatherFilter';
import {
  GarmentSlot,
  MatchableGarment,
  Occasion,
  Season,
  categoryToSlot,
} from './MatchableGarment';

export type OutfitCandidate = {
  garmentIds: string[];
};

export type GenerationCriteria = {
  season: Season;
  occasion: Occasion;
  weatherConstraints: WeatherConstraints;
};

function isEligible(garment: MatchableGarment, criteria: GenerationCriteria): boolean {
  if (!garment.season.includes(criteria.season)) return false;
  if (!garment.occasion.includes(criteria.occasion)) return false;
  if (!WeatherFilter.isWarmthAllowed(criteria.weatherConstraints, garment.warmthLevel)) {
    return false;
  }

  return true;
}

function groupBySlot(garments: MatchableGarment[]): Record<GarmentSlot, MatchableGarment[]> {
  const groups: Record<GarmentSlot, MatchableGarment[]> = {
    top: [],
    bottom: [],
    dress: [],
    outerwear: [],
    footwear: [],
    accessory: [],
  };

  for (const garment of garments) {
    groups[categoryToSlot(garment.category)].push(garment);
  }

  return groups;
}

function withOptional(items: MatchableGarment[]): (MatchableGarment | undefined)[] {
  return [undefined, ...items];
}

function toCandidate(garments: (MatchableGarment | undefined)[]): OutfitCandidate {
  return {
    garmentIds: garments
      .filter((garment): garment is MatchableGarment => garment !== undefined)
      .map((garment) => garment.id),
  };
}

export class OutfitGenerator {
  static generate(garments: MatchableGarment[], criteria: GenerationCriteria): OutfitCandidate[] {
    const eligible = garments.filter((garment) => isEligible(garment, criteria));
    const bySlot = groupBySlot(eligible);

    const candidates: OutfitCandidate[] = [];

    for (const dress of bySlot.dress) {
      for (const footwear of bySlot.footwear) {
        for (const outerwear of withOptional(bySlot.outerwear)) {
          for (const accessory of withOptional(bySlot.accessory)) {
            candidates.push(toCandidate([dress, footwear, outerwear, accessory]));
          }
        }
      }
    }

    for (const top of bySlot.top) {
      for (const bottom of bySlot.bottom) {
        for (const footwear of bySlot.footwear) {
          for (const outerwear of withOptional(bySlot.outerwear)) {
            for (const accessory of withOptional(bySlot.accessory)) {
              candidates.push(toCandidate([top, bottom, footwear, outerwear, accessory]));
            }
          }
        }
      }
    }

    return candidates;
  }
}
