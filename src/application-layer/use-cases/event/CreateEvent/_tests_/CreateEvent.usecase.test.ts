import { beforeEach, describe, expect, it } from 'vitest';
import { CreateEventUseCase } from '../CreateEvent.usecase';
import { AlreadyExistsDomainError } from '@/domain/common/domainErrors';
import { MemoryEventRepo } from '@/infra/repos/Memory/MemoryEventRepo';
import { CryptoUUIDIdGenerator } from '@/infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator';
import { validEventProp } from 'tests/createEntitiesTest/eventCreate';
import { Event } from '@/domain/entities/Event/Event';

describe('CreateEventUseCase', () => {
    let createEventUseCase: CreateEventUseCase;
    let EventRepo: MemoryEventRepo;
    let idGenerator: CryptoUUIDIdGenerator;

    let event: Event;

    beforeEach(async () => {
        EventRepo = new MemoryEventRepo();
        idGenerator = new CryptoUUIDIdGenerator();
        createEventUseCase = new CreateEventUseCase(EventRepo, idGenerator);

        event = await createEventUseCase.execute({
            name: validEventProp.name,
            userId: validEventProp.userId,
            outfitIds: validEventProp.outfitIds,
        });
    });

    describe('Execute', () => {
        it('should create event', async () => {
            expect(event.name).toBe(validEventProp.name);
            expect(event.userId).toBe(validEventProp.userId);
            expect(event.outfitIds).toEqual(validEventProp.outfitIds);
            expect(event.id).toBeDefined();
            expect(event.createdAt).toBeDefined();
            expect(event.updatedAt).toBeDefined();
        }); 
    });
});