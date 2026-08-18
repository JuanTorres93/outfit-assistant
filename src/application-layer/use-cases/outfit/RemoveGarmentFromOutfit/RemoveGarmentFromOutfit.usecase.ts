import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { Outfit } from '@/domain/entities/Outfit/Outfit';
import { OutfitsRepo } from '@/domain/repos/OutfitsRepo.port';

export type RemoveGarmentFromOutfitUsecaseRequest = {
  outfitId: string;
  garmentId: string;
};

export class RemoveGarmentFromOutfitUsecase {
  constructor(private outfitsRepo: OutfitsRepo) {}

  async execute(request: RemoveGarmentFromOutfitUsecaseRequest): Promise<Outfit> {
    const outfit = await this.outfitsRepo.getById(request.outfitId);

    if (!outfit) throw new NotFoundDomainError(`Outfit with id ${request.outfitId} not found`);

    outfit.removeGarment(request.garmentId);

    await this.outfitsRepo.save(outfit);

    return outfit;
  }
}
