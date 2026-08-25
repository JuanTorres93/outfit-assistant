import { Event } from '@/domain/entities/Event/Event';
import { EventsRepo } from '@/domain/repos/EventsRepo.port';
import { EventDTO, toEventDTO } from '@/application-layer/dtos/EventDTO';

import { AlreadyExistsDomainError } from '@/domain/common/domainErrors';
import { IdGenerator } from '@/application-layer/services/IdGenerator.port';

export type CreateEventUseCaseRequest = {
    name: string;
    userId?: string;
}

export class CreateEventUseCase {
    constructor(private eventsRepo: EventsRepo, private idGenerator: IdGenerator) {}

    async execute(request: CreateEventUseCaseRequest): Promise<EventDTO> {
        const newEvent = Event.create({
            id: this.idGenerator.generateId(),
            name: request.name,
            userId: request.userId,
        });
        await this.eventsRepo.save(newEvent);
        return toEventDTO(newEvent);
    }
}