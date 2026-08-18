import { beforeEach, describe, expect, it } from 'vitest';

import { createTestCloset } from '@/../tests/createEntitiesTest/closetCreate';
import { createTestGarment } from '@/../tests/createEntitiesTest/garmentCreate';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryClosetsRepo } from '@/infra/repos/Memory/MemoryClosetsRepo';
import { MemoryGarmentRepo } from '@/infra/repos/Memory/MemoryGarmentRepo';

import { GetGarmentsInClosetUsecase } from '../GetGarmentsInCloset.usecase';

describe('GetGarmentsInClosetUsecase', () => {
  let closetsRepo: MemoryClosetsRepo;
  let garmentsRepo: MemoryGarmentRepo;
  let getGarmentsInClosetUsecase: GetGarmentsInClosetUsecase;

  beforeEach(() => {
    closetsRepo = new MemoryClosetsRepo();
    garmentsRepo = new MemoryGarmentRepo();
    getGarmentsInClosetUsecase = new GetGarmentsInClosetUsecase(closetsRepo, garmentsRepo);
  });

  describe('Execute', () => {
    it('should return the garments belonging to the closet', async () => {
      const garmentOne = createTestGarment({ id: 'garment-1' });
      const garmentTwo = createTestGarment({ id: 'garment-2' });
      const closet = createTestCloset({ garmentIds: [garmentOne.id, garmentTwo.id] });

      await garmentsRepo.save(garmentOne);
      await garmentsRepo.save(garmentTwo);
      await closetsRepo.save(closet);

      const result = await getGarmentsInClosetUsecase.execute({ closetId: closet.id });

      expect(result.map((garment) => garment.id).sort()).toEqual([garmentOne.id, garmentTwo.id].sort());
    });

    it('should return an empty array when closet has no garments', async () => {
      const closet = createTestCloset({ garmentIds: [] });
      await closetsRepo.save(closet);

      const result = await getGarmentsInClosetUsecase.execute({ closetId: closet.id });

      expect(result).toEqual([]);
    });

    it('should skip garment ids that no longer resolve to a garment', async () => {
      const garment = createTestGarment({ id: 'garment-1' });
      const closet = createTestCloset({ garmentIds: [garment.id, 'deleted-garment-id'] });

      await garmentsRepo.save(garment);
      await closetsRepo.save(closet);

      const result = await getGarmentsInClosetUsecase.execute({ closetId: closet.id });

      expect(result.map((g) => g.id)).toEqual([garment.id]);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundDomainError when closet not found', async () => {
      await expect(
        getGarmentsInClosetUsecase.execute({ closetId: 'non-existent-closet-id' }),
      ).rejects.toThrow(NotFoundDomainError);
    });
  });
});
