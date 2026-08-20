import { Garment } from '@/domain/entities/Garment/Garment';

export interface ColorMatchService {
  matchScore(garmentA: Garment, garmentB: Garment): number;
  getMatchingGarments(target: Garment, candidates: Garment[]): Garment[];
  getMatchingGarmentsByCategory(target: Garment, candidates: Garment[]): Record<string, Garment[]>;
}
