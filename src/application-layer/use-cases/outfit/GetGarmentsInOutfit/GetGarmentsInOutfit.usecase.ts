import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { Garment } from '@/domain/entities/Garment/Garment';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';
import { OutfitsRepo } from '@/domain/repos/OutfitsRepo.port';

export type GetGarmentsInOutfitUsecaseRequest = {
  outfitId: string;
};

// Mirrors GetGarmentsInClosetUsecase: Outfit also just owns garmentIds, so
// hydration goes through GarmentsRepo.getById per id rather than getAll().
export class GetGarmentsInOutfitUsecase {
  constructor(
    private outfitsRepo: OutfitsRepo,
    private garmentsRepo: GarmentsRepo,
  ) {}

  async execute(request: GetGarmentsInOutfitUsecaseRequest): Promise<Garment[]> {
    const outfit = await this.outfitsRepo.getById(request.outfitId);

    if (!outfit) throw new NotFoundDomainError(`Outfit with id ${request.outfitId} not found`);

    const garments = await this.garmentsRepo.getMultipleByIds(outfit.garmentIds);
    
    return garments.filter((garment): garment is Garment => garment !== null);
  }
}
