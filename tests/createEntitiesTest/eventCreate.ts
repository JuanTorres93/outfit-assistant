import { Event, EventCreateProps } from '@/../src/domain/entities/Event/Event';
import { testUserId } from '@/../tests/createEntitiesTest/userCreate';

export const eventTestCreateProps = {
    id: 'event-id',
    name: 'Test Event',
    outfitIds: ['outfit-id-1', 'outfit-id-2'],
    location: 'Test Location',
    date: new Date(),
    userId: testUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
};

export function createTestEvent(overrideProps: Partial<EventCreateProps> = {}) {
    return Event.create({ ...eventTestCreateProps, ...overrideProps });
}