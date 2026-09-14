import { afterAll, beforeAll, beforeEach, describe, it, expect } from 'vitest';

import { createTestEvent } from "@/../tests/createEntitiesTest/eventCreate";

import { Event } from '@/domain/entities/Event/Event';

import { MemoryEventRepo } from '../Memory/MemoryEventRepo';

import { clearMongoTestDB, setupMongoTestDB, teardownMongoTestDB } from '../mongoose/__tests__/setupMongoTestDB';
import { MongooseEventsRepo } from '../mongoose/repos/MongooseEventRepo';
import { after } from 'node:test';

const repos = [
    { name: 'MemoryEventRepo', repoClass: MemoryEventRepo },
    { name: 'MongooseEventsRepo', repoClass: MongooseEventsRepo},
];

repos.forEach(({ name, repoClass }) => {
    describe(name, () => {
        let repo: InstanceType<typeof repoClass>;
        let event: Event;

        beforeAll(async () => {
            if (name === 'MongooseEventsRepo') await setupMongoTestDB();
        });

        beforeEach(async () => {
            if (name === 'MongooseEventsRepo') await clearMongoTestDB();

            event = createTestEvent();

            repo = new repoClass();

            await repo.save(event);
        });

        afterAll(async () => {
            if(name === 'MongooseEventsRepo') await teardownMongoTestDB();
        })

        describe('getAll', () => {
            it('should return all events', async () => {
                const events = await repo.getAll();

                expect(events).toEqual([event]);
            });

            it('should return an empty array if no events are saved', async () => {
                if (name === 'MongooseEventsRepo') await clearMongoTestDB();
                
                const emptyRepo = new repoClass();

                const events = await emptyRepo.getAll();

                expect(events).toEqual([]);
            });
        });

        describe('save', () => {
            it('should save an event', async() => 
            {
                const newEvent = createTestEvent({ id: 'new-event-id'});

                const eventsBefore = await repo.getAll();

                const eventIdsBefore = eventsBefore.map(event => event.id);
                const numberOfEventsBefore = eventsBefore.length;

                expect(eventIdsBefore).not.toContain(newEvent.id);

                await repo.save(newEvent);

                const eventsAfter = await repo.getAll();
                const eventIdsAfter = eventsAfter.map(event => event.id);

                expect(eventIdsAfter).toContain(newEvent.id);
                expect(eventsAfter.length).toBe(numberOfEventsBefore + 1);
            });
        });

        describe('getById', () => {
            it('should return an event by id', async() => {
                const foundEvent = await repo.getById(event.id);

                expect(foundEvent).toEqual(event);
            });

            it('should return null if event is not found', async() => {
                const foundEvent = await repo.getById('id-that-doesnt-exist');

                expect(foundEvent).toBeNull();
            });
        });

        describe('getMultipleByIds', () => {
            it('should return the events in the same order as the given ids', async () => {
                const otherEvent = createTestEvent({ id: 'other-event-id', userId: 'other-user-id'});

                await repo.save(otherEvent);

                const foundEvents = await repo.getMultipleByIds([otherEvent.id, event.id]);

                expect(foundEvents).toEqual([otherEvent, event]);
            });

            it('should return null for ids that do not exist', async() => {
                const foundEvents = await repo.getMultipleByIds([event.id, 'non-existent-id']);

                expect(foundEvents).toEqual([event, null]);
            });

            it('should return an empty array for an empty id list', async () => {
                const foundEvents = await repo.getMultipleByIds([]);

                expect(foundEvents).toEqual([]);
            })
        });

        describe('getByUserId', () => {
            it('should return all events made by user id', async() => {
                const foundEvents = await repo.getByUserId(event.userId);

                expect(foundEvents).toEqual([event]);
            });

            it('should return an empty array if no events are found for the user id', async() => {
                const foundEvents = await repo.getByUserId('user-id-that-doesnt-exist');

                expect(foundEvents).toBeNull;
            })
        })

        describe('deleteById', () => {
            it('should delete an event by id', async () => {
                await repo.deleteById(event.id);

                const foundEvent = await repo.getById(event.id);
                expect(foundEvent).toBeNull
            })
            it('should do nothing if event is not found', async () => {
                const eventsBefore = await repo.getAll();
                
                await repo.deleteById('id-that-doesnt-exist');

                const eventsAfter = await repo.getAll();
                expect(eventsAfter).toEqual(eventsBefore);
            })
        })
    })
})