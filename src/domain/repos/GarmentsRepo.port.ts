import { Garment } from '../entities/Garment/Garment';

export interface GarmentsRepo {
    getAll(): Promise<Garment[]>;

    getById(id: string): Promise<Garment | null>;

    save(garment: Garment): Promise<void>;

    deleteById(id: string): Promise<void>;
}