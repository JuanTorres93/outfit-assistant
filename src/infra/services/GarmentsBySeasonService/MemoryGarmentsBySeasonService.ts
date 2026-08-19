import { GarmentsBySeasonService } from '@/application-layer/services/GarmentsBySeasonService.port';
import { Garment } from '@/domain/entities/Garment/Garment';
import { Season } from '@/domain/value-objects/Season/Season';

const compatibleSeasons = {
  spring: ['spring', 'summer', 'winter'],
  summer: ['summer', 'spring', 'autumn'],
  autumn: ['autumn', 'summer', 'winter'],
  winter: ['winter', 'autumn', 'spring'],
};

export class MemoryGarmentsBySeasonService implements GarmentsBySeasonService {
  getGarmentsBySeason(garments: Garment[], season: Season): Garment[] {
    const result: Garment[] = [];

    const seasons = compatibleSeasons[season.value as keyof typeof compatibleSeasons];

    garments.forEach((garment) => {
      if (garment.seasons?.some((garmentSeason) => seasons.includes(garmentSeason))) {
        result.push(garment);
      }
    });

    return result;
  }
}
