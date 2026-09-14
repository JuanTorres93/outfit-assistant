import { beforeEach, describe, expect, it } from 'vitest';

import { createTestEvent } from '@/../tests/createEntitiesTest/eventCreate';
import { eventDTOProperties } from '@/../tests/dtoProperties/eventDTOProperties';
import { Event } from '@/domain/entities/Event/Event';

import { EventDTO, toEventDTO, toEventEntity } from '../EventDTO';

describe('EventDTO', () => {
    let event: Event;
    let eventDTO: EventDTO;

    beforeEach(() => {
        event = createTestEvent();
    });

    describe('toEventDTO', () => {
        beforeEach(() => {
            eventDTO = toEventDTO(event);
        });

        it('should have a property for each event getter', () => {
            for (const getter of eventDTOProperties)
            {
                expect(eventDTO).toHaveProperty(getter);
            }
        });

        it('should convert Event to EventDTO', () => {
            expect(eventDTO).toEqual({
                id: event.id,
                name: event.name,
                location: event.location,
                date: event.date,
                userId: event.userId,
                createdAt: event.createdAt.toISOString(),
                updatedAt: event.updatedAt.toISOString(),
            });
        });
    });

    describe('toEventEntity', () => {
        beforeEach(() => {
            eventDTO = toEventDTO(event);
        });

        it('should convert EventDTO back to Event', () => {
            const eventFromDTO = toEventEntity(eventDTO);

            expect(eventFromDTO).toBeInstanceOf(Event);

            expect(eventFromDTO.id).toEqual(event.id);
            expect(eventFromDTO.name).toEqual(event.name);
            expect(eventFromDTO.location).toEqual(event.location);
            expect(eventFromDTO.date).toEqual(event.date);
            expect(eventFromDTO.userId).toEqual(event.userId);
            expect(eventFromDTO.createdAt).toEqual(event.createdAt);
            expect(eventFromDTO.updatedAt).toEqual(event.updatedAt);
        })
    })
});