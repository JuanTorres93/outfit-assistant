import { beforeEach, describe, expect, it } from 'vitest';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { OutfitSuggestionByEventUseCase } from '../OutfitSuggestionByEvent.usecase';
import { EventsRepo } from '@/domain/repos/EventsRepo.port';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';
import { OutfitsRepo } from '@/domain/repos/OutfitsRepo.port';
import { ClosetsRepo } from '@/domain/repos/ClosetsRepo.port';
import { MemoryOutfitsRepo } from '@/infra/repos/Memory/MemoryOutfitsRepo';
import { MemoryEventRepo } from '@/infra/repos/Memory/MemoryEventRepo';
import { MemoryGarmentRepo } from '@/infra/repos/Memory/MemoryGarmentRepo';
import { MemoryClosetsRepo } from '@/infra/repos/Memory/MemoryClosetsRepo';
import { createTestEvent } from 'tests/createEntitiesTest/eventCreate';
import { MemoryOutfitSuggestionByEventService } from '@/infra/services/OutfitSuggestionByEvent/MemoryOutfitSuggestionByEvent';
import { OutfitSuggestionByEventService } from '@/application-layer/services/OutfitSuggestionByEventService';
import { createTestUser, userTestCreateProps } from 'tests/createEntitiesTest/userCreate';

describe('OutfitSuggestionUseCase', () => {
  let outfitSuggestionByEventUseCase: OutfitSuggestionByEventUseCase;
  let outfitSuggestionByEventService: OutfitSuggestionByEventService;

  
  let outfitsRepo: OutfitsRepo;
  let eventsRepo: EventsRepo;
  let garmentsRepo: GarmentsRepo;
  let closetsRepo: ClosetsRepo;

  beforeEach(() => {
    outfitsRepo = new MemoryOutfitsRepo();
    eventsRepo = new MemoryEventRepo();
    garmentsRepo = new MemoryGarmentRepo();
    closetsRepo = new MemoryClosetsRepo();
    outfitSuggestionByEventService = new MemoryOutfitSuggestionByEventService();
    outfitSuggestionByEventUseCase = new OutfitSuggestionByEventUseCase(outfitsRepo, eventsRepo, garmentsRepo, closetsRepo, outfitSuggestionByEventService);
  });

    describe('Execute', () => {
        it('should return the best outfit for the users needs', async () => {
            const event = createTestEvent();
            await eventsRepo.save(event);
            const user = createTestUser();

            const result = await outfitSuggestionByEventUseCase.execute({
                eventId: event.id,
                userId: user.id
            });
            expect(result).toBeDefined();
        });
    });

    describe('Errors', () => {
        it('should throw NotFoundDomainError when event is not found', async () => {
            const user = createTestUser();
            await expect(() => outfitSuggestionByEventUseCase.execute({
                eventId: 'doesnt-exist',
                userId: user.id,
            })).rejects.toThrow(NotFoundDomainError);
        });
        it('should throw NotFoundDomainError when user is not found', async () => {
            const event = createTestEvent();
            await expect(() => outfitSuggestionByEventUseCase.execute({
                eventId: event.id,
                userId: 'doesnt-exist',
            })).rejects.toThrow(NotFoundDomainError);
        });
    });
});