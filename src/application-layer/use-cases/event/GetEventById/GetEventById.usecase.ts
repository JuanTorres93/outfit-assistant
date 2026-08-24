import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { Event } from '@/domain/entities/Event/Event';
import { EventsRepo } from '@/domain/repos/EventsRepo.port';
import { EventDTO, toEventDTO } from '@/application-layer/dtos/EventDTO';

export type GetEventByIdUseCaseRequest = {
    eventId: string;
}

export class GetEventByIdUseCase {
    constructor(private eventsRepo: EventsRepo) {}

    async execute(request: GetEventByIdUseCaseRequest): Promise<EventDTO> {
        const event = await this.eventsRepo.getById(request.eventId);
        if (!event) {
            throw new NotFoundDomainError(`Event with Id ${request.eventId} not found`);
        }
        return toEventDTO(event);
    }
}