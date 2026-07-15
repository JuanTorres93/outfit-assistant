import { describe, expect, it, beforeEach } from 'vitest';

import { validEventProp } from '@/../tests/createEntitiesTest/eventCreate';
import { Event, EventCreateProps } from '../Event';

describe("Event", () => {
    let event: Event;
    let validEventProps: EventCreateProps;

    beforeEach(() => {
        validEventProps = {
            ...validEventProp,
        };
        event = Event.create(validEventProps);
    });

    it('should create a valid event', () => {
        expect(event).toBeInstanceOf(Event);
    });

    describe('Get', () => {
        it('should return the correct id', () => {
            expect(event.id).toBe(validEventProps.id);
        });

        it('should return the correct name', () => {
            expect(event.name).toBe(validEventProps.name);
        });

        it('should return the correct outfits', () => {
            expect(event.outfits).toEqual(validEventProps.outfits);
        });
        it('should return the correct location', () => {
            expect(event.location).toBe(validEventProps.location);
        });

        it('should return the correct date', () => {
            expect(event.date).toBe(validEventProps.date);
        });

    });

})