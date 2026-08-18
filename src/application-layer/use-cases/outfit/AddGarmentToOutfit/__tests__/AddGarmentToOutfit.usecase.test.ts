import { beforeEach, describe, expect, it } from 'vitest';

import { createTestGarment } from '@/../tests/createEntitiesTest/garmentCreate';
import { createTestOutfit } from '@/../tests/createEntitiesTest/outfitCreate';
import { AlreadyExistsDomainError, NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryGarmentRepo } from '@/infra/repos/Memory/MemoryGarmentRepo';
import { MemoryOutfitsRepo } from '@/infra/repos/Memory/MemoryOutfitsRepo';

import { AddGarmentToOutfitUsecase } from '../AddGarmentToOutfit.usecase';

describe('AddGarmentToOutfitUsecase', () => {
  let outfitsRepo: MemoryOutfitsRepo;
  let garmentsRepo: MemoryGarmentRepo;
  let addGarmentToOutfitUsecase: AddGarmentToOutfitUsecase;

  beforeEach(() => {
    outfitsRepo = new MemoryOutfitsRepo();
    garmentsRepo = new MemoryGarmentRepo();
    addGarmentToOutfitUsecase = new AddGarmentToOutfitUsecase(outfitsRepo, garmentsRepo);
  });

  describe('Execute', () => {
    it('should add garment to outfit', async () => {
      const outfit = createTestOutfit({ garmentIds: [] });
      const garment = createTestGarment();

      await outfitsRepo.save(outfit);
      await garmentsRepo.save(garment);

      const result = await addGarmentToOutfitUsecase.execute({
        outfitId: outfit.id,
        garmentId: garment.id,
      });

      expect(result.hasGarment(garment.id)).toBe(true);
    });

    it('should persist the change in the repo', async () => {
      const outfit = createTestOutfit({ garmentIds: [] });
      const garment = createTestGarment();

      await outfitsRepo.save(outfit);
      await garmentsRepo.save(garment);

      await addGarmentToOutfitUsecase.execute({
        outfitId: outfit.id,
        garmentId: garment.id,
      });

      const savedOutfit = await outfitsRepo.getById(outfit.id);

      expect(savedOutfit?.hasGarment(garment.id)).toBe(true);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundDomainError when outfit not found', async () => {
      const garment = createTestGarment();
      await garmentsRepo.save(garment);

      await expect(
        addGarmentToOutfitUsecase.execute({ outfitId: 'non-existent-outfit-id', garmentId: garment.id }),
      ).rejects.toThrow(NotFoundDomainError);
    });

    it('should throw NotFoundDomainError when garment not found', async () => {
      const outfit = createTestOutfit({ garmentIds: [] });
      await outfitsRepo.save(outfit);

      await expect(
        addGarmentToOutfitUsecase.execute({ outfitId: outfit.id, garmentId: 'non-existent-garment-id' }),
      ).rejects.toThrow(NotFoundDomainError);
    });

    it('should throw AlreadyExistsDomainError when garment already in outfit', async () => {
      const garment = createTestGarment();
      const outfit = createTestOutfit({ garmentIds: [garment.id] });

      await outfitsRepo.save(outfit);
      await garmentsRepo.save(garment);

      await expect(
        addGarmentToOutfitUsecase.execute({ outfitId: outfit.id, garmentId: garment.id }),
      ).rejects.toThrow(AlreadyExistsDomainError);
    });
  });
});
