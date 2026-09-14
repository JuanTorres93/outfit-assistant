import { Outfit } from '@/domain/entities/Outfit/Outfit';

export type OutfitDTO = {
  id: string;

  userId: string;
  name: string;
  garmentIds: string[];

  createdAt: string;
  updatedAt: string;
};

export function toOutfitDTO(outfit: Outfit): OutfitDTO {
  return {
    id: outfit.id,

    userId: outfit.userId,
    name: outfit.name,
    garmentIds: outfit.garmentIds,

    createdAt: outfit.createdAt.toISOString(),
    updatedAt: outfit.updatedAt.toISOString(),
  };
}

export function toOutfitEntity(dto: OutfitDTO): Outfit {
  return Outfit.create({
    ...dto,

    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });
}
