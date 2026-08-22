import { Garment } from '@/domain/entities/Garment/Garment';
import { Season } from '@/domain/value-objects/Season/Season';

export interface GarmentsBySeasonService {
  getGarmentsBySeason(
    garments: Garment[],
    season: Season,
  ): Garment[];
}