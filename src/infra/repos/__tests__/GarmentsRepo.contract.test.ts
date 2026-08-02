import { beforeEach, describe, expect, it } from 'vitest';

import { createTestGarment } from '@/../tests/createEntitiesTest/garmentCreate';

import { Garment } from '@/domain/entities/Garment/Garment';

import { MemoryGarmentRepo } from '../Memory/MemoryGarmentRepo';

const repos = [
  { name: 'MemoryGarmentRepo', repoClass: MemoryGarmentRepo },
];

repos.forEach(({ name, repoClass }) => {
  describe(name, () => {
    let repo: InstanceType<typeof repoClass>;
    let garment: Garment;

    beforeEach(async () => {
      garment = createTestGarment();

      repo = new repoClass();

      await repo.save(garment);
    });

    describe('getAll', () => {
      it('should return all garments', async () => {
        const garments = await repo.getAll();

        expect(garments).toEqual([garment]);
      });

      it('should return an empty array if no garments are saved', async () => {
        const emptyRepo = new repoClass();

        const garments = await emptyRepo.getAll();

        expect(garments).toEqual([]);
      });
    });

    describe('save', () => {
      it('should save a garment', async () => {
        const newGarment = createTestGarment({
          id: 'new-garment-id',
        });

        const garmentsBefore = await repo.getAll();

        const garmentIdsBefore = garmentsBefore.map(
          (garment) => garment.id,
        );
        const numberOfGarmentsBefore = garmentsBefore.length;

        expect(garmentIdsBefore).not.toContain(newGarment.id);

        await repo.save(newGarment);

        const garmentsAfter = await repo.getAll();
        const garmentIdsAfter = garmentsAfter.map(
          (garment) => garment.id,
        );

        expect(garmentIdsAfter).toContain(newGarment.id);
        expect(garmentsAfter.length).toBe(
          numberOfGarmentsBefore + 1,
        );
      });
    });

    describe('getById', () => {
      it('should return a garment by id', async () => {
        const foundGarment = await repo.getById(garment.id);

        expect(foundGarment).toEqual(garment);
      });

      it('should return null if garment is not found', async () => {
        const foundGarment = await repo.getById(
          'id-that-doesnt-exist',
        );

        expect(foundGarment).toBeNull();
      });
    });

    describe('getByName', () => {
      it('should return a garment by name', async () => {
        const foundGarment = await repo.getByName(
          garment.name,
        );

        expect(foundGarment).toEqual(garment);
      });

      it('should return null if garment is not found', async () => {
        const foundGarment = await repo.getByName(
          'name-that-doesnt-exist',
        );

        expect(foundGarment).toBeNull();
      });
    });

    describe('deleteById', () => {
      it('should delete a garment by id', async () => {
        await repo.deleteById(garment.id);

        const foundGarment = await repo.getById(
          garment.id,
        );

        expect(foundGarment).toBeNull();
      });

      it('should do nothing if garment is not found', async () => {
        const garmentsBefore = await repo.getAll();

        await repo.deleteById('id-that-doesnt-exist');

        const garmentsAfter = await repo.getAll();

        expect(garmentsAfter).toEqual(garmentsBefore);
      });
    });
  });
});