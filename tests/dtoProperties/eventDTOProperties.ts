import { eventTestCreateProps } from "@/../tests/createEntitiesTest/eventCreate";
import { getGetters } from "@/application-layer/dtos/__tests__/_getGettersUtil";
import { Event } from '@/domain/entities/Event/Event';

const sampleEvent = Event.create({
    ...eventTestCreateProps
});

const allEventGetters = getGetters(sampleEvent);

export const eventDTOProperties = allEventGetters;