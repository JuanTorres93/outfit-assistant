import { beforeEach, describe, expect, it } from 'vitest';

import { createTestCloset } from '@/../tests/createEntitiesTest/closetCreate';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryClosetsRepo } from '@/infra/repos/Memory/MemoryClosetsRepo';

import { GetClosetByUserIdUsecase } from '../GetClosetByUserId.usecase';

describe('GetClosetByUserIdUsecase', () => {
  let closetsRepo: MemoryClosetsRepo;
  let getClosetByUserIdUsecase: GetClosetByUserIdUsecase;

  beforeEach(() => {
    closetsRepo = new MemoryClosetsRepo();
    getClosetByUserIdUsecase = new GetClosetByUserIdUsecase(closetsRepo);
  });

  describe('Execute', () => {
    it('should return closet when found', async () => {
      const closet = createTestCloset();

      await closetsRepo.save(closet);

      const result = await getClosetByUserIdUsecase.execute({
        userId: closet.userId,
      });

      expect(result).toEqual(closet);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundDomainError when closet not found', async () => {
      await expect(() =>
        getClosetByUserIdUsecase.execute({
          userId: 'non-existent-user-id',
        }),
      ).rejects.toThrow(NotFoundDomainError);
    });
  });
});
