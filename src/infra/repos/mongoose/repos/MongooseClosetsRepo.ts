import { FlattenMaps } from 'mongoose';

import { ClosetDTO, toClosetEntity } from '@/application-layer/dtos/ClosetDTO';
import { Closet, ClosetCreateProps } from '@/domain/entities/Closet/Closet';
import { ClosetsRepo } from '@/domain/repos/ClosetsRepo.port';

import ClosetMongo from '../models/ClosetMongo';

type ClosetDoc = FlattenMaps<ClosetCreateProps>;

export class MongooseClosetsRepo implements ClosetsRepo {
  async getAll(): Promise<Closet[]> {
    const docs = await ClosetMongo.find().lean();

    return docs.map((doc) => this.toCloset(doc));
  }

  async getById(id: string): Promise<Closet | null> {
    const doc = await ClosetMongo.findOne({ id }).lean();

    return doc ? this.toCloset(doc) : null;
  }

  async getByUserId(userId: string): Promise<Closet | null> {
    const doc = await ClosetMongo.findOne({ userId }).lean();

    return doc ? this.toCloset(doc) : null;
  }

  async getMultipleByIds(ids: string[]): Promise<(Closet | null)[]> {
    const docs = await ClosetMongo.find({ id: { $in: ids } }).lean();

    const closetsById: Record<string, Closet> = {};

    for (const doc of docs) {
      closetsById[doc.id] = this.toCloset(doc);
    }

    return ids.map((id) => closetsById[id] ?? null);
  }

  async save(closet: Closet): Promise<void> {
    await ClosetMongo.findOneAndUpdate(
      { id: closet.id },
      {
        ...closet.toCreateProps(),
      },
      { upsert: true },
    );
  }

  async deleteById(id: string): Promise<void> {
    await ClosetMongo.deleteOne({ id });
  }

  private toCloset(doc: ClosetDoc): Closet {
    return toClosetEntity(doc as unknown as ClosetDTO);
  }
}