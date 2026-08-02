import { Garment } from '../../../domain/entities/Garment/Garment';
import { GarmentsRepo } from '../../../domain/repos/GarmentsRepo.port';

export class MemoryGarmentRepo implements GarmentsRepo {
  private garments: Garment[] = [];

  async getAll(): Promise<Garment[]> {
    return this.garments.map((garment) => garment.clone());
  }

  async getById(id: string): Promise<Garment | null> {
    const garment = this.garments.find((garment) => garment.id === id);

    return garment?.clone() || null;
  }

  async getByName(name: string): Promise<Garment | null> {
    const garment = this.garments.find((garment) => garment.name === name);

    return garment?.clone() || null;
  }

  async save(garment: Garment): Promise<void> {
    const existingGarmentIndex = this.garments.findIndex(
      (garmentInRepo) => garmentInRepo.id === garment.id,
    );

    if (existingGarmentIndex !== -1) {
      this.garments[existingGarmentIndex] = garment.clone();
    } else {
      this.garments.push(garment.clone());
    }
  }

  async deleteById(id: string): Promise<void> {
    this.garments = this.garments.filter(
      (garment) => garment.id !== id,
    );
  }
}