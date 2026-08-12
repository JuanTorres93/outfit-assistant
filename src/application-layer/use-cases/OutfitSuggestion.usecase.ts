import { OutfitsRepo } from '@/domain/repos/OutfitsRepo.port';
import { Outfit } from '@/domain/entities/Outfit/Outfit';
import { EventsRepo } from '@/domain/repos/EventsRepo.port';
import { Event } from '@/domain/entities/Event/Event';

export type OutfitSuggestionUseCaseRequest = {
  date: Date;
  season: string;
  color: string;
  event?: Event;
  size: string;
};

export class OutfitSuggestionUseCase {
  constructor(
    private outfitsRepo: OutfitsRepo, 
    private eventsRepo: EventsRepo,
    ) {}

    async execute(request: OutfitSuggestionUseCaseRequest): Promise<Outfit> {
      if(request.event) {
        const event = await this.eventsRepo.getById(request.event.id);

        const outfitIds = event?.outfitIds || [];

        const outfits: Outfit[] = [];

        for(let i = 0; i < outfitIds.length; i++) {
          const outfitId = outfitIds[i];
          const outfit = await this.outfitsRepo.getById(outfitId.toString());
          if(outfit !== null)
            outfits.push(outfit);
        }
        for(let i = 0; i < outfits.length; i++) {
          const outfit = outfits[i];
        }
    }
  }
}
