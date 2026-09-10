import mongoose from 'mongoose';

import { ClosetCreateProps } from '@/domain/entities/Closet/Closet';

const closetSchema = new mongoose.Schema<ClosetCreateProps>({
  id: {
    type: String,
    required: true,
    unique: true,
  },

  userId: {
    type: String,
    required: true,
  },
  garmentIds: {
    type: [String],
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

const ClosetMongo =
  mongoose.models.Closet || mongoose.model<ClosetCreateProps>('Closet', closetSchema);

export default ClosetMongo;
