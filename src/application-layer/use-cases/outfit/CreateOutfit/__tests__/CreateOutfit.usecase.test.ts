import { beforeEach, describe, expect, it } from 'vitest';

import { createTestGarment } from '@/../tests/createEntitiesTest/garmentCreate';
import { outfitTestCreateProps } from '@/../tests/createEntitiesTest/outfitCreate';
import { IdGenerator } from '@/application-layer/services/IdGenerator.port';
import { ValidationDomainError } from '@/domain/common/domainErrors';
import { Outfit } from '@/domain/entities/Outfit/Outfit';
import { MemoryGarmentRepo } from '@/infra/repos/Memory/MemoryGarmentRepo';
import { MemoryOutfitsRepo } from '@/infra/repos/Memory/MemoryOutfitsRepo';
import { CryptoUUIDIdGenerator } from '@/infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator';
import { MemoryColorMatchService } from '@/infra/services/ColorMatchService/MemoryColorMatchService';

import { CreateOutfitUsecase } from '../CreateOutfit.usecase';

describe('CreateOutfitUsecase', () => {
  let outfitsRepo: MemoryOutfitsRepo;
  let garmentsRepo: MemoryGarmentRepo;
  let idGenerator: IdGenerator;
  let colorMatchService: MemoryColorMatchService;

  let createOutfitUsecase: CreateOutfitUsecase;
  let outfit: Outfit;

  beforeEach(async () => {
    outfitsRepo = new MemoryOutfitsRepo();
    garmentsRepo = new MemoryGarmentRepo();
    idGenerator = new CryptoUUIDIdGenerator();
    colorMatchService = new MemoryColorMatchService();

    createOutfitUsecase = new CreateOutfitUsecase(outfitsRepo, garmentsRepo, idGenerator, colorMatchService);

    outfit = await createOutfitUsecase.execute({
      userId: outfitTestCreateProps.userId,
      name: outfitTestCreateProps.name,
      garmentIds: outfitTestCreateProps.garmentIds,
    });
  });

  describe('Execute', () => {
    it('should create outfit', () => {
      expect(outfit.userId).toBe(outfitTestCreateProps.userId);
      expect(outfit.name).toBe(outfitTestCreateProps.name);
      expect(outfit.garmentIds).toEqual(outfitTestCreateProps.garmentIds);
      expect(outfit.id).toBeDefined();
      expect(outfit.createdAt).toBeDefined();
      expect(outfit.updatedAt).toBeDefined();
    });

    it('should default to no garments when none are provided', async () => {
      const outfitWithoutGarments = await createOutfitUsecase.execute({
        userId: outfitTestCreateProps.userId,
        name: 'Weekend look',
      });

      expect(outfitWithoutGarments.garmentIds).toEqual([]);
    });

    it('should persist the outfit in the repo', async () => {
      const savedOutfit = await outfitsRepo.getById(outfit.id);

      expect(savedOutfit).not.toBeNull();
      expect(savedOutfit?.toCreateProps()).toEqual(outfit.toCreateProps());
    });

    it('should allow a user to have multiple outfits', async () => {
      const outfitsBefore = await outfitsRepo.getAllByUserId(outfitTestCreateProps.userId);
      expect(outfitsBefore.length).toBe(1);

      await createOutfitUsecase.execute({
        userId: outfitTestCreateProps.userId,
        name: 'Second look',
      });

      const outfitsAfter = await outfitsRepo.getAllByUserId(outfitTestCreateProps.userId);
      expect(outfitsAfter.length).toBe(2);
    });
  });

  describe('Errors', () => {
    it('should throw ValidationDomainError when the garments have more than 4 distinct colors', async () => {
      const garments = [
        createTestGarment({ id: 'garment-1', colors: ['Red'] }),
        createTestGarment({ id: 'garment-2', colors: ['Blue'] }),
        createTestGarment({ id: 'garment-3', colors: ['Green'] }),
        createTestGarment({ id: 'garment-4', colors: ['Yellow'] }),
        createTestGarment({ id: 'garment-5', colors: ['Purple'] }),
      ];
      await Promise.all(garments.map((garment) => garmentsRepo.save(garment)));

      await expect(
        createOutfitUsecase.execute({
          userId: outfitTestCreateProps.userId,
          name: 'Too colorful look',
          garmentIds: garments.map((garment) => garment.id),
        }),
      ).rejects.toThrow(ValidationDomainError);
    });

    it('should throw ValidationDomainError when 4 distinct colors are combined with fewer than 2 neutrals', async () => {
      const garments = [
        createTestGarment({ id: 'garment-1', colors: ['White'] }),
        createTestGarment({ id: 'garment-2', colors: ['Red'] }),
        createTestGarment({ id: 'garment-3', colors: ['Blue'] }),
        createTestGarment({ id: 'garment-4', colors: ['Green'] }),
      ];
      await Promise.all(garments.map((garment) => garmentsRepo.save(garment)));

      await expect(
        createOutfitUsecase.execute({
          userId: outfitTestCreateProps.userId,
          name: 'Not enough neutrals look',
          garmentIds: garments.map((garment) => garment.id),
        }),
      ).rejects.toThrow(ValidationDomainError);
    });

    it('should allow 4 distinct colors when at least 2 are neutral', async () => {
      const garments = [
        createTestGarment({ id: 'garment-1', colors: ['White'] }),
        createTestGarment({ id: 'garment-2', colors: ['Black'] }),
        createTestGarment({ id: 'garment-3', colors: ['Red'] }),
        createTestGarment({ id: 'garment-4', colors: ['Blue'] }),
      ];
      await Promise.all(garments.map((garment) => garmentsRepo.save(garment)));

      const result = await createOutfitUsecase.execute({
        userId: outfitTestCreateProps.userId,
        name: 'Valid 4-color look',
        garmentIds: garments.map((garment) => garment.id),
      });

      expect(result.garmentIds).toEqual(garments.map((garment) => garment.id));
    });
  });
});
