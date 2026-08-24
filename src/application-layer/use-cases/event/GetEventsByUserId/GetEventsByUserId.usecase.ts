import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { EventsRepo } from '@/domain/repos/EventsRepo.port';
import { EventDTO, toEventDTO } from '@/application-layer/dtos/EventDTO';

export type GetEventsByUserIdUseCaseRequest = {
    userId: string;
}

export class GetEventsByUserIdUseCase {
    constructor(private eventsRepo: EventsRepo) {}

    async execute(request: GetEventsByUserIdUseCaseRequest): Promise<EventDTO[]> {
        if (!request.userId) {
            throw new NotFoundDomainError('User ID is required to get events.');
        }
        const events = await this.eventsRepo.getByUserId(request.userId);

        if (!events) {
            throw new NotFoundDomainError(`Events from user with Id ${request.userId} not found.`);
        }

        const eventDTOs: EventDTO[] = [];

        for(let i = 0; i < events.length; i++)
        {
            eventDTOs.push(toEventDTO(events[i]));
        }

        return eventDTOs;
    }
}