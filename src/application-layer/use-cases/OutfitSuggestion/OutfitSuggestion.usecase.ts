import { OutfitsRepo } from '@/domain/repos/OutfitsRepo.port';
import { Outfit } from '@/domain/entities/Outfit/Outfit';
import { EventsRepo } from '@/domain/repos/EventsRepo.port';
import { Event } from '@/domain/entities/Event/Event';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';

export type OutfitSuggestionUseCaseRequest = {
  season: string;
  color: string;
  event: Event;
  size: string;
  brand: string;
  material: string;
};

export class OutfitSuggestionUseCase {
  constructor(
    private outfitsRepo: OutfitsRepo, 
    private eventsRepo: EventsRepo,
    private garmentsRepo: GarmentsRepo
    ) {}

    async execute(request: OutfitSuggestionUseCaseRequest): Promise<Outfit> {
      
      const event = await this.eventsRepo.getById(request.event.id);

      const outfitIds = event?.outfitIds || [];

      const outfits: Outfit[] = [];

      const outfitsscores: number[] = [];

      for(let i = 0; i < outfitIds.length; i++) {
        const outfitId = outfitIds[i];
        const outfit = await this.outfitsRepo.getById(outfitId.toString());
        if(outfit !== null)
          outfits.push(outfit);
      }
      for(let i = 0; i < outfits.length; i++) {
        const outfit = outfits[i];

        let score = 0;
        
        for(let j = 0; j < outfit.garmentIds.length; j++) {
          const garmentId = outfit.garmentIds[j];
          const garment = await this.garmentsRepo.getById(garmentId.toString());

          if(garment !== null) {
            if(garment.colors.includes(request.color)) {
              score++;
            }
            if(garment.seasons !== undefined) {
              if(garment.seasons.includes(request.season)) {
                score++;
              }
            }
            if(garment.size !== undefined) {
              if(garment.size === request.size) {
                score++;
              }
            }
            if(garment.brand !== undefined) {
              if(garment.brand === request.brand) {
                score++;
              }
            }
            if(garment.material !== undefined) {
              if(garment.material === request.material) {
                score++;
              }
            }
          }
        }

        outfitsscores.push(score);
      }

      const maxScore = Math.max(...outfitsscores);
      const bestOutfits = outfits.filter((_, index) => outfitsscores[index] === maxScore);

      return bestOutfits[Math.floor(Math.random() * bestOutfits.length)];
      
    }
 }

