import { beforeEach, describe, expect, it } from 'vitest';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { OutfitSuggestionByEventUseCase } from '../OutfitSuggestionByEvent.usecase';
import { EventsRepo } from '@/domain/repos/EventsRepo.port';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { ClosetsRepo } from '@/domain/repos/ClosetsRepo.port';
import { MemoryEventRepo } from '@/infra/repos/Memory/MemoryEventRepo';
import { MemoryGarmentRepo } from '@/infra/repos/Memory/MemoryGarmentRepo';
import { MemoryClosetsRepo } from '@/infra/repos/Memory/MemoryClosetsRepo';
import { MemoryUsersRepo } from '@/infra/repos/Memory/MemoryUsersRepo';
import { createTestEvent } from '@/../tests/createEntitiesTest/eventCreate';
import { MemoryOutfitSuggestionByEventService } from '@/infra/services/OutfitSuggestionByEvent/MemoryOutfitSuggestionByEvent';
import { OutfitSuggestionByEventService } from '@/application-layer/services/OutfitSuggestionByEventService';
import { createTestUser } from '@/../tests/createEntitiesTest/userCreate';
import { CryptoUUIDIdGenerator } from '@/infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator';
import { createTestCloset } from '@/../tests/createEntitiesTest/closetCreate';
import { createTestGarment } from '@/../tests/createEntitiesTest/garmentCreate';

describe('OutfitSuggestionUseCase', () => {
  let outfitSuggestionByEventUseCase: OutfitSuggestionByEventUseCase;
  let outfitSuggestionByEventService: OutfitSuggestionByEventService;

  
  let eventsRepo: EventsRepo;
  let garmentsRepo: GarmentsRepo;
  let closetsRepo: ClosetsRepo;
  let usersRepo: UsersRepo;
  let idGenerator: CryptoUUIDIdGenerator;

  beforeEach(() => {
    eventsRepo = new MemoryEventRepo();
    garmentsRepo = new MemoryGarmentRepo();
    closetsRepo = new MemoryClosetsRepo();
    usersRepo = new MemoryUsersRepo();
    idGenerator = new CryptoUUIDIdGenerator();
    outfitSuggestionByEventService = new MemoryOutfitSuggestionByEventService();
    outfitSuggestionByEventUseCase = new OutfitSuggestionByEventUseCase(eventsRepo, garmentsRepo, closetsRepo, outfitSuggestionByEventService, idGenerator);
  });

    describe('Execute', () => {
        it('should return the best outfit for the users needs', async () => {
            const event = createTestEvent();
            await eventsRepo.save(event);
            const user = createTestUser();
            await usersRepo.save(user);
            const garment1 = createTestGarment({id: 'garment-id-1'});
            await garmentsRepo.save(garment1);
            const garment2 = createTestGarment({id: 'garment-id-2'});
            await garmentsRepo.save(garment2);
            

            const closet = createTestCloset( {garmentIds: [garment1.id, garment2.id] });
            await closetsRepo.save(closet);

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