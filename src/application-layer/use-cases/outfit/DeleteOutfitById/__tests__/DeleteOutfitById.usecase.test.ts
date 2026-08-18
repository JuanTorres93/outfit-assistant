import { beforeEach, describe, expect, it } from 'vitest';

import { createTestOutfit } from '@/../tests/createEntitiesTest/outfitCreate';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryOutfitsRepo } from '@/infra/repos/Memory/MemoryOutfitsRepo';

import { DeleteOutfitByIdUsecase } from '../DeleteOutfitById.usecase';

describe('DeleteOutfitByIdUsecase', () => {
  let outfitsRepo: MemoryOutfitsRepo;
  let deleteOutfitByIdUsecase: DeleteOutfitByIdUsecase;

  beforeEach(() => {
    outfitsRepo = new MemoryOutfitsRepo();
    deleteOutfitByIdUsecase = new DeleteOutfitByIdUsecase(outfitsRepo);
  });

  describe('Execute', () => {
    it('should delete the outfit from the repo', async () => {
      const outfit = createTestOutfit();
      await outfitsRepo.save(outfit);

      await deleteOutfitByIdUsecase.execute({ outfitId: outfit.id });

      const result = await outfitsRepo.getById(outfit.id);
      expect(result).toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundDomainError when outfit not found', async () => {
      await expect(
        deleteOutfitByIdUsecase.execute({ outfitId: 'non-existent-id' }),
      ).rejects.toThrow(NotFoundDomainError);
    });
  });
});
