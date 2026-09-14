import { FlattenMaps } from "mongoose";

import { EventDTO, toEventEntity } from "@/application-layer/dtos/EventDTO";
import { Event, EventCreateProps } from "@/domain/entities/Event/Event";
import { EventsRepo } from '@/domain/repos/EventsRepo.port';

import EventMongo from '../models/EventMongo';

type EventDoc = FlattenMaps<EventCreateProps>;

export class MongooseEventsRepo implements EventsRepo {
    async getAll(): Promise<Event[]> {
        const docs = await EventMongo.find().lean();

        return docs.map((doc) => this.toEvent(doc));
    }

    async getById(id: string): Promise<Event | null> {
        const doc = await EventMongo.findOne({ id }).lean();

        return doc ? this.toEvent(doc) : null;
    }

    async getByUserId(userId: string): Promise<Event[] | null> {
        const docs = await EventMongo.find({ userId }).lean();

        return docs.map(doc => this.toEvent(doc));
    }

    async getMultipleByIds(ids: string[]): Promise<(Event | null)[]> {
        const docs = await EventMongo.find({ id: {$in: ids} }).lean();

        const eventsById: Record<string, Event> = {};

        for(const doc of docs){
            eventsById[doc.id] = this.toEvent(doc);
        }

        return ids.map(id => eventsById[id] ?? null);
    }

    async save(event: Event): Promise<void> {
        await EventMongo.findOneAndUpdate(
            {id: event.id},
            {
                ...event.toCreateProps(),
            },
            { upsert: true},
        );
    }

    async deleteById(id: string): Promise<void> {
        await EventMongo.deleteOne({id});
    }

    private toEvent(doc: EventDoc): Event{
        return toEventEntity(doc as unknown as EventDTO);
    }
}