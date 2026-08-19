import { beforeEach, describe, expect, it } from 'vitest';

import { createTestGarment } from '@/../tests/createEntitiesTest/garmentCreate';
import { Season } from '@/domain/value-objects/Season/Season';

import { MemoryGarmentsBySeasonService } from '../MemoryGarmentsBySeasonService';

describe('MemoryGarmentsBySeasonService', () => {
  let garmentsBySeasonService: MemoryGarmentsBySeasonService;

  beforeEach(() => {
    garmentsBySeasonService = new MemoryGarmentsBySeasonService();
  });

  it('should return garments suitable for the given season', () => {
    const tShirt = createTestGarment({
      seasons: ['spring', 'summer', 'autumn', 'winter'],
    });

    const shorts = createTestGarment({
      seasons: ['spring', 'summer'],
    });

    const coat = createTestGarment({
      seasons: ['autumn', 'winter'],
    });

    const result = garmentsBySeasonService.getGarmentsBySeason(
      [tShirt, shorts, coat],
      Season.create('winter'),
    );

    expect(result).toEqual([tShirt, shorts, coat]);
  });

  it('should not return garments that do not belong to the requested season', () => {
    const shorts = createTestGarment({
      seasons: ['summer'],
    });

    const coat = createTestGarment({
      seasons: ['autumn', 'winter'],
    });

    const result = garmentsBySeasonService.getGarmentsBySeason(
      [shorts, coat],
      Season.create('winter'),
    );

    expect(result).toEqual([coat]);
  });
  it('should return an empty array when no garment belongs to the requested season', () => {
    const shorts = createTestGarment({
      seasons: ['summer'],
    });

    const sandals = createTestGarment({
      seasons: ['summer'],
    });

    const result = garmentsBySeasonService.getGarmentsBySeason(
      [shorts, sandals],
      Season.create('winter'),
    );

    expect(result).toEqual([]);
  });

  it('should return an empty array when no garments are provided', () => {
    const result = garmentsBySeasonService.getGarmentsBySeason([], Season.create('winter'));

    expect(result).toEqual([]);
  });
  it('should return garments from an adjacent season', () => {
    const summerGarment = createTestGarment({
      seasons: ['summer'],
    });

    const result = garmentsBySeasonService.getGarmentsBySeason(
      [summerGarment],
      Season.create('spring'),
    );

    expect(result).toEqual([summerGarment]);
  });

  it.each([
    ['spring', 'summer'],
    ['spring', 'winter'],
    ['summer', 'spring'],
    ['summer', 'autumn'],
    ['autumn', 'summer'],
    ['autumn', 'winter'],
    ['winter', 'autumn'],
    ['winter', 'spring'],
  ])('should consider %s and %s as compatible seasons', (targetSeason, garmentSeason) => {
    const garment = createTestGarment({
      seasons: [garmentSeason],
    });

    const result = garmentsBySeasonService.getGarmentsBySeason(
      [garment],
      Season.create(targetSeason),
    );

    expect(result).toEqual([garment]);
  });

  it.each([
    ['spring', 'autumn'],
    ['autumn', 'spring'],
    ['summer', 'winter'],
    ['winter', 'summer'],
  ])('should not consider %s and %s as compatible seasons', (targetSeason, garmentSeason) => {
    const garment = createTestGarment({
      seasons: [garmentSeason],
    });

    const result = garmentsBySeasonService.getGarmentsBySeason(
      [garment],
      Season.create(targetSeason),
    );

    expect(result).toEqual([]);
  });

  it('should return a garment when any of its seasons is compatible', () => {
    const garment = createTestGarment({
      seasons: ['summer', 'autumn'],
    });

    const result = garmentsBySeasonService.getGarmentsBySeason([garment], Season.create('winter'));

    expect(result).toEqual([garment]);
  });

  it('should return only garments compatible with the requested season', () => {
    const winterGarment = createTestGarment({
      seasons: ['winter'],
    });

    const autumnGarment = createTestGarment({
      seasons: ['autumn'],
    });

    const springGarment = createTestGarment({
      seasons: ['spring'],
    });

    const summerGarment = createTestGarment({
      seasons: ['summer'],
    });

    const allSeasonGarment = createTestGarment({
      seasons: ['spring', 'summer', 'autumn', 'winter'],
    });

    const result = garmentsBySeasonService.getGarmentsBySeason(
      [winterGarment, autumnGarment, springGarment, summerGarment, allSeasonGarment],
      Season.create('winter'),
    );

    expect(result).toEqual([winterGarment, autumnGarment, springGarment, allSeasonGarment]);
  });
});
