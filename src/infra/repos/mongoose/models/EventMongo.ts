import mongoose from 'mongoose';

import { EventCreateProps } from '@/domain/entities/Event/Event';

const eventSchema = new mongoose.Schema<EventCreateProps>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

const EventMongo = mongoose.models.Event || mongoose.model<EventCreateProps>('Event', eventSchema);

export default EventMongo;