import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { Outfit } from '@/domain/entities/Outfit/Outfit';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';
import { OutfitsRepo } from '@/domain/repos/OutfitsRepo.port';

export type AddGarmentToOutfitUsecaseRequest = {
  outfitId: string;
  garmentId: string;
};

export class AddGarmentToOutfitUsecase {
  constructor(
    private outfitsRepo: OutfitsRepo,
    private garmentsRepo: GarmentsRepo,
  ) {}

  async execute(request: AddGarmentToOutfitUsecaseRequest): Promise<Outfit> {
    const [outfit, garment] = await Promise.all([
      this.outfitsRepo.getById(request.outfitId),
      this.garmentsRepo.getById(request.garmentId),
    ]);

    if (!outfit) {
      throw new NotFoundDomainError(`Outfit with id ${request.outfitId} not found`);
    }

    if (!garment) {
      throw new NotFoundDomainError(`Garment with id ${request.garmentId} not found`);
    }

    outfit.addGarment(request.garmentId);

    await this.outfitsRepo.save(outfit);

    return outfit;
  }
}
