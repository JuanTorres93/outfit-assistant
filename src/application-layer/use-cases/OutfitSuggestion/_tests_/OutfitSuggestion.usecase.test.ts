import { beforeEach, describe, expect, it } from 'vitest';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { OutfitSuggestionUseCase } from '../OutfitSuggestion.usecase';
import { EventsRepo } from '@/domain/repos/EventsRepo.port';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';
import { OutfitsRepo } from '@/domain/repos/OutfitsRepo.port';
import { MemoryOutfitsRepo } from '@/infra/repos/Memory/MemoryOutfitsRepo';
import { MemoryEventRepo } from '@/infra/repos/Memory/MemoryEventRepo';
import { MemoryGarmentRepo } from '@/infra/repos/Memory/MemoryGarmentRepo';
import { createTestEvent } from 'tests/createEntitiesTest/eventCreate';

describe('OutfitSuggestionUseCase', () => {
  let outfitSuggestionUseCase: OutfitSuggestionUseCase;

    let outfitsRepo: OutfitsRepo;
    let eventsRepo: EventsRepo;
    let garmentsRepo: GarmentsRepo;

  beforeEach(() => {
    outfitsRepo = new MemoryOutfitsRepo();
    eventsRepo = new MemoryEventRepo();
    garmentsRepo = new MemoryGarmentRepo();
    outfitSuggestionUseCase = new OutfitSuggestionUseCase(outfitsRepo, eventsRepo, garmentsRepo);
  });

    describe('Execute', () => {
        it('should return the best outfit for the users needs', async () => {
            const event = createTestEvent();
            await eventsRepo.save(event);

            const result = await outfitSuggestionUseCase.execute({
                season: 'summer',
                color: 'red',
                event: { id: event.id } as any,
                size: 'M',
                brand: 'Nike',
                material: 'cotton'
            });
            expect(result).toBeDefined();
        });
    });

    describe('Errors', () => {
        it('should throw NotFoundDomainError when event is not found', async () => {
            await expect(() => outfitSuggestionUseCase.execute({
                season: 'summer',
                color: 'red',
                event: { id: 'non-existent-id' } as any,
                size: 'M',
                brand: 'Nike',
                material: 'cotton'
            })).rejects.toThrow(NotFoundDomainError);
        });
    });
});