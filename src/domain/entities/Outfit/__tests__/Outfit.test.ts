import { beforeEach, describe, expect, it } from 'vitest';

import { outfitTestCreateProps, testOutfitId } from '@/../tests/createEntitiesTest/outfitCreate';
import { AlreadyExistsDomainError, NotFoundDomainError } from '@/domain/common/domainErrors';

import { Outfit, OutfitCreateProps } from '../Outfit';

describe('Outfit', () => {
  let outfit: Outfit;
  let validOutfitProps: OutfitCreateProps;

  beforeEach(() => {
    validOutfitProps = {
      ...outfitTestCreateProps,
    };
    outfit = Outfit.create(validOutfitProps);
  });

  it('should create a valid outfit', () => {
    expect(outfit).toBeInstanceOf(Outfit);
  });

  describe('Creation', () => {
    it('should have a name', () => {
      expect(outfit.name).toBe(validOutfitProps.name);
    });

    it('should create outfit with current date if createdAt is not provided', () => {
      const propsWithoutCreatedAt = {
        ...validOutfitProps,
        createdAt: undefined,
      };

      const outfitWithoutCreatedAt = Outfit.create(propsWithoutCreatedAt);

      expect(outfitWithoutCreatedAt).toBeInstanceOf(Outfit);
      expect(outfitWithoutCreatedAt.createdAt).toBeInstanceOf(Date);
      expect(outfitWithoutCreatedAt.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should create outfit with current date if updatedAt is not provided', () => {
      const propsWithoutUpdatedAt = {
        ...validOutfitProps,
        updatedAt: undefined,
      };

      const outfitWithoutUpdatedAt = Outfit.create(propsWithoutUpdatedAt);

      expect(outfitWithoutUpdatedAt).toBeInstanceOf(Outfit);
      expect(outfitWithoutUpdatedAt.updatedAt).toBeInstanceOf(Date);
      expect(outfitWithoutUpdatedAt.updatedAt.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should create outfit with no garments if garmentIds is not provided', () => {
      const propsWithoutGarmentIds = {
        ...validOutfitProps,
        garmentIds: undefined,
      };

      const outfitWithoutGarmentIds = Outfit.create(propsWithoutGarmentIds);

      expect(outfitWithoutGarmentIds.garmentIds).toEqual([]);
    });

    it('should throw when garmentIds contains a duplicate id', () => {
      expect(() =>
        Outfit.create({
          ...validOutfitProps,
          garmentIds: ['garment-id-1', 'garment-id-1'],
        }),
      ).toThrow(AlreadyExistsDomainError);
    });

    it('should throw a validation error when name is empty', () => {
      expect(() => Outfit.create({ ...validOutfitProps, name: '' })).toThrow();
      expect(() => Outfit.create({ ...validOutfitProps, name: '   ' })).toThrow();
    });
  });

  describe('Behaviour', () => {
    it('should convert to create props', () => {
      const createProps = outfit.toCreateProps();

      expect(createProps).toEqual(validOutfitProps);
    });

    describe('rename', () => {
      it('should change the name', () => {
        const newName = 'Party look';

        outfit.rename(newName);

        expect(outfit.name).toBe(newName);
      });

      it('should update updatedAt when renaming', () => {
        const previousUpdatedAt = outfit.updatedAt;

        outfit.rename('Party look');

        expect(outfit.updatedAt.getTime()).toBeGreaterThanOrEqual(previousUpdatedAt.getTime());
      });
    });

    describe('addGarment', () => {
      it('should add a garment id to the outfit', () => {
        outfit.addGarment('garment-id-3');

        expect(outfit.garmentIds).toContain('garment-id-3');
      });

      it('should update updatedAt when adding a garment', () => {
        const previousUpdatedAt = outfit.updatedAt;

        outfit.addGarment('garment-id-3');

        expect(outfit.updatedAt.getTime()).toBeGreaterThanOrEqual(previousUpdatedAt.getTime());
      });

      it('should throw when adding a garment id already in the outfit', () => {
        expect(() => outfit.addGarment('garment-id-1')).toThrow(AlreadyExistsDomainError);
      });
    });

    describe('removeGarment', () => {
      it('should remove a garment id from the outfit', () => {
        outfit.removeGarment('garment-id-1');

        expect(outfit.garmentIds).not.toContain('garment-id-1');
      });

      it('should update updatedAt when removing a garment', () => {
        const previousUpdatedAt = outfit.updatedAt;

        outfit.removeGarment('garment-id-1');

        expect(outfit.updatedAt.getTime()).toBeGreaterThanOrEqual(previousUpdatedAt.getTime());
      });

      it('should throw when removing a garment id not in the outfit', () => {
        expect(() => outfit.removeGarment('non-existent-garment-id')).toThrow(NotFoundDomainError);
      });
    });

    describe('hasGarment', () => {
      it('should return true when the garment id is in the outfit', () => {
        expect(outfit.hasGarment('garment-id-1')).toBe(true);
      });

      it('should return false when the garment id is not in the outfit', () => {
        expect(outfit.hasGarment('non-existent-garment-id')).toBe(false);
      });
    });
  });

  describe('Getters', () => {
    it('should return the correct id', () => {
      expect(outfit.id).toBe(testOutfitId);
    });

    it('should return the correct userId', () => {
      expect(outfit.userId).toBe(validOutfitProps.userId);
    });

    it('should return the correct name', () => {
      expect(outfit.name).toBe(validOutfitProps.name);
    });

    it('should return the correct garmentIds', () => {
      expect(outfit.garmentIds).toEqual(validOutfitProps.garmentIds);
    });

    it('should return the correct createdAt', () => {
      expect(outfit.createdAt).toBeInstanceOf(Date);
    });

    it('should return the correct updatedAt', () => {
      expect(outfit.updatedAt).toBeInstanceOf(Date);
    });
  });
});
