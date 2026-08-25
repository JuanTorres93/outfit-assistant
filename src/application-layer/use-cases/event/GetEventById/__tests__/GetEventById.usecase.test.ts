import { beforeEach, describe, expect, it } from 'vitest';
import { GetEventByIdUseCase } from '../GetEventById.usecase';
import { eventDTOProperties } from '@/../tests/dtoProperties/eventDTOProperties';
import { toEventDTO } from '@/application-layer/dtos/EventDTO';
import { Event } from '@/domain/entities/Event/Event';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryEventRepo } from '@/infra/repos/Memory/MemoryEventRepo';
import { createTestEvent } from '@/../tests/createEntitiesTest/eventCreate';

describe('GetEventByIdUseCase', () => {
    let getEventByIdUseCase: GetEventByIdUseCase;
    let eventRepo: MemoryEventRepo;


    beforeEach(() => {
        eventRepo = new MemoryEventRepo();
        getEventByIdUseCase = new GetEventByIdUseCase(eventRepo);
    });

    describe('Execute', () => {
        it('should return an event when found', async () => {
            const event = createTestEvent();

            await eventRepo.save(event);

            const result = await getEventByIdUseCase.execute({ eventId: event.id });

            expect(result).toEqual(toEventDTO(event));
        });

        it('should return event DTO when found', async () => {
            const event = createTestEvent();

            await eventRepo.save(event);

            const result = await getEventByIdUseCase.execute({ eventId: event.id });

            for(const prop of eventDTOProperties)
            {
                expect(result).not.toBeInstanceOf(Event);
                expect(result).toHaveProperty(prop);
            }
        })
    });

    describe('Errors', () => {
        it('should throw NotFoundDomainError when event is not found', async () => {
            await expect(() => getEventByIdUseCase.execute({ eventId: 'non-existent-id' })).rejects.toThrow(NotFoundDomainError);
        });
    });
});