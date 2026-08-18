import { IdGenerator } from '@/application-layer/services/IdGenerator.port';
import { Outfit } from '@/domain/entities/Outfit/Outfit';
import { OutfitsRepo } from '@/domain/repos/OutfitsRepo.port';

export type CreateOutfitUsecaseRequest = {
  userId: string;
  name: string;
  garmentIds?: string[];
};

export class CreateOutfitUsecase {
  constructor(
    private outfitsRepo: OutfitsRepo,
    private idGenerator: IdGenerator,
  ) {}

  async execute(request: CreateOutfitUsecaseRequest): Promise<Outfit> {
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
