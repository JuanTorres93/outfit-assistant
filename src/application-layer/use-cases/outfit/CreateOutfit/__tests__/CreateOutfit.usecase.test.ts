import { beforeEach, describe, expect, it } from 'vitest';

import { outfitTestCreateProps } from '@/../tests/createEntitiesTest/outfitCreate';
import { IdGenerator } from '@/application-layer/services/IdGenerator.port';
import { Outfit } from '@/domain/entities/Outfit/Outfit';
import { MemoryOutfitsRepo } from '@/infra/repos/Memory/MemoryOutfitsRepo';
import { CryptoUUIDIdGenerator } from '@/infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator';

import { CreateOutfitUsecase } from '../CreateOutfit.usecase';

describe('CreateOutfitUsecase', () => {
  let outfitsRepo: MemoryOutfitsRepo;
  let idGenerator: IdGenerator;

  let createOutfitUsecase: CreateOutfitUsecase;
  let outfit: Outfit;

  beforeEach(async () => {
    outfitsRepo = new MemoryOutfitsRepo();
    idGenerator = new CryptoUUIDIdGenerator();

    createOutfitUsecase = new CreateOutfitUsecase(outfitsRepo, idGenerator);

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
});
