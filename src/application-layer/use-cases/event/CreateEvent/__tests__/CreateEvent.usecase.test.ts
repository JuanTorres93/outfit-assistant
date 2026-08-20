import { beforeEach, describe, expect, it } from 'vitest';
import { CreateEventUseCase } from '../CreateEvent.usecase';
import { AlreadyExistsDomainError } from '@/domain/common/domainErrors';
import { MemoryEventRepo } from '@/infra/repos/Memory/MemoryEventRepo';
import { CryptoUUIDIdGenerator } from '@/infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator';
import { eventTestCreateProps } from '@/../tests/createEntitiesTest/eventCreate';
import { Event } from '@/domain/entities/Event/Event';

describe('CreateEventUseCase', () => {
    let createEventUseCase: CreateEventUseCase;
    let eventRepo: MemoryEventRepo;
    let idGenerator: CryptoUUIDIdGenerator;

    let event: Event;

    beforeEach(async () => {
        eventRepo = new MemoryEventRepo();
        idGenerator = new CryptoUUIDIdGenerator();
        createEventUseCase = new CreateEventUseCase(eventRepo, idGenerator);

        event = await createEventUseCase.execute({
            name: eventTestCreateProps.name,
            userId: eventTestCreateProps.userId,
            outfitIds: eventTestCreateProps.outfitIds,
        });
    });

    describe('Execute', () => {
        it('should create event', async () => {
            expect(event.name).toBe(eventTestCreateProps.name);
            expect(event.userId).toBe(eventTestCreateProps.userId);
            expect(event.outfitIds).toEqual(eventTestCreateProps.outfitIds);
            expect(event.id).toBeDefined();
            expect(event.createdAt).toBeDefined();
            expect(event.updatedAt).toBeDefined();
        }); 
    });

    describe('Side Effects', () => {
        it('should persist the event in the repository', async () => {
            const eventsBefore = await eventRepo.getAll();
            expect(eventsBefore.length).toBe(1);

            const newEvent = await createEventUseCase.execute({
                name: 'Another Event',
                userId: 'user-456',
                outfitIds: ['outfit-3'],
            });
            const eventsAfter = await eventRepo.getAll();
            expect(eventsAfter.length).toBe(2);
        });
    });
});