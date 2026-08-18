import { beforeEach, describe, expect, it } from 'vitest';

import { createTestGarment } from '@/../tests/createEntitiesTest/garmentCreate';
import { createTestOutfit } from '@/../tests/createEntitiesTest/outfitCreate';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryOutfitsRepo } from '@/infra/repos/Memory/MemoryOutfitsRepo';

import { RemoveGarmentFromOutfitUsecase } from '../RemoveGarmentFromOutfit.usecase';

describe('RemoveGarmentFromOutfitUsecase', () => {
  let outfitsRepo: MemoryOutfitsRepo;
  let removeGarmentFromOutfitUsecase: RemoveGarmentFromOutfitUsecase;

  beforeEach(() => {
    outfitsRepo = new MemoryOutfitsRepo();
    removeGarmentFromOutfitUsecase = new RemoveGarmentFromOutfitUsecase(outfitsRepo);
  });

  describe('Execute', () => {
    it('should remove garment from outfit', async () => {
      const garment = createTestGarment();
      const outfit = createTestOutfit({ garmentIds: [garment.id] });

      await outfitsRepo.save(outfit);

      const result = await removeGarmentFromOutfitUsecase.execute({
        outfitId: outfit.id,
        garmentId: garment.id,
      });

      expect(result.hasGarment(garment.id)).toBe(false);
    });

    it('should persist the change in the repo', async () => {
      const garment = createTestGarment();
      const outfit = createTestOutfit({ garmentIds: [garment.id] });

      await outfitsRepo.save(outfit);

      await removeGarmentFromOutfitUsecase.execute({
        outfitId: outfit.id,
        garmentId: garment.id,
      });

      const savedOutfit = await outfitsRepo.getById(outfit.id);

      expect(savedOutfit?.hasGarment(garment.id)).toBe(false);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundDomainError when outfit not found', async () => {
      await expect(
        removeGarmentFromOutfitUsecase.execute({ outfitId: 'non-existent-outfit-id', garmentId: 'garment-id' }),
      ).rejects.toThrow(NotFoundDomainError);
    });

    it('should throw NotFoundDomainError when garment not in outfit', async () => {
      const outfit = createTestOutfit({ garmentIds: [] });
      await outfitsRepo.save(outfit);

      await expect(
        removeGarmentFromOutfitUsecase.execute({ outfitId: outfit.id, garmentId: 'non-existent-garment-id' }),
      ).rejects.toThrow(NotFoundDomainError);
    });
  });
});
