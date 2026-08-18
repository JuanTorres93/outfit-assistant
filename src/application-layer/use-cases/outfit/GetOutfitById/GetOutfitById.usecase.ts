import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { Outfit } from '@/domain/entities/Outfit/Outfit';
import { OutfitsRepo } from '@/domain/repos/OutfitsRepo.port';

export type GetOutfitByIdUsecaseRequest = {
  outfitId: string;
};

export class GetOutfitByIdUsecase {
  constructor(private outfitsRepo: OutfitsRepo) {}

  async execute(request: GetOutfitByIdUsecaseRequest): Promise<Outfit> {
    const outfit = await this.outfitsRepo.getById(request.outfitId);

    if (!outfit) throw new NotFoundDomainError(`Outfit with id ${request.outfitId} not found`);

    return outfit;
  }
}
