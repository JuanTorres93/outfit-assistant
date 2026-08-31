import { OutfitSuggestionByEventService } from '@/application-layer/services/OutfitSuggestionByEventService';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { Garment } from '@/domain/entities/Garment/Garment';
import { Outfit } from '@/domain/entities/Outfit/Outfit';
import { ClosetsRepo } from '@/domain/repos/ClosetsRepo.port';
import { EventsRepo } from '@/domain/repos/EventsRepo.port';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';
import { CryptoUUIDIdGenerator } from '@/infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator';

export type OutfitSuggestionByEventUseCaseRequest = {
  eventId: string;
  userId: string;
};

export class OutfitSuggestionByEventUseCase {
  constructor(
    private eventsRepo: EventsRepo,
    private garmentsRepo: GarmentsRepo,
    private closetsRepo: ClosetsRepo,
    private outfitSuggestionByEventService: OutfitSuggestionByEventService,
    private idGenerator: CryptoUUIDIdGenerator,
  ) {}

  async execute(request: OutfitSuggestionByEventUseCaseRequest): Promise<Outfit> {
    const [event, userCloset] = await Promise.all([
      this.eventsRepo.getById(request.eventId),
      this.closetsRepo.getByUserId(request.userId),
    ]);

    const hydratedGarments = await Promise.all(
      (userCloset?.garmentIds || []).map((garmentId) => this.garmentsRepo.getById(garmentId)),
    );
    const userGarments = hydratedGarments.filter((garment): garment is Garment => garment !== null);

    if (userCloset === null) {
      throw new NotFoundDomainError('User has no closet.');
    }

    if (userGarments.length === 0) {
      throw new NotFoundDomainError('User has no garments in their closet.');
    } else {
      if (event === null) {
        throw new NotFoundDomainError('Event not found.');
      }

      const filteredGarments = await this.outfitSuggestionByEventService.suggestOutfitForEvent(
        userGarments,
        event,
      );

      const garmentIds = filteredGarments.map((garment) => garment.id);

      return Outfit.create({
        id: this.idGenerator.generateId(),
        userId: request.userId,
        name: 'Suggested Outfit for Event',
        garmentIds: garmentIds,
      });
    }
  }
}
