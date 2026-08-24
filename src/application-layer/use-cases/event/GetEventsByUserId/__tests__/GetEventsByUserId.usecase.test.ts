import { beforeEach, describe, expect, it } from 'vitest';
import { GetEventsByUserIdUseCase } from '../GetEventsByUserId.usecase';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryEventRepo } from '@/infra/repos/Memory/MemoryEventRepo';
import { createTestEvent } from '@/../tests/createEntitiesTest/eventCreate';
import { createTestUser } from '@/../tests/createEntitiesTest/userCreate';
import { MemoryUsersRepo } from '@/infra/repos/Memory/MemoryUsersRepo';

describe('GetEventsByUserIdUseCase', () => {
    let getEventsByUserIdUseCase: GetEventsByUserIdUseCase;
    let EventRepo: MemoryEventRepo;
    let UserRepo: MemoryUsersRepo;

    beforeEach(() => {
        EventRepo = new MemoryEventRepo();
        UserRepo = new MemoryUsersRepo();
        getEventsByUserIdUseCase = new GetEventsByUserIdUseCase(EventRepo);
    });

    describe('Execute', () => {
        it('should return events when found', async () => {
            const user = createTestUser();
            await UserRepo.save(user);

            const event1 = createTestEvent({id: 'event-id-1', userId: user.id});
            const event2 = createTestEvent({id: 'event-id-2', userId: user.id});

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