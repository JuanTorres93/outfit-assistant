import { FlattenMaps } from 'mongoose';

import { OutfitDTO, toOutfitEntity } from '@/application-layer/dtos/OutfitDTO';
import { Outfit, OutfitCreateProps } from '@/domain/entities/Outfit/Outfit';
import { OutfitsRepo } from '@/domain/repos/OutfitsRepo.port';

import OutfitMongo from '../models/OutfitMongo';

type OutfitDoc = FlattenMaps<OutfitCreateProps>;

export class MongooseOutfitsRepo implements OutfitsRepo {
  async getAll(): Promise<Outfit[]> {
    const docs = await OutfitMongo.find().lean();

    return docs.map((doc) => this.toOutfit(doc));
  }

  async getById(id: string): Promise<Outfit | null> {
    const doc = await OutfitMongo.findOne({ id }).lean();

    return doc ? this.toOutfit(doc) : null;
  }

  async getAllByUserId(userId: string): Promise<Outfit[]> {
    const docs = await OutfitMongo.find({ userId }).lean();

    return docs.map((doc) => this.toOutfit(doc));
  }

  async getMultipleByIds(ids: string[]): Promise<(Outfit | null)[]> {
    const docs = await OutfitMongo.find({ id: { $in: ids } }).lean();

    const outfitsById: Record<string, Outfit> = {};

    for (const doc of docs) {
      outfitsById[doc.id] = this.toOutfit(doc);
    }

    return ids.map((id) => outfitsById[id] ?? null);
  }

  async save(outfit: Outfit): Promise<void> {
    await OutfitMongo.findOneAndUpdate(
      { id: outfit.id },
      {
        ...outfit.toCreateProps(),
      },
      { upsert: true },
    );
  }

  async deleteById(id: string): Promise<void> {
    await OutfitMongo.deleteOne({ id });
  }

  private toOutfit(doc: OutfitDoc): Outfit {
    return toOutfitEntity(doc as unknown as OutfitDTO);
  }
}
