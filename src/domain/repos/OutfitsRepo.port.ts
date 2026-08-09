import { Outfit } from '../entities/Outfit/Outfit';

export interface OutfitsRepo {
  getAll(): Promise<Outfit[]>;
  getById(id: string): Promise<Outfit | null>;
  getAllByUserId(userId: string): Promise<Outfit[]>;

  save(outfit: Outfit): Promise<void>;

  deleteById(id: string): Promise<void>;
}
