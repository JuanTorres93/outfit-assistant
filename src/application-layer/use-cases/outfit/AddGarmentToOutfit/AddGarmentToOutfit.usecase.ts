import { ColorMatchService } from '@/application-layer/services/ColorMatchService.port';
import { NotFoundDomainError, ValidationDomainError } from '@/domain/common/domainErrors';
import { Garment } from '@/domain/entities/Garment/Garment';
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
    private colorMatchService: ColorMatchService,
  ) {}

  async execute(request: AddGarmentToOutfitUsecaseRequest): Promise<Outfit> {
    const outfit = await this.outfitsRepo.getById(request.outfitId);

    if (!outfit) throw new NotFoundDomainError(`Outfit with id ${request.outfitId} not found`);

    const garment = await this.garmentsRepo.getById(request.garmentId);

    if (!garment) throw new NotFoundDomainError(`Garment with id ${request.garmentId} not found`);

    const existingGarments = await Promise.all(
      outfit.garmentIds.map((garmentId) => this.garmentsRepo.getById(garmentId)),
    );
    const hydratedExistingGarments = existingGarments.filter((g): g is Garment => g !== null);

    if (!this.colorMatchService.isValidColorCombination([...hydratedExistingGarments, garment])) {
      throw new ValidationDomainError(
        'Outfit colors are not a valid combination: at most 4 distinct colors are allowed, and combining exactly 4 requires at least 2 of them to be neutral.',
      );
    }

    outfit.addGarment(request.garmentId);

    await this.outfitsRepo.save(outfit);

    return outfit;
  }
}
