import { beforeEach, describe, expect, it } from 'vitest';

import { createTestGarment } from '@/../tests/createEntitiesTest/garmentCreate';
import { createTestOutfit } from '@/../tests/createEntitiesTest/outfitCreate';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryGarmentRepo } from '@/infra/repos/Memory/MemoryGarmentRepo';
import { MemoryOutfitsRepo } from '@/infra/repos/Memory/MemoryOutfitsRepo';

import { GetGarmentsInOutfitUsecase } from '../GetGarmentsInOutfit.usecase';

describe('GetGarmentsInOutfitUsecase', () => {
  let outfitsRepo: MemoryOutfitsRepo;
  let garmentsRepo: MemoryGarmentRepo;
  let getGarmentsInOutfitUsecase: GetGarmentsInOutfitUsecase;

  beforeEach(() => {
    outfitsRepo = new MemoryOutfitsRepo();
    garmentsRepo = new MemoryGarmentRepo();
    getGarmentsInOutfitUsecase = new GetGarmentsInOutfitUsecase(outfitsRepo, garmentsRepo);
  });

  describe('Execute', () => {
    it('should return the garments belonging to the outfit', async () => {
      const garmentOne = createTestGarment({ id: 'garment-1' });
      const garmentTwo = createTestGarment({ id: 'garment-2' });
      const outfit = createTestOutfit({ garmentIds: [garmentOne.id, garmentTwo.id] });

      await garmentsRepo.save(garmentOne);
      await garmentsRepo.save(garmentTwo);
      await outfitsRepo.save(outfit);

      const result = await getGarmentsInOutfitUsecase.execute({ outfitId: outfit.id });

      expect(result.map((garment) => garment.id).sort()).toEqual([garmentOne.id, garmentTwo.id].sort());
    });

    it('should return an empty array when outfit has no garments', async () => {
      const outfit = createTestOutfit({ garmentIds: [] });
      await outfitsRepo.save(outfit);

      const result = await getGarmentsInOutfitUsecase.execute({ outfitId: outfit.id });

      expect(result).toEqual([]);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundDomainError when outfit not found', async () => {
      await expect(
        getGarmentsInOutfitUsecase.execute({ outfitId: 'non-existent-outfit-id' }),
      ).rejects.toThrow(NotFoundDomainError);
    });
  });
});
