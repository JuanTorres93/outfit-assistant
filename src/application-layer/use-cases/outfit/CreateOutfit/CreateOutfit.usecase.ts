import { ColorMatchService } from '@/application-layer/services/ColorMatchService.port';
import { IdGenerator } from '@/application-layer/services/IdGenerator.port';
import { ValidationDomainError } from '@/domain/common/domainErrors';
import { Garment } from '@/domain/entities/Garment/Garment';
import { Outfit } from '@/domain/entities/Outfit/Outfit';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';
import { OutfitsRepo } from '@/domain/repos/OutfitsRepo.port';

export type CreateOutfitUsecaseRequest = {
  userId: string;
  name: string;
  garmentIds?: string[];
};

export class CreateOutfitUsecase {
  constructor(
    private outfitsRepo: OutfitsRepo,
    private garmentsRepo: GarmentsRepo,
    private idGenerator: IdGenerator,
    private colorMatchService: ColorMatchService,
  ) {}

  async execute(request: CreateOutfitUsecaseRequest): Promise<Outfit> {
    const hydratedGarments = await Promise.all(
      (request.garmentIds || []).map((garmentId) => this.garmentsRepo.getById(garmentId)),
    );
    const garments = hydratedGarments.filter((garment): garment is Garment => garment !== null);

    if (!this.colorMatchService.isValidColorCombination(garments)) {
      throw new ValidationDomainError(
        'Outfit colors are not a valid combination: at most 4 distinct colors are allowed, and combining exactly 4 requires at least 2 of them to be neutral.',
      );
    }

    const newOutfit = Outfit.create({
      id: this.idGenerator.generateId(),
      userId: request.userId,
      name: request.name,
      garmentIds: request.garmentIds,
    });

    await this.outfitsRepo.save(newOutfit);

    return newOutfit;
  }
}
