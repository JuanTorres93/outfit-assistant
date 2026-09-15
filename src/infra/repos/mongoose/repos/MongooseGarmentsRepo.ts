import { FlattenMaps } from 'mongoose';

import { GarmentDTO, toGarmentEntity } from '@/application-layer/dtos/GarmentDTO';
import { Garment, GarmentCreateProps } from '@/domain/entities/Garment/Garment';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';

import GarmentMongo from '../models/GarmentMongo';

type GarmentDoc = FlattenMaps<GarmentCreateProps>;

export class MongooseGarmentsRepo implements GarmentsRepo {
  async getAll(): Promise<Garment[]> {
    const docs = await GarmentMongo.find().lean();

    return docs.map((doc) => this.toGarment(doc));
  }

  async getById(id: string): Promise<Garment | null> {
    const doc = await GarmentMongo.findOne({ id }).lean();

    return doc ? this.toGarment(doc) : null;
  }

  async getMultipleByIds(ids: string[]): Promise<(Garment | null)[]> {
    const docs = await GarmentMongo.find({ id: { $in: ids } }).lean();

    const garmentsById: Record<string, Garment> = {};

    for (const doc of docs) {
      garmentsById[doc.id] = this.toGarment(doc);
    }

    return ids.map((id) => garmentsById[id] ?? null);
  }

  async save(garment: Garment): Promise<void> {
    await GarmentMongo.findOneAndUpdate(
      { id: garment.id },
      {
        ...garment.toCreateProps(),
      },
      { upsert: true },
    );
  }

  async deleteById(id: string): Promise<void> {
    await GarmentMongo.deleteOne({ id });
  }

  private toGarment(doc: GarmentDoc): Garment {
    return toGarmentEntity(doc as unknown as GarmentDTO);
  }
}
