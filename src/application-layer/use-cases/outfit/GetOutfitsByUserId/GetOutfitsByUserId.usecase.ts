import { Outfit } from '@/domain/entities/Outfit/Outfit';
import { OutfitsRepo } from '@/domain/repos/OutfitsRepo.port';

export type GetOutfitsByUserIdUsecaseRequest = {
  userId: string;
};

export class GetOutfitsByUserIdUsecase {
  constructor(private outfitsRepo: OutfitsRepo) {}

  async execute(request: GetOutfitsByUserIdUsecaseRequest): Promise<Outfit[]> {
    return this.outfitsRepo.getAllByUserId(request.userId);
  }
}
