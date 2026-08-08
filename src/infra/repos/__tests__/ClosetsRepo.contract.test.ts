import { beforeEach, describe, expect, it } from 'vitest';

import { createTestCloset } from '@/../tests/createEntitiesTest/closetCreate';
import { Closet } from '@/domain/entities/Closet/Closet';

import { MemoryClosetsRepo } from '../Memory/MemoryClosetsRepo';

const repos = [
  { name: 'MemoryClosetsRepo', repoClass: MemoryClosetsRepo },
  // Add more repo implementations here as needed
];

repos.forEach(({ name, repoClass }) => {
  describe(name, () => {
    let repo: InstanceType<typeof repoClass>;
    let closet: Closet;

    beforeEach(async () => {
      closet = createTestCloset();

      repo = new repoClass();

      await repo.save(closet);
    });

    describe('getAll', () => {
      it('should return all closets', async () => {
        const closets = await repo.getAll();

        expect(closets).toEqual([closet]);
      });

      it('should return an empty array if no closets are saved', async () => {
        const emptyRepo = new repoClass();

        const closets = await emptyRepo.getAll();

        expect(closets).toEqual([]);
      });
    });

    describe('save', () => {
      it('should save a closet', async () => {
        const newCloset = createTestCloset({ id: 'new-closet-id', userId: 'new-user-id' });

        const closetsBefore = await repo.getAll();

        const closetIdsBefore = closetsBefore.map((closet) => closet.id);
        const numberOfClosetsBefore = closetsBefore.length;

        expect(closetIdsBefore).not.toContain(newCloset.id);

        await repo.save(newCloset);

        const closetsAfter = await repo.getAll();
        const closetIdsAfter = closetsAfter.map((closet) => closet.id);

        expect(closetIdsAfter).toContain(newCloset.id);
        expect(closetsAfter.length).toBe(numberOfClosetsBefore + 1);
      });

      it('should update a closet if it already existed', async () => {
        const updatedCloset = createTestCloset({ garmentIds: ['garment-id-3'] });

        const closetsBefore = await repo.getAll();
        const closetIdsBefore = closetsBefore.map((closet) => closet.id);
        const numberOfClosetsBefore = closetsBefore.length;

        expect(closetIdsBefore).toContain(closet.id);

        await repo.save(updatedCloset);

        const closetsAfter = await repo.getAll();

        const closetIdsAfter = closetsAfter.map((closet) => closet.id);

        expect(closetIdsAfter).toContain(updatedCloset.id);
        expect(closetsAfter.length).toBe(numberOfClosetsBefore);
      });
    });

    describe('getById', () => {
      it('should return a closet by id', async () => {
        const foundCloset = await repo.getById(closet.id);

        expect(foundCloset).toEqual(closet);
      });

      it('should return null if closet is not found', async () => {
        const foundCloset = await repo.getById('non-existent-id');

        expect(foundCloset).toBeNull();
      });
    });

    describe('getByUserId', () => {
      it('should return a closet by user id', async () => {
        const foundCloset = await repo.getByUserId(closet.userId);

        expect(foundCloset).toEqual(closet);
      });

      it('should return null if closet is not found', async () => {
        const foundCloset = await repo.getByUserId('non-existent-user-id');

        expect(foundCloset).toBeNull();
      });
    });

    describe('deleteById', () => {
      it('should delete a closet by id', async () => {
        await repo.deleteById(closet.id);

        const foundCloset = await repo.getById(closet.id);
        expect(foundCloset).toBeNull();
      });

      it('should do nothing if closet is not found', async () => {
        const closetsBefore = await repo.getAll();

        await repo.deleteById('non-existent-id');

        const closetsAfter = await repo.getAll();
        expect(closetsAfter).toEqual(closetsBefore);
      });
    });
  });
});
