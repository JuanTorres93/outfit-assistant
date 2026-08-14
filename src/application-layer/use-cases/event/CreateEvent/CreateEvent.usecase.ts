import { Event } from '@/domain/entities/Event/Event';
import { EventsRepo } from '@/domain/repos/EventsRepo.port';
import { AlreadyExistsDomainError } from '@/domain/common/domainErrors';
import { IdGenerator } from '@/application-layer/services/IdGenerator.port';

export type CreateEventUseCaseRequest = {
    name: string;
    userId?: string;
    outfitIds: string[];
}

export class CreateEventUseCase {
    constructor(private eventsRepo: EventsRepo, private idGenerator: IdGenerator) {}

    async execute(request: CreateEventUseCaseRequest): Promise<Event> {
        const newEvent = Event.create({
            id: this.idGenerator.generateId(),
            name: request.name,
            userId: request.userId,
            outfitIds: request.outfitIds,
        });
        await this.eventsRepo.save(newEvent);
        return newEvent;
    }
}