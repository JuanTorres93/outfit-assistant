import { beforeEach, describe, expect, it } from 'vitest';
import { GetEventByIdUseCase } from '../GetEventById.usecase';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryEventRepo } from '@/infra/repos/Memory/MemoryEventRepo';
import { createTestEvent } from 'tests/createEntitiesTest/eventCreate';

describe('GetEventByIdUseCase', () => {
    let getEventByIdUseCase: GetEventByIdUseCase;
    let EventRepo: MemoryEventRepo;


    beforeEach(() => {
        EventRepo = new MemoryEventRepo();
        getEventByIdUseCase = new GetEventByIdUseCase(EventRepo);
    });

    describe('Execute', () => {
        it('should return an event when found', async () => {
            const event = createTestEvent();

            await EventRepo.save(event);

            const result = await getEventByIdUseCase.execute({ eventId: event.id });

            expect(result).toEqual(event);
        });
    });

    describe('Errors', () => {
        it('should throw NotFoundDomainError when event is not found', async () => {
            await expect(() => getEventByIdUseCase.execute({ eventId: 'non-existent-id' })).rejects.toThrow(NotFoundDomainError);
        });
    });
});