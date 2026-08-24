import { beforeEach, describe, expect, it } from 'vitest';

import { createTestEvent } from '@/../tests/createEntitiesTest/eventCreate';
import { eventDTOProperties } from '@/../tests/dtoProperties/eventDTOProperties';
import { Event } from '@/domain/entities/Event/Event';

import { EventDTO, toEventDTO } from '../EventDTO';

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
});