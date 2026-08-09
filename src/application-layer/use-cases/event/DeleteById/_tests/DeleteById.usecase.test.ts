import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteEventByIdUseCase } from '../DeleteById.usecase';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryEventRepo } from '@/infra/repos/Memory/MemoryEventRepo';
import { createTestEvent } from 'tests/createEntitiesTest/eventCreate';

describe('DeleteEventByIdUseCase', () => {
    let deleteEventByIdUseCase: DeleteEventByIdUseCase;
    let EventRepo: MemoryEventRepo;

    beforeEach(() => {
        EventRepo = new MemoryEventRepo();
        deleteEventByIdUseCase = new DeleteEventByIdUseCase(EventRepo);
    });

    describe('Execute', () => {
        it('should delete an event when found', async () => {
            const event = createTestEvent();
            await EventRepo.save(event);

            await deleteEventByIdUseCase.execute({ eventId: event.id });

            const deletedEvent = await EventRepo.getById(event.id);
            expect(deletedEvent).toBeUndefined();
        });
    });

    describe('Errors', () => {
        it('should throw NotFoundDomainError when event is not found', async () => {
            await expect(() => deleteEventByIdUseCase.execute({ eventId: 'non-existent-id' })).rejects.toThrow(NotFoundDomainError);
        });
    });
});