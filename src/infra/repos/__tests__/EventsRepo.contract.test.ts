import { beforeEach, describe, it, expect } from 'vitest';

import { createTestEvent } from "@/../tests/createEntitiesTest/eventCreate";

import { Event } from '@/domain/entities/Event/Event';
import { vitest } from "vitest";

import { MemoryEventRepo } from '../Memory/MemoryEventRepo';

const repos = [
    { name: 'MemoryEventRepo', repoClass: MemoryEventRepo },
];

repos.forEach(({ name, repoClass }) => {
    describe(name, () => {
        let repo: InstanceType<typeof repoClass>;
        let event: Event;

        beforeEach(async () => {
            event = createTestEvent();

            repo = new repoClass();

            await repo.save(event);
        });

        describe('getAll', () => {
            it('should return all events', async () => {
                const events = await repo.getAll();

                expect(events).toEqual([event]);
            });

            it('should return an empty array if no events are saved', async () => {
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