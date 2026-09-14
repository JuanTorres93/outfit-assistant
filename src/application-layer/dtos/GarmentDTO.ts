import { Garment } from '@/domain/entities/Garment/Garment';

export type GarmentDTO = {
  id: string;
  name: string;
  category: string;
  colors: string[];
  brand?: string;
  size?: string;
  material?: string;
  seasons?: string[];
  createdAt: string;
  updatedAt: string;
};

export function toGarmentDTO(garment: Garment): GarmentDTO {
  return {
    id: garment.id,
    name: garment.name,
    category: garment.category,
    colors: garment.colors,
    brand: garment.brand,
    size: garment.size,
    material: garment.material,
    seasons: garment.seasons,
    createdAt: garment.createdAt.toISOString(),
    updatedAt: garment.updatedAt.toISOString(),
  };
}

export function toGarmentEntity(dto: GarmentDTO): Garment {
  return Garment.create({
    ...dto,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });
}
