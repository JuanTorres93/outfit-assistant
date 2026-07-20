import { Fit } from '../body/BodyRecommendationService';
import { Color } from '../matching/ColorMatcher';
import { Style } from '../matching/StyleMatcher';

export const GARMENT_CATEGORIES = [
  'shirt',
  'pants',
  'jacket',
  'dress',
  'shoes',
  'accessory',
] as const;

export type GarmentCategory = (typeof GARMENT_CATEGORIES)[number];

export const GARMENT_SLOTS = [
  'top',
  'bottom',
  'outerwear',
  'dress',
  'footwear',
  'accessory',
] as const;

export type GarmentSlot = (typeof GARMENT_SLOTS)[number];

const CATEGORY_TO_SLOT: Record<GarmentCategory, GarmentSlot> = {
  shirt: 'top',
  pants: 'bottom',
  jacket: 'outerwear',
  dress: 'dress',
  shoes: 'footwear',
  accessory: 'accessory',
};

export function categoryToSlot(category: GarmentCategory): GarmentSlot {
  return CATEGORY_TO_SLOT[category];
}

export const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;

export type Season = (typeof SEASONS)[number];

export const OCCASIONS = ['office', 'party', 'wedding', 'gym', 'casual'] as const;

export type Occasion = (typeof OCCASIONS)[number];

/**
 * The subset of a Garment's data this application layer needs in order to
 * generate and score outfits. See design/garment-contract.md for the full
 * write-up of why each field is required and its exact value range.
 */
export type MatchableGarment = {
  id: string;
  category: GarmentCategory;
  color: Color;
  style: Style[];
  season: Season[];
  occasion: Occasion[];
  fit: Fit;
  warmthLevel: number;
  isWaterproof?: boolean;
  isWindproof?: boolean;
};
