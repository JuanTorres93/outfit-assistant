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
    it('should not allow an empty name', () => {
      expect(() =>
        Garment.create({
          ...validGarmentProps,
          name: '',
        }),
      ).toThrow();
    });

    it('should not allow a name longer than 100 characters', () => {
      expect(() =>
        Garment.create({
          ...validGarmentProps,
          name: 'a'.repeat(101),
        }),
      ).toThrow();
    });
  });

  describe('Behaviour', () => {
    it('should convert to create props', () => {
      const createProps = garment.toCreateProps();

      expect(createProps).toEqual(validGarmentProps);
    });
     it('should change the name', () => {
      garment.changeName('New Garment Name');

      expect(garment.name).toBe('New Garment Name');
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