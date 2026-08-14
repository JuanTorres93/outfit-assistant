import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { Event } from '@/domain/entities/Event/Event';
import { EventsRepo } from '@/domain/repos/EventsRepo.port';

export type DeleteEventByIdUseCaseRequest = {
    eventId: string;
}

export class DeleteEventByIdUseCase {
    constructor(private eventsRepo: EventsRepo) {}

    async execute(request: DeleteEventByIdUseCaseRequest): Promise<void> {
        const event = await this.eventsRepo.getById(request.eventId);
        if (!event) {
            throw new NotFoundDomainError(`Event with Id ${request.eventId} not found`);
        }
        
        await this.eventsRepo.deleteById(request.eventId);

        return;
    }

}