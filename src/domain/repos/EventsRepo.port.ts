import { Event } from '../entities/Event/Event';

export interface EventsRepo {
    getAll(): Promise<Event[]>;
    getById(id: string): Promise<Event | null>;
    getByName(name: string): Promise<Event | null>;

    save(event: Event): Promise<void>;

    deleteById(id: string): Promise<void>;
}