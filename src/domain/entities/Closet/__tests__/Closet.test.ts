import { beforeEach, describe, expect, it } from 'vitest';

import { closetTestCreateProps, testClosetId } from '@/../tests/createEntitiesTest/closetCreate';
import { AlreadyExistsDomainError, NotFoundDomainError } from '@/domain/common/domainErrors';

import { Closet, ClosetCreateProps } from '../Closet';

describe('Closet', () => {
  let closet: Closet;
  let validClosetProps: ClosetCreateProps;

  beforeEach(() => {
    validClosetProps = {
      ...closetTestCreateProps,
    };
    closet = Closet.create(validClosetProps);
  });

  it('should create a valid closet', () => {
    expect(closet).toBeInstanceOf(Closet);
  });

  describe('Creation', () => {
    it('should create closet with current date if createdAt is not provided', () => {
      const propsWithoutCreatedAt = {
        ...validClosetProps,
        createdAt: undefined,
      };

      const closetWithoutCreatedAt = Closet.create(propsWithoutCreatedAt);

      expect(closetWithoutCreatedAt).toBeInstanceOf(Closet);
      expect(closetWithoutCreatedAt.createdAt).toBeInstanceOf(Date);
      expect(closetWithoutCreatedAt.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should create closet with current date if updatedAt is not provided', () => {
      const propsWithoutUpdatedAt = {
        ...validClosetProps,
        updatedAt: undefined,
      };

      const closetWithoutUpdatedAt = Closet.create(propsWithoutUpdatedAt);

      expect(closetWithoutUpdatedAt).toBeInstanceOf(Closet);
      expect(closetWithoutUpdatedAt.updatedAt).toBeInstanceOf(Date);
      expect(closetWithoutUpdatedAt.updatedAt.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should create closet with no garments if garmentIds is not provided', () => {
      const propsWithoutGarmentIds = {
        ...validClosetProps,
        garmentIds: undefined,
      };

      const closetWithoutGarmentIds = Closet.create(propsWithoutGarmentIds);

      expect(closetWithoutGarmentIds.garmentIds).toEqual([]);
    });

    it('should throw a validation error if garmentIds contains a duplicate id', () => {
      expect(() =>
        Closet.create({
          ...validClosetProps,
          garmentIds: ['garment-id-1', 'garment-id-1'],
        }),
      ).toThrow(AlreadyExistsDomainError);
    });
  });

  describe('Behaviour', () => {
    it('should convert to create props', () => {
      const createProps = closet.toCreateProps();

      expect(createProps).toEqual(validClosetProps);
    });

    describe('addGarment', () => {
      it('should add a garment id to the closet', () => {
        closet.addGarment('garment-id-3');

        expect(closet.garmentIds).toContain('garment-id-3');
      });

      it('should update updatedAt when adding a garment', () => {
        const previousUpdatedAt = closet.updatedAt;

        closet.addGarment('garment-id-3');

        expect(closet.updatedAt.getTime()).toBeGreaterThanOrEqual(previousUpdatedAt.getTime());
      });

      it('should throw when adding a garment id already in the closet', () => {
        expect(() => closet.addGarment('garment-id-1')).toThrow(AlreadyExistsDomainError);
      });
    });

    describe('removeGarment', () => {
      it('should remove a garment id from the closet', () => {
        closet.removeGarment('garment-id-1');

        expect(closet.garmentIds).not.toContain('garment-id-1');
      });

      it('should update updatedAt when removing a garment', () => {
        const previousUpdatedAt = closet.updatedAt;

        closet.removeGarment('garment-id-1');

        expect(closet.updatedAt.getTime()).toBeGreaterThanOrEqual(previousUpdatedAt.getTime());
      });

      it('should throw when removing a garment id not in the closet', () => {
        expect(() => closet.removeGarment('non-existent-garment-id')).toThrow(NotFoundDomainError);
      });
    });

    describe('hasGarment', () => {
      it('should return true when the garment id is in the closet', () => {
        expect(closet.hasGarment('garment-id-1')).toBe(true);
      });

      it('should return false when the garment id is not in the closet', () => {
        expect(closet.hasGarment('non-existent-garment-id')).toBe(false);
      });
    });
  });

  describe('Getters', () => {
    it('should return the correct id', () => {
      expect(closet.id).toBe(testClosetId);
    });

    it('should return the correct userId', () => {
      expect(closet.userId).toBe(validClosetProps.userId);
    });

    it('should return the correct garmentIds', () => {
      expect(closet.garmentIds).toEqual(validClosetProps.garmentIds);
    });

    it('should return the correct createdAt', () => {
      expect(closet.createdAt).toBeInstanceOf(Date);
    });

    it('should return the correct updatedAt', () => {
      expect(closet.updatedAt).toBeInstanceOf(Date);
    });
  });
});
