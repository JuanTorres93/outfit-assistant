import { beforeEach, describe, expect, it } from 'vitest';

import { createTestOutfit } from '@/../tests/createEntitiesTest/outfitCreate';
import { Outfit } from '@/domain/entities/Outfit/Outfit';

import { MemoryOutfitsRepo } from '../Memory/MemoryOutfitsRepo';

const repos = [
  { name: 'MemoryOutfitsRepo', repoClass: MemoryOutfitsRepo },
  // Add more repo implementations here as needed
];

repos.forEach(({ name, repoClass }) => {
  describe(name, () => {
    let repo: InstanceType<typeof repoClass>;
    let outfit: Outfit;

    beforeEach(async () => {
      outfit = createTestOutfit();

      repo = new repoClass();

      await repo.save(outfit);
    });

    describe('getAll', () => {
      it('should return all outfits', async () => {
        const outfits = await repo.getAll();

        expect(outfits).toEqual([outfit]);
      });

      it('should return an empty array if no outfits are saved', async () => {
        const emptyRepo = new repoClass();

        const outfits = await emptyRepo.getAll();

        expect(outfits).toEqual([]);
      });
    });

    describe('save', () => {
      it('should save an outfit', async () => {
        const newOutfit = createTestOutfit({ id: 'new-outfit-id' });

        const outfitsBefore = await repo.getAll();

        const outfitIdsBefore = outfitsBefore.map((outfit) => outfit.id);
        const numberOfOutfitsBefore = outfitsBefore.length;

        expect(outfitIdsBefore).not.toContain(newOutfit.id);

        await repo.save(newOutfit);

        const outfitsAfter = await repo.getAll();
        const outfitIdsAfter = outfitsAfter.map((outfit) => outfit.id);

        expect(outfitIdsAfter).toContain(newOutfit.id);
        expect(outfitsAfter.length).toBe(numberOfOutfitsBefore + 1);
      });

      it('should update an outfit if it already existed', async () => {
        const updatedOutfit = createTestOutfit({ name: 'Updated look' });

        const outfitsBefore = await repo.getAll();
        const outfitIdsBefore = outfitsBefore.map((outfit) => outfit.id);
        const numberOfOutfitsBefore = outfitsBefore.length;

        expect(outfitIdsBefore).toContain(outfit.id);

        await repo.save(updatedOutfit);

        const outfitsAfter = await repo.getAll();

        const outfitIdsAfter = outfitsAfter.map((outfit) => outfit.id);

        expect(outfitIdsAfter).toContain(updatedOutfit.id);
        expect(outfitsAfter.length).toBe(numberOfOutfitsBefore);
      });
    });

    describe('getById', () => {
      it('should return an outfit by id', async () => {
        const foundOutfit = await repo.getById(outfit.id);

        expect(foundOutfit).toEqual(outfit);
      });

      it('should return null if outfit is not found', async () => {
        const foundOutfit = await repo.getById('non-existent-id');

        expect(foundOutfit).toBeNull();
      });
    });

    describe('getAllByUserId', () => {
      it('should return all outfits for a user', async () => {
        const foundOutfits = await repo.getAllByUserId(outfit.userId);

        expect(foundOutfits).toEqual([outfit]);
      });

      it('should return an empty array if user has no outfits', async () => {
        const foundOutfits = await repo.getAllByUserId('non-existent-user-id');

        expect(foundOutfits).toEqual([]);
      });
    });

    describe('deleteById', () => {
      it('should delete an outfit by id', async () => {
        await repo.deleteById(outfit.id);

        const foundOutfit = await repo.getById(outfit.id);
        expect(foundOutfit).toBeNull();
      });

      it('should do nothing if outfit is not found', async () => {
        const outfitsBefore = await repo.getAll();

        await repo.deleteById('non-existent-id');

        const outfitsAfter = await repo.getAll();
        expect(outfitsAfter).toEqual(outfitsBefore);
      });
    });
  });
});
