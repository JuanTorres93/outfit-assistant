import { beforeEach, describe, expect, it } from 'vitest';

import { CreateGarmentUseCase } from '../CreateGarment.usecase';

import { MemoryGarmentRepo } from '@/infra/repos/Memory/MemoryGarmentRepo';
import { CryptoUUIDIdGenerator } from '@/infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator';

import { garmentTestCreateProps } from '@/../tests/createEntitiesTest/garmentCreate';
import { Garment } from '@/domain/entities/Garment/Garment';

describe('CreateGarmentUseCase', () => {
  let createGarmentUseCase: CreateGarmentUseCase;
  let garmentRepo: MemoryGarmentRepo;
  let idGenerator: CryptoUUIDIdGenerator;

  let garment: Garment;

  beforeEach(async () => {
    garmentRepo = new MemoryGarmentRepo();
    idGenerator = new CryptoUUIDIdGenerator();

    createGarmentUseCase = new CreateGarmentUseCase(
      garmentRepo,
      idGenerator,
    );

    garment = await createGarmentUseCase.execute({
      name: garmentTestCreateProps.name,
      category: garmentTestCreateProps.category,
      colors: garmentTestCreateProps.colors,
      brand: garmentTestCreateProps.brand,
      size: garmentTestCreateProps.size,
      material: garmentTestCreateProps.material,
      seasons: garmentTestCreateProps.seasons,
    });
  });

  describe('Execute', () => {
    it('should create garment', async () => {
      expect(garment.name).toBe(garmentTestCreateProps.name);
      expect(garment.category).toBe(garmentTestCreateProps.category);
      expect(garment.colors).toEqual(garmentTestCreateProps.colors);
      expect(garment.brand).toBe(garmentTestCreateProps.brand);
      expect(garment.size).toBe(garmentTestCreateProps.size);
      expect(garment.material).toBe(garmentTestCreateProps.material);
      expect(garment.seasons).toEqual(garmentTestCreateProps.seasons);

      expect(garment.id).toBeDefined();
      expect(garment.createdAt).toBeDefined();
      expect(garment.updatedAt).toBeDefined();
    });

    it('should save the garment in the repository', async () => {
        const savedGarment = await garmentRepo.getById(garment.id);

        expect(savedGarment).not.toBeNull();
        expect(savedGarment?.toCreateProps()).toEqual(
        garment.toCreateProps(),
        );
    });
  });
});