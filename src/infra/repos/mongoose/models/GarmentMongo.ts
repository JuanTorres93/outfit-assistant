import mongoose from 'mongoose';

import { GarmentCreateProps } from '@/domain/entities/Garment/Garment';

const garmentSchema = new mongoose.Schema<GarmentCreateProps>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  colors: {
    type: [String],
    required: true,
  },
  brand: {
    type: String,
  },
  size: {
    type: String,
  },
  material: {
    type: String,
  },
  seasons: {
    type: [String],
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

const GarmentMongo =
  mongoose.models.Garment || mongoose.model<GarmentCreateProps>('Garment', garmentSchema);

export default GarmentMongo;
