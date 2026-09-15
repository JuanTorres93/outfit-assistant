import mongoose from 'mongoose';

import { OutfitCreateProps } from '@/domain/entities/Outfit/Outfit';

const outfitSchema = new mongoose.Schema<OutfitCreateProps>({
  id: {
    type: String,
    required: true,
    unique: true,
  },

  userId: {
    type: String,
    required: true,
  },
  name: {
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

const OutfitMongo =
  mongoose.models.Outfit || mongoose.model<OutfitCreateProps>('Outfit', outfitSchema);

export default OutfitMongo;
