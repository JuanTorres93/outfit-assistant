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
    required: false,
  },
  userId: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
});

const EventMongo = mongoose.models.Event || mongoose.model<EventCreateProps>('Event', eventSchema);

export default EventMongo;