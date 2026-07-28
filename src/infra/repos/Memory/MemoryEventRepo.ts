import { Event } from '../../../domain/entities/Event/Event';
import { EventsRepo } from '../../../domain/repos/EventsRepo.port';

export class MemoryEventRepo implements EventsRepo {
    private events: Event[] = [];
    async getAll(): Promise<Event[]> {
        return this.events.map(event => event.clone());
    }

    async getById(id: string): Promise<Event | null> {
        const event = this.events.find(event => event.id === id);

        return event?.clone() || null;
    }

    async save(event: Event): Promise<void>
    {
        const existingEventIndex = this.events.findIndex((eventInRepo) => eventInRepo.id === event.id);

        if (existingEventIndex !== -1)
        {
            this.events[existingEventIndex] = event;
        } else {
            this.events.push(event);
        }
    }

    async deleteById(id: string): Promise<void> {
        this.events = this.events.filter(event => event.id !== id);
    }
}