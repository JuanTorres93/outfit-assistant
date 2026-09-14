import { beforeEach, describe, expect, it } from 'vitest';

import { createTestGarment } from '@/../tests/createEntitiesTest/garmentCreate';
import { garmentDtoProperties } from '@/../tests/dtoProperties/garmentDtoProperties';
import { Garment } from '@/domain/entities/Garment/Garment';

import { GarmentDTO, toGarmentDTO, toGarmentEntity } from '../GarmentDTO';

describe('GarmentDTO', () => {
  let garment: Garment;

  let garmentDTO: GarmentDTO;

  beforeEach(() => {
    garment = createTestGarment();
  });

  describe('toGarmentDTO', () => {
    beforeEach(() => {
      garmentDTO = toGarmentDTO(garment);
    });

    it('should have a property for each garment getter', () => {
      for (const getter of garmentDtoProperties) {
        expect(garmentDTO).toHaveProperty(getter);
      }
    });

    it('should convert Garment to GarmentDTO', () => {
      expect(garmentDTO).toEqual({
        id: garment.id,
        name: garment.name,
        category: garment.category,
        colors: garment.colors,
        brand: garment.brand,
        size: garment.size,
        material: garment.material,
        seasons: garment.seasons,
        createdAt: garment.createdAt.toISOString(),
        updatedAt: garment.updatedAt.toISOString(),
      });
    });
  });

  describe('toGarmentEntity', () => {
    beforeEach(() => {
      garmentDTO = toGarmentDTO(garment);
    });

    it('should convert GarmentDTO back to Garment', () => {
      const garmentFromDTO = toGarmentEntity(garmentDTO);

      expect(garmentFromDTO).toBeInstanceOf(Garment);

      expect(garmentFromDTO.id).toEqual(garment.id);
      expect(garmentFromDTO.name).toEqual(garment.name);
      expect(garmentFromDTO.category).toEqual(garment.category);
      expect(garmentFromDTO.colors).toEqual(garment.colors);
      expect(garmentFromDTO.brand).toEqual(garment.brand);
      expect(garmentFromDTO.size).toEqual(garment.size);
      expect(garmentFromDTO.material).toEqual(garment.material);
      expect(garmentFromDTO.seasons).toEqual(garment.seasons);
      expect(garmentFromDTO.createdAt).toEqual(garment.createdAt);
      expect(garmentFromDTO.updatedAt).toEqual(garment.updatedAt);
    });
  });
});
