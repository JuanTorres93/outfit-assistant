import { Closet } from '@/domain/entities/Closet/Closet';

export type ClosetDTO = {
  id: string;

  userId: string;
  garmentIds: string[];

  createdAt: string;
  updatedAt: string;
};

export function toClosetDTO(closet: Closet): ClosetDTO {
  return {
    id: closet.id,

    userId: closet.userId,
    garmentIds: closet.garmentIds,

    createdAt: closet.createdAt.toISOString(),
    updatedAt: closet.updatedAt.toISOString(),
  };
}

export function toClosetEntity(dto: ClosetDTO): Closet {
  return Closet.create({
    ...dto,

    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });
}