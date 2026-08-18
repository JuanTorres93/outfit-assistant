import { beforeEach, describe, expect, it } from 'vitest';

import { createTestOutfit } from '@/../tests/createEntitiesTest/outfitCreate';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryOutfitsRepo } from '@/infra/repos/Memory/MemoryOutfitsRepo';

import { GetOutfitByIdUsecase } from '../GetOutfitById.usecase';

describe('GetOutfitByIdUsecase', () => {
  let outfitsRepo: MemoryOutfitsRepo;
  let getOutfitByIdUsecase: GetOutfitByIdUsecase;

  beforeEach(() => {
    outfitsRepo = new MemoryOutfitsRepo();
    getOutfitByIdUsecase = new GetOutfitByIdUsecase(outfitsRepo);
  });

  describe('Execute', () => {
    it('should return outfit when found', async () => {
      const outfit = createTestOutfit();

      await outfitsRepo.save(outfit);

      const result = await getOutfitByIdUsecase.execute({
        outfitId: outfit.id,
      });

      expect(result).toEqual(outfit);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundDomainError when outfit not found', async () => {
      await expect(() =>
        getOutfitByIdUsecase.execute({
          outfitId: 'non-existent-id',
        }),
      ).rejects.toThrow(NotFoundDomainError);
    });
  });
});
