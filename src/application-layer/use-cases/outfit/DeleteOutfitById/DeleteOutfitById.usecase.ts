import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { OutfitsRepo } from '@/domain/repos/OutfitsRepo.port';

export type DeleteOutfitByIdUsecaseRequest = {
  outfitId: string;
};

export class DeleteOutfitByIdUsecase {
  constructor(private outfitsRepo: OutfitsRepo) {}

  async execute(request: DeleteOutfitByIdUsecaseRequest): Promise<void> {
    const outfit = await this.outfitsRepo.getById(request.outfitId);

    if (!outfit) throw new NotFoundDomainError(`Outfit with id ${request.outfitId} not found`);

    await this.outfitsRepo.deleteById(request.outfitId);
  }
}
