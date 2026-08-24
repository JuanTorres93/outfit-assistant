import { Event } from "@/domain/entities/Event/Event";

export type EventDTO = {
    id: string;
    name: string;
    location?: string;
    date?: Date;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;

}

export function toEventDTO(event: Event): EventDTO {
    return {
        id: event.id,
        name: event.name,
        location: event.location,
        date: event.date,
        userId: event.userId,
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
    }
}