import { beforeEach, describe, expect, it } from 'vitest';

import { createTestOutfit } from '@/../tests/createEntitiesTest/outfitCreate';
import { outfitDtoProperties } from '@/../tests/dtoProperties/outfitDtoProperties';
import { Outfit } from '@/domain/entities/Outfit/Outfit';

import { OutfitDTO, toOutfitDTO, toOutfitEntity } from '../OutfitDTO';

describe('OutfitDTO', () => {
  let outfit: Outfit;
  let outfitDTO: OutfitDTO;

  beforeEach(() => {
    outfit = createTestOutfit();
  });

  describe('toOutfitDTO', () => {
    beforeEach(() => {
      outfitDTO = toOutfitDTO(outfit);
    });

    it('should have a property for each outfit getter', () => {
      for (const getter of outfitDtoProperties) {
        expect(outfitDTO).toHaveProperty(getter);
      }
    });

    it('should convert Outfit to OutfitDTO', () => {
      expect(outfitDTO).toEqual({
        id: outfit.id,

        userId: outfit.userId,
        name: outfit.name,
        garmentIds: outfit.garmentIds,

        createdAt: outfit.createdAt.toISOString(),
        updatedAt: outfit.updatedAt.toISOString(),
      });
    });
  });

  describe('toOutfitEntity', () => {
    beforeEach(() => {
      outfitDTO = toOutfitDTO(outfit);
    });

    it('should convert OutfitDTO back to Outfit', () => {
      const outfitFromDTO = toOutfitEntity(outfitDTO);

      expect(outfitFromDTO).toBeInstanceOf(Outfit);

      expect(outfitFromDTO.id).toEqual(outfit.id);
      expect(outfitFromDTO.userId).toEqual(outfit.userId);
      expect(outfitFromDTO.name).toEqual(outfit.name);
      expect(outfitFromDTO.garmentIds).toEqual(outfit.garmentIds);
      expect(outfitFromDTO.createdAt).toEqual(outfit.createdAt);
      expect(outfitFromDTO.updatedAt).toEqual(outfit.updatedAt);
    });
  });
});
