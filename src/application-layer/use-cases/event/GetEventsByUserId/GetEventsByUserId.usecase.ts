import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { Event } from '@/domain/entities/Event/Event';
import { EventsRepo } from '@/domain/repos/EventsRepo.port';

export type GetEventsByUserIdUseCaseRequest = {
    userId: string;
}

export class GetEventsByUserIdUseCase {
    constructor(private eventsRepo: EventsRepo) {}

    async execute(request: GetEventsByUserIdUseCaseRequest): Promise<Event[]> {
        if (!request.userId) {
            throw new NotFoundDomainError('User ID is required to get events.');
        }
        const events = await this.eventsRepo.getByUserId(request.userId);

        if (!events) {
            throw new NotFoundDomainError(`Events from user with Id ${request.userId} not found.`);
        }

        return events;
    }
}