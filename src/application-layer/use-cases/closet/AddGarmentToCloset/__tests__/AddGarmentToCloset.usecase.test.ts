import { beforeEach, describe, expect, it } from 'vitest';

import { createTestCloset } from '@/../tests/createEntitiesTest/closetCreate';
import { createTestGarment } from '@/../tests/createEntitiesTest/garmentCreate';
import { AlreadyExistsDomainError, NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryClosetsRepo } from '@/infra/repos/Memory/MemoryClosetsRepo';
import { MemoryGarmentRepo } from '@/infra/repos/Memory/MemoryGarmentRepo';

import { AddGarmentToClosetUsecase } from '../AddGarmentToCloset.usecase';

describe('AddGarmentToClosetUsecase', () => {
  let closetsRepo: MemoryClosetsRepo;
  let garmentsRepo: MemoryGarmentRepo;
  let addGarmentToClosetUsecase: AddGarmentToClosetUsecase;

  beforeEach(() => {
    closetsRepo = new MemoryClosetsRepo();
    garmentsRepo = new MemoryGarmentRepo();
    addGarmentToClosetUsecase = new AddGarmentToClosetUsecase(closetsRepo, garmentsRepo);
  });

  describe('Execute', () => {
    it('should add garment to closet', async () => {
      const closet = createTestCloset({ garmentIds: [] });
      const garment = createTestGarment();

      await closetsRepo.save(closet);
      await garmentsRepo.save(garment);

      const result = await addGarmentToClosetUsecase.execute({
        closetId: closet.id,
        garmentId: garment.id,
      });

      expect(result.hasGarment(garment.id)).toBe(true);
    });

    it('should persist the change in the repo', async () => {
      const closet = createTestCloset({ garmentIds: [] });
      const garment = createTestGarment();

      await closetsRepo.save(closet);
      await garmentsRepo.save(garment);

      await addGarmentToClosetUsecase.execute({
        closetId: closet.id,
        garmentId: garment.id,
      });

      const savedCloset = await closetsRepo.getById(closet.id);

      expect(savedCloset?.hasGarment(garment.id)).toBe(true);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundDomainError when closet not found', async () => {
      const garment = createTestGarment();
      await garmentsRepo.save(garment);

      await expect(
        addGarmentToClosetUsecase.execute({ closetId: 'non-existent-closet-id', garmentId: garment.id }),
      ).rejects.toThrow(NotFoundDomainError);
    });

    it('should throw NotFoundDomainError when garment not found', async () => {
      const closet = createTestCloset({ garmentIds: [] });
      await closetsRepo.save(closet);

      await expect(
        addGarmentToClosetUsecase.execute({ closetId: closet.id, garmentId: 'non-existent-garment-id' }),
      ).rejects.toThrow(NotFoundDomainError);
    });

    it('should throw AlreadyExistsDomainError when garment already in closet', async () => {
      const garment = createTestGarment();
      const closet = createTestCloset({ garmentIds: [garment.id] });

      await closetsRepo.save(closet);
      await garmentsRepo.save(garment);

      await expect(
        addGarmentToClosetUsecase.execute({ closetId: closet.id, garmentId: garment.id }),
      ).rejects.toThrow(AlreadyExistsDomainError);
    });
  });
});
