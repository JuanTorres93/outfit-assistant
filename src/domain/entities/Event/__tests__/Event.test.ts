import { describe, expect, it, beforeEach } from 'vitest';

import { eventTestCreateProps } from '@/../tests/createEntitiesTest/eventCreate';
import { Event, EventCreateProps } from '../Event';
import { AlreadyExistsDomainError, NotFoundDomainError } from '@/domain/common/domainErrors';

describe("Event", () => {
    let event: Event;
    let validEventProps: EventCreateProps;

    beforeEach(() => {
        validEventProps = {
            ...eventTestCreateProps,
        };
        event = Event.create(validEventProps);
    });

    it('should create a valid event', () => {
        expect(event).toBeInstanceOf(Event);
    });

    describe('Creation', () => {
        it('should create event with no outfits if outfitIds is not provided', () => {
            const propsWithoutOutfitsIds = {
                ...validEventProps,
                outfitIds: undefined,
            };

            const eventWithoutOutfitIds = Event.create(propsWithoutOutfitsIds);

            expect(eventWithoutOutfitIds.outfitIds).toEqual([]);
        });

        it('should throw an error when outfitIds contains a duplicade id', () => {
            expect(() => Event.create({...validEventProps, outfitIds: ['same-outfit-id', 'same-outfit-id'],

            }),
        ).toThrow(AlreadyExistsDomainError);
        })
    })

    describe('Get', () => {
        it('should return the correct id', () => {
            expect(event.id).toBe(validEventProps.id);
        });

        it('should return the correct name', () => {
            expect(event.name).toBe(validEventProps.name);
        });

        it('should return the correct outfits', () => {
            expect(event.outfitIds).toEqual(validEventProps.outfitIds);
        });
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
        describe('Outfits', () => {
            it('should add an outfit', () => {
                const newOutfitId = 'New Outfit Id';
                event.addOutfit(newOutfitId);
                expect(event.outfitIds).toContain(newOutfitId);
            });
            it('should throw an error when adding an outfit id already in the event', () => {
                expect(() => event.addOutfit('outfit-id-1')).toThrow(AlreadyExistsDomainError);
            });
            it('should remove an outfit', () => {
                const outfitToRemove = 'outfit-id-1';
                event.removeOutfit(outfitToRemove);
                expect(event.outfitIds).not.toContain('outfit-id-1');
            });
            it('should throw an error when removing a outfit id not in the event', () => {
                expect(() => event.removeOutfit('random-id')).toThrow(NotFoundDomainError);
            })

        });
        
    });
})