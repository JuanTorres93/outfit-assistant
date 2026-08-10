import { beforeEach, describe, expect, it } from 'vitest';

import { createTestCloset } from '@/../tests/createEntitiesTest/closetCreate';
import { createTestGarment } from '@/../tests/createEntitiesTest/garmentCreate';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryClosetsRepo } from '@/infra/repos/Memory/MemoryClosetsRepo';

import { RemoveGarmentFromClosetUsecase } from '../RemoveGarmentFromCloset.usecase';

describe('RemoveGarmentFromClosetUsecase', () => {
  let closetsRepo: MemoryClosetsRepo;
  let removeGarmentFromClosetUsecase: RemoveGarmentFromClosetUsecase;

  beforeEach(() => {
    closetsRepo = new MemoryClosetsRepo();
    removeGarmentFromClosetUsecase = new RemoveGarmentFromClosetUsecase(closetsRepo);
  });

  describe('Execute', () => {
    it('should remove garment from closet', async () => {
      const garment = createTestGarment();
      const closet = createTestCloset({ garmentIds: [garment.id] });

      await closetsRepo.save(closet);

      const result = await removeGarmentFromClosetUsecase.execute({
        closetId: closet.id,
        garmentId: garment.id,
      });

      expect(result.hasGarment(garment.id)).toBe(false);
    });

    it('should persist the change in the repo', async () => {
      const garment = createTestGarment();
      const closet = createTestCloset({ garmentIds: [garment.id] });

      await closetsRepo.save(closet);

      await removeGarmentFromClosetUsecase.execute({
        closetId: closet.id,
        garmentId: garment.id,
      });

      const savedCloset = await closetsRepo.getById(closet.id);

      expect(savedCloset?.hasGarment(garment.id)).toBe(false);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundDomainError when closet not found', async () => {
      await expect(
        removeGarmentFromClosetUsecase.execute({ closetId: 'non-existent-closet-id', garmentId: 'garment-id' }),
      ).rejects.toThrow(NotFoundDomainError);
    });

    it('should throw NotFoundDomainError when garment not in closet', async () => {
      const closet = createTestCloset({ garmentIds: [] });
      await closetsRepo.save(closet);

      await expect(
        removeGarmentFromClosetUsecase.execute({ closetId: closet.id, garmentId: 'non-existent-garment-id' }),
      ).rejects.toThrow(NotFoundDomainError);
    });
  });
});
