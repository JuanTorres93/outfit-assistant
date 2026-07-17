import { Event, EventCreateProps } from '@/../src/domain/entities/Event/Event';
import { testUserId } from '@/../tests/createEntitiesTest/userCreate';

export const validEventProp = {
    id: 'event-id',
    name: 'Test Event',
    outfits: [
        {
            id: 'outfit-id-1',
            name: 'Outfit 1',
            items: [
                {
                    id: 'item-id-1',
                    name: 'Item 1',
                    type: 'top',
                    color: 'red',
                }
            ]
        }
    ],
    location: 'Test Location',
    date: new Date(),
    userId: testUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
};

export function createTestEvent(overrideProps: Partial<EventCreateProps> = {}) {
    return Event.create({ ...validEventProp, ...overrideProps });
}