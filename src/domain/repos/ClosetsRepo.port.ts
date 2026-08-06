import { Closet } from '../entities/Closet/Closet';

export interface ClosetsRepo {
  getAll(): Promise<Closet[]>;
  getById(id: string): Promise<Closet | null>;
  getByUserId(userId: string): Promise<Closet | null>;

  save(closet: Closet): Promise<void>;

  deleteById(id: string): Promise<void>;
}
