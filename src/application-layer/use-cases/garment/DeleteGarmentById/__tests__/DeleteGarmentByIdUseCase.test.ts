import { beforeEach, describe, expect, it } from 'vitest';

import { DeleteGarmentByIdUseCase } from '../DeleteGarmentById.usecase';

import { MemoryGarmentRepo } from '@/infra/repos/Memory/MemoryGarmentRepo';
import { Garment } from '@/domain/entities/Garment/Garment';
import { NotFoundDomainError } from '@/domain/common/domainErrors';

import { garmentTestCreateProps } from '@/../tests/createEntitiesTest/garmentCreate';

describe('DeleteGarmentByIdUseCase', () => {
  let deleteGarmentByIdUseCase: DeleteGarmentByIdUseCase;
  let garmentRepo: MemoryGarmentRepo;
  let garment: Garment;

  beforeEach(async () => {
    garmentRepo = new MemoryGarmentRepo();

    deleteGarmentByIdUseCase = new DeleteGarmentByIdUseCase(
      garmentRepo,
    );

    garment = Garment.create({
      ...garmentTestCreateProps,
    });

    await garmentRepo.save(garment);
  });

  describe('Execute', () => {
    it('should delete the garment by id', async () => {
      await deleteGarmentByIdUseCase.execute({
        garmentId: garment.id,
      });

      const deletedGarment = await garmentRepo.getById(garment.id);

      expect(deletedGarment).toBeNull();
    });

    it('should throw NotFoundDomainError when garment does not exist', async () => {
      await expect(
        deleteGarmentByIdUseCase.execute({
          garmentId: 'non-existent-id',
        }),
      ).rejects.toThrow(NotFoundDomainError);
    });
  });
});