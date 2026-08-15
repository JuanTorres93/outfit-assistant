import { beforeEach, describe, expect, it } from 'vitest';

import { GetGarmentByIdUseCase } from '../GetGarmentById.usecase';

import { MemoryGarmentRepo } from '@/infra/repos/Memory/MemoryGarmentRepo';
import { Garment } from '@/domain/entities/Garment/Garment';
import { NotFoundDomainError } from '@/domain/common/domainErrors';

import { garmentTestCreateProps } from '@/../tests/createEntitiesTest/garmentCreate';


describe('GetGarmentByIdUseCase', () => {
  let getGarmentByIdUseCase: GetGarmentByIdUseCase;
  let garmentRepo: MemoryGarmentRepo;

  let garment: Garment;

  beforeEach(async () => {
    garmentRepo = new MemoryGarmentRepo();

    getGarmentByIdUseCase = new GetGarmentByIdUseCase(garmentRepo);

    garment = Garment.create({
      ...garmentTestCreateProps,
    });

    await garmentRepo.save(garment);
  });

  describe('Execute', () => {
    it('should return the garment by id', async () => {
      const result = await getGarmentByIdUseCase.execute({
        garmentId: garment.id,
      });

      expect(result).toBeInstanceOf(Garment);
      expect(result.id).toBe(garment.id);
      expect(result.toCreateProps()).toEqual(garment.toCreateProps());
    });

    it('should throw NotFoundDomainError when garment does not exist', async () => {
      await expect(
        getGarmentByIdUseCase.execute({
          garmentId: 'non-existent-id',
        }),
      ).rejects.toThrow(NotFoundDomainError);
    });
  });
});