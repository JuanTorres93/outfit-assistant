import { beforeEach, describe, expect, it } from 'vitest';

import { createTestCloset } from '@/../tests/createEntitiesTest/closetCreate';
import { closetDtoProperties } from '@/../tests/dtoProperties/closetDtoProperties';
import { Closet } from '@/domain/entities/Closet/Closet';

import { ClosetDTO, toClosetDTO, toClosetEntity } from '../ClosetDTO';

describe('ClosetDTO', () => {
  let closet: Closet;
  let closetDTO: ClosetDTO;

  beforeEach(() => {
    closet = createTestCloset();
  });

  describe('toClosetDTO', () => {
    beforeEach(() => {
      closetDTO = toClosetDTO(closet);
    });

    it('should have a property for each closet getter', () => {
      for (const getter of closetDtoProperties) {
        expect(closetDTO).toHaveProperty(getter);
      }
    });

    it('should convert Closet to ClosetDTO', () => {
      expect(closetDTO).toEqual({
        id: closet.id,

        userId: closet.userId,
        garmentIds: closet.garmentIds,

        createdAt: closet.createdAt.toISOString(),
        updatedAt: closet.updatedAt.toISOString(),
      });
    });
  });

  describe('toClosetEntity', () => {
    beforeEach(() => {
      closetDTO = toClosetDTO(closet);
    });

    it('should convert ClosetDTO back to Closet', () => {
      const closetFromDTO = toClosetEntity(closetDTO);

      expect(closetFromDTO).toBeInstanceOf(Closet);

      expect(closetFromDTO.id).toEqual(closet.id);
      expect(closetFromDTO.userId).toEqual(closet.userId);
      expect(closetFromDTO.garmentIds).toEqual(closet.garmentIds);
      expect(closetFromDTO.createdAt).toEqual(closet.createdAt);
      expect(closetFromDTO.updatedAt).toEqual(closet.updatedAt);
    });
  });
});