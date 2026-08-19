import { OutfitsRepo } from '@/domain/repos/OutfitsRepo.port';
import { Outfit } from '@/domain/entities/Outfit/Outfit';
import { EventsRepo } from '@/domain/repos/EventsRepo.port';
import { Event } from '@/domain/entities/Event/Event';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';
import { OutfitSuggestionByEventService } from '@/application-layer/services/OutfitSuggestionByEventService';
import { Garment } from '@/domain/entities/Garment/Garment';
import { ClosetsRepo } from '@/domain/repos/ClosetsRepo.port';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { CreateOutfitUsecase } from '../outfit/CreateOutfit/CreateOutfit.usecase';

export type OutfitSuggestionByEventUseCaseRequest = {  
  eventId: string;
  userId: string;
};

export class OutfitSuggestionByEventUseCase {
  constructor(
    private outfitsRepo: OutfitsRepo, 
    private eventsRepo: EventsRepo,
    private garmentsRepo: GarmentsRepo,
    private closetsRepo: ClosetsRepo,
    private outfitSuggestionByEventService: OutfitSuggestionByEventService,
    private createOutfitUseCase: CreateOutfitUsecase,
    ) {}

    async execute(request: OutfitSuggestionByEventUseCaseRequest): Promise<Outfit> {
      
      const event = await this.eventsRepo.getById(request.eventId);

      const userCloset = await this.closetsRepo.getByUserId(request.userId);

      const userGarments: Garment[] = [];

      for(const garmentId of userCloset?.garmentIds || []) {
        const garment = await this.garmentsRepo.getById(garmentId);
        userGarments.push(garment as Garment);
      }

      if (userGarments === undefined || userGarments.length === 0) {
        throw new NotFoundDomainError('User has no garments.');
      }
      else
      {
        if(event === null)
        {
          throw new NotFoundDomainError('Event not found.');
        }
        else
        {
          const filteredGarments = await this.outfitSuggestionByEventService.suggestOufitForEvent(userGarments, event);

          const garmentIds: string[] = [];

          for(let i = 0; i <= filteredGarments.length; i++)
          {
            garmentIds.push(filteredGarments[i].id);
          } 

          return this.createOutfitUseCase.execute({
            userId: request.userId, 
            name: 'Suggested Outfit for Event', 
            garmentIds: garmentIds
          });
        } 
      }
      
    }
 }

