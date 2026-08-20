import { beforeEach, describe, expect, it } from 'vitest';
import { GetEventsByUserIdUseCase } from '../GetEventsByUserId.usecase';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryEventRepo } from '@/infra/repos/Memory/MemoryEventRepo';
import { createTestEvent } from '@/../tests/createEntitiesTest/eventCreate';

describe('GetEventsByUserIdUseCase', () => {
    let getEventsByUserIdUseCase: GetEventsByUserIdUseCase;
    let EventRepo: MemoryEventRepo;

    beforeEach(() => {
        EventRepo = new MemoryEventRepo();
        getEventsByUserIdUseCase = new GetEventsByUserIdUseCase(EventRepo);
    });

    describe('Execute', () => {
        it('should return events when found', async () => {
            const event1 = createTestEvent();
            const event2 = createTestEvent();
            
            await EventRepo.save(event1);
            await EventRepo.save(event2);

            const result = await getEventsByUserIdUseCase.execute({ userId: event1.userId });

            expect(result).toEqual([event1, event2]);
        });
    });

    describe('Errors', () => {
        it('should throw NotFoundDomainError when userId is not provided', async () => {
            await expect(() => getEventsByUserIdUseCase.execute({ userId: '' })).rejects.toThrow(NotFoundDomainError);
        });
    });
});