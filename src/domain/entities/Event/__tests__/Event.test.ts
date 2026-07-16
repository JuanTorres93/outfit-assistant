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

        /*it('should return the correct outfits', () => {
            expect(event.outfits).toEqual(validEventProps.outfits);
        });*/
        it('should return the correct location', () => {
            expect(event.location).toBe(validEventProps.location);
        });

        it('should return the correct date', () => {
            expect(event.date).toBeInstanceOf(Date);
        });

        it('should return the correct userId', () => {
            expect(event.userId).toBe(validEventProps.userId);
        });

        it('should return the correct createdAt', () => {
            expect(event.createdAt).toBeInstanceOf(Date);
        });

        it('should return the correct updatedAt', () => {
            expect(event.updatedAt).toBeInstanceOf(Date);
        });

    });

    describe('Update', () => {
        it('should update the name', () => {
            const newName = 'Updated Event Name';
            event.changeName(newName);
            expect(event.name).toBe(newName);
        });
        it('should update the location', () => {
            const newLocation = 'Updated Event Location';
            event.updateLocation(newLocation);
            expect(event.location).toBe(newLocation);
        });
        it('should update the date', () => {
            const newDate = new Date('2024-01-01');
            event.updateDate(newDate);
            expect(event.date).toEqual(newDate);
        });
    });
})