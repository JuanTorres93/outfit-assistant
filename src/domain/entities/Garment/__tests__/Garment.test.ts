import { beforeEach, describe, expect, it } from 'vitest';

import { garmentTestCreateProps } from '@/../tests/createEntitiesTest/garmentCreate';

import { Garment, GarmentCreateProps } from '../Garment';

describe('Garment', () => {
  let garment: Garment;
  let validGarmentProps: GarmentCreateProps;

  beforeEach(() => {
    validGarmentProps = {
      ...garmentTestCreateProps,
    };

    garment = Garment.create(validGarmentProps);
  });

  it('should create a valid garment', () => {
    expect(garment).toBeInstanceOf(Garment);
  });

  describe('Creation', () => {
    it('should create garment with current date if createdAt is not provided', () => {
      const propsWithoutCreatedAt = {
        ...validGarmentProps,
        createdAt: undefined,
      };

      const garmentWithoutCreatedAt = Garment.create(propsWithoutCreatedAt);

      expect(garmentWithoutCreatedAt).toBeInstanceOf(Garment);
      expect(garmentWithoutCreatedAt.createdAt).toBeInstanceOf(Date);
      expect(garmentWithoutCreatedAt.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should create garment with current date if updatedAt is not provided', () => {
      const propsWithoutUpdatedAt = {
        ...validGarmentProps,
        updatedAt: undefined,
      };

      const garmentWithoutUpdatedAt = Garment.create(propsWithoutUpdatedAt);

      expect(garmentWithoutUpdatedAt).toBeInstanceOf(Garment);
      expect(garmentWithoutUpdatedAt.updatedAt).toBeInstanceOf(Date);
      expect(garmentWithoutUpdatedAt.updatedAt.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('Behaviour', () => {
    it('should convert to create props', () => {
      const createProps = garment.toCreateProps();

      expect(createProps).toEqual(validGarmentProps);
    });
  });

  describe('Getters', () => {
    it('should return the correct id', () => {
      expect(garment.id).toBe(validGarmentProps.id);
    });

    it('should return the correct name', () => {
      expect(garment.name).toBe(validGarmentProps.name);
    });

    it('should return the correct category', () => {
      expect(garment.category).toBe(validGarmentProps.category);
    });

    it('should return the correct colors', () => {
      expect(garment.colors).toEqual(validGarmentProps.colors);
    });

    it('should return the correct brand', () => {
      expect(garment.brand).toBe(validGarmentProps.brand);
    });

    it('should return the correct size', () => {
      expect(garment.size).toBe(validGarmentProps.size);
    });

    it('should return the correct material', () => {
      expect(garment.material).toBe(validGarmentProps.material);
    });

    it('should return the correct seasons', () => {
      expect(garment.seasons).toEqual(validGarmentProps.seasons);
    });

    it('should return the correct createdAt', () => {
      expect(garment.createdAt).toBeInstanceOf(Date);
    });

    it('should return the correct updatedAt', () => {
      expect(garment.updatedAt).toBeInstanceOf(Date);
    });
  });
});