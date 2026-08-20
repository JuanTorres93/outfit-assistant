import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteEventByIdUseCase } from '../DeleteById.usecase';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryEventRepo } from '@/infra/repos/Memory/MemoryEventRepo';
import { createTestEvent } from '@/../tests/createEntitiesTest/eventCreate';
import { Event } from '@/domain/entities/Event/Event';
import { eventTestCreateProps } from '@/../tests/createEntitiesTest/eventCreate';

describe('DeleteEventByIdUseCase', () => {
    let deleteEventByIdUseCase: DeleteEventByIdUseCase;
    let eventRepo: MemoryEventRepo;
    let event: Event;

    beforeEach(async () => {
        eventRepo = new MemoryEventRepo();
        deleteEventByIdUseCase = new DeleteEventByIdUseCase(eventRepo);
        event = Event.create({...eventTestCreateProps, });
        await eventRepo.save(event);
        
    });

    describe('Execute', () => {
        it('should delete an event when found', async () => {
            await deleteEventByIdUseCase.execute({ eventId: event.id });

            const deletedEvent = await eventRepo.getById(event.id);
            expect(deletedEvent).toBeNull();
        });
    });

    describe('Side Effects', () => {
        it('should have the event removed from the repository', async () => {
            const eventsBefore = await eventRepo.getAll();
            expect(eventsBefore.length).toBe(1);

            await deleteEventByIdUseCase.execute({
                eventId: 'event-id',
            });
            const eventsAfter = await eventRepo.getAll();
            expect(eventsAfter.length).toBe(0);
        });
    });

    

    describe('Errors', () => {
        it('should throw NotFoundDomainError when event is not found', async () => {
            await expect(() => deleteEventByIdUseCase.execute({ eventId: 'non-existent-id' })).rejects.toThrow(NotFoundDomainError);
        });
    });
});