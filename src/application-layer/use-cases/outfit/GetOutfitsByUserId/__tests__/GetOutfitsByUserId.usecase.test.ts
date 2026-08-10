import { beforeEach, describe, expect, it } from 'vitest';

import { createTestOutfit } from '@/../tests/createEntitiesTest/outfitCreate';
import { MemoryOutfitsRepo } from '@/infra/repos/Memory/MemoryOutfitsRepo';

import { GetOutfitsByUserIdUsecase } from '../GetOutfitsByUserId.usecase';

describe('GetOutfitsByUserIdUsecase', () => {
  let outfitsRepo: MemoryOutfitsRepo;
  let getOutfitsByUserIdUsecase: GetOutfitsByUserIdUsecase;

  beforeEach(() => {
    outfitsRepo = new MemoryOutfitsRepo();
    getOutfitsByUserIdUsecase = new GetOutfitsByUserIdUsecase(outfitsRepo);
  });

  describe('Execute', () => {
    it('should return all outfits belonging to the user', async () => {
      const outfitOne = createTestOutfit({ id: 'outfit-1', userId: 'user-1' });
      const outfitTwo = createTestOutfit({ id: 'outfit-2', userId: 'user-1' });
      const otherUsersOutfit = createTestOutfit({ id: 'outfit-3', userId: 'user-2' });

      await outfitsRepo.save(outfitOne);
      await outfitsRepo.save(outfitTwo);
      await outfitsRepo.save(otherUsersOutfit);

      const result = await getOutfitsByUserIdUsecase.execute({ userId: 'user-1' });

      expect(result.map((outfit) => outfit.id).sort()).toEqual([outfitOne.id, outfitTwo.id].sort());
    });

    it('should return an empty array when user has no outfits', async () => {
      const result = await getOutfitsByUserIdUsecase.execute({ userId: 'non-existent-user-id' });

      expect(result).toEqual([]);
    });
  });
});
