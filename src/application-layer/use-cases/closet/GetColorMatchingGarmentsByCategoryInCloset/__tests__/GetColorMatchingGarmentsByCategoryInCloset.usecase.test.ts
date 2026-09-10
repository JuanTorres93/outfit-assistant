import { beforeEach, describe, expect, it } from 'vitest';

import { createTestCloset } from '@/../tests/createEntitiesTest/closetCreate';
import { createTestGarment } from '@/../tests/createEntitiesTest/garmentCreate';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { MemoryClosetsRepo } from '@/infra/repos/Memory/MemoryClosetsRepo';
import { MemoryGarmentRepo } from '@/infra/repos/Memory/MemoryGarmentRepo';
import { MemoryColorMatchService } from '@/infra/services/ColorMatchService/MemoryColorMatchService';

import { GetColorMatchingGarmentsByCategoryInClosetUsecase } from '../GetColorMatchingGarmentsByCategoryInCloset.usecase';

describe('GetColorMatchingGarmentsByCategoryInClosetUsecase', () => {
  let closetsRepo: MemoryClosetsRepo;
  let garmentsRepo: MemoryGarmentRepo;
  let colorMatchService: MemoryColorMatchService;
  let getColorMatchingGarmentsByCategoryInClosetUsecase: GetColorMatchingGarmentsByCategoryInClosetUsecase;

  beforeEach(() => {
    closetsRepo = new MemoryClosetsRepo();
    garmentsRepo = new MemoryGarmentRepo();
    colorMatchService = new MemoryColorMatchService();
    getColorMatchingGarmentsByCategoryInClosetUsecase = new GetColorMatchingGarmentsByCategoryInClosetUsecase(
      closetsRepo,
      garmentsRepo,
      colorMatchService,
    );
  });

  describe('Execute', () => {
    it('should return the closet garments that match the target, grouped by category', async () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });
      const bluePants = createTestGarment({ id: 'garment-2', colors: ['Blue'], category: 'pants' });
      const blueShoes = createTestGarment({ id: 'garment-3', colors: ['Blue'], category: 'shoes' });
      const closet = createTestCloset({
        garmentIds: [whiteShirt.id, bluePants.id, blueShoes.id],
      });

      await garmentsRepo.save(whiteShirt);
      await garmentsRepo.save(bluePants);
      await garmentsRepo.save(blueShoes);
      await closetsRepo.save(closet);

      const result = await getColorMatchingGarmentsByCategoryInClosetUsecase.execute({
        closetId: closet.id,
        garmentId: whiteShirt.id,
      });

      expect(result).toEqual({
        pants: [bluePants],
        shoes: [blueShoes],
      });
    });

    it('should skip garment ids in the closet that no longer resolve to a garment', async () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });
      const bluePants = createTestGarment({ id: 'garment-2', colors: ['Blue'], category: 'pants' });
      const closet = createTestCloset({ garmentIds: [bluePants.id, 'deleted-garment-id'] });

      await garmentsRepo.save(whiteShirt);
      await garmentsRepo.save(bluePants);
      await closetsRepo.save(closet);

      const result = await getColorMatchingGarmentsByCategoryInClosetUsecase.execute({
        closetId: closet.id,
        garmentId: whiteShirt.id,
      });

      expect(result).toEqual({ pants: [bluePants] });
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundDomainError when the closet is not found', async () => {
      const whiteShirt = createTestGarment({ id: 'garment-1', colors: ['White'] });
      await garmentsRepo.save(whiteShirt);

      await expect(
        getColorMatchingGarmentsByCategoryInClosetUsecase.execute({
          closetId: 'non-existent-closet-id',
          garmentId: whiteShirt.id,
        }),
      ).rejects.toThrow(NotFoundDomainError);
    });

    it('should throw NotFoundDomainError when the target garment is not found', async () => {
      const closet = createTestCloset({ garmentIds: [] });
      await closetsRepo.save(closet);

      await expect(
        getColorMatchingGarmentsByCategoryInClosetUsecase.execute({
          closetId: closet.id,
          garmentId: 'non-existent-garment-id',
        }),
      ).rejects.toThrow(NotFoundDomainError);
    });
  });
});
