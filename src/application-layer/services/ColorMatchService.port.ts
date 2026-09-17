import { Garment } from '@/domain/entities/Garment/Garment';

export interface ColorMatchService {
  getMatchingGarments(target: Garment, candidates: Garment[]): Garment[];
  getMatchingGarmentsByCategory(target: Garment, candidates: Garment[]): Record<string, Garment[]>;
  isValidColorCombination(garments: Garment[]): boolean;
}
