import { beforeEach, describe, expect, it } from 'vitest';

import { createTestCloset } from '@/../tests/createEntitiesTest/closetCreate';
import { createTestGarment } from '@/../tests/createEntitiesTest/garmentCreate';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryClosetsRepo } from '@/infra/repos/Memory/MemoryClosetsRepo';
import { MemoryGarmentRepo } from '@/infra/repos/Memory/MemoryGarmentRepo';
import { MemoryColorMatchService } from '@/infra/services/ColorMatchService/MemoryColorMatchService';

import { GetColorMatchingGarmentsInClosetUsecase } from '../GetColorMatchingGarmentsInCloset.usecase';

describe('GetColorMatchingGarmentsInClosetUsecase', () => {
  let closetsRepo: MemoryClosetsRepo;
  let garmentsRepo: MemoryGarmentRepo;
  let colorMatchService: MemoryColorMatchService;
  let getColorMatchingGarmentsInClosetUsecase: GetColorMatchingGarmentsInClosetUsecase;

  beforeEach(() => {
    closetsRepo = new MemoryClosetsRepo();
    garmentsRepo = new MemoryGarmentRepo();
    colorMatchService = new MemoryColorMatchService();
    getColorMatchingGarmentsInClosetUsecase = new GetColorMatchingGarmentsInClosetUsecase(
      closetsRepo,
      garmentsRepo,
      colorMatchService,
    );
  });

  describe('Execute', () => {
    it('should return the garments in the closet whose colors match the target garment', async () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });
      const bluePants = createTestGarment({ id: 'garment-2', colors: ['Blue'] });
      const greenPants = createTestGarment({ id: 'garment-3', colors: ['Green'] });
      const closet = createTestCloset({
        garmentIds: [whiteShirt.id, bluePants.id, greenPants.id],
      });

      await garmentsRepo.save(whiteShirt);
      await garmentsRepo.save(bluePants);
      await garmentsRepo.save(greenPants);
      await closetsRepo.save(closet);

      const result = await getColorMatchingGarmentsInClosetUsecase.execute({
        closetId: closet.id,
        garmentId: whiteShirt.id,
      });

      expect(result.map((garment) => garment.id).sort()).toEqual(
        [bluePants.id, greenPants.id].sort(),
      );
    });

    it('should exclude the target garment from the results even if it is in the closet', async () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });
      const closet = createTestCloset({ garmentIds: [whiteShirt.id] });

      await garmentsRepo.save(whiteShirt);
      await closetsRepo.save(closet);

      const result = await getColorMatchingGarmentsInClosetUsecase.execute({
        closetId: closet.id,
        garmentId: whiteShirt.id,
      });

      expect(result).toEqual([]);
    });

    it('should skip garment ids in the closet that no longer resolve to a garment', async () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });
      const bluePants = createTestGarment({ id: 'garment-2', colors: ['Blue'] });
      const closet = createTestCloset({ garmentIds: [bluePants.id, 'deleted-garment-id'] });

      await garmentsRepo.save(whiteShirt);
      await garmentsRepo.save(bluePants);
      await closetsRepo.save(closet);

      const result = await getColorMatchingGarmentsInClosetUsecase.execute({
        closetId: closet.id,
        garmentId: whiteShirt.id,
      });

      expect(result.map((garment) => garment.id)).toEqual([bluePants.id]);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundDomainError when the closet is not found', async () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });
      await garmentsRepo.save(whiteShirt);

      await expect(
        getColorMatchingGarmentsInClosetUsecase.execute({
          closetId: 'non-existent-closet-id',
          garmentId: whiteShirt.id,
        }),
      ).rejects.toThrow(NotFoundDomainError);
    });

    it('should throw NotFoundDomainError when the target garment is not found', async () => {
      const closet = createTestCloset({ garmentIds: [] });
      await closetsRepo.save(closet);

      await expect(
        getColorMatchingGarmentsInClosetUsecase.execute({
          closetId: closet.id,
          garmentId: 'non-existent-garment-id',
        }),
      ).rejects.toThrow(NotFoundDomainError);
    });
  });
});
