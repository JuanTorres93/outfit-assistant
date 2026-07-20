import { describe, expect, it } from 'vitest';

import { WeatherFilter } from '../../weather/WeatherFilter';
import { MatchableGarment } from '../MatchableGarment';
import { OutfitGenerator } from '../OutfitGenerator';

const winterOfficeWeather = WeatherFilter.getConstraints({ temperatureCelsius: 5 });

const criteria = {
  season: 'winter' as const,
  occasion: 'office' as const,
  weatherConstraints: winterOfficeWeather,
};

const businessColor = { name: 'white', hue: 0, brightness: 90, isNeutral: true };

const officeShirt: MatchableGarment = {
  id: 'shirt-1',
  category: 'shirt',
  color: businessColor,
  style: ['business'],
  season: ['winter'],
  occasion: ['office'],
  fit: 'regular',
  warmthLevel: 7,
};

const officePants: MatchableGarment = {
  id: 'pants-1',
  category: 'pants',
  color: businessColor,
  style: ['business'],
  season: ['winter'],
  occasion: ['office'],
  fit: 'regular',
  warmthLevel: 7,
};

const officeShoes: MatchableGarment = {
  id: 'shoes-1',
  category: 'shoes',
  color: businessColor,
  style: ['business'],
  season: ['winter'],
  occasion: ['office'],
  fit: 'regular',
  warmthLevel: 7,
};

const officeJacket: MatchableGarment = {
  id: 'jacket-1',
  category: 'jacket',
  color: businessColor,
  style: ['business'],
  season: ['winter'],
  occasion: ['office'],
  fit: 'regular',
  warmthLevel: 8,
};

const summerOnlyShirt: MatchableGarment = {
  ...officeShirt,
  id: 'shirt-summer',
  season: ['summer'],
};

const gymOnlyShoes: MatchableGarment = {
  ...officeShoes,
  id: 'shoes-gym',
  occasion: ['gym'],
};

const tooLightPants: MatchableGarment = {
  ...officePants,
  id: 'pants-light',
  warmthLevel: 1,
};

describe('OutfitGenerator', () => {
  it('generates an outfit combining a top, bottom and footwear that all match the criteria', () => {
    const candidates = OutfitGenerator.generate([officeShirt, officePants, officeShoes], criteria);

    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates[0].garmentIds).toEqual(
      expect.arrayContaining(['shirt-1', 'pants-1', 'shoes-1']),
    );
  });

  it('generates variants both with and without an available optional outerwear item', () => {
    const candidates = OutfitGenerator.generate(
      [officeShirt, officePants, officeShoes, officeJacket],
      criteria,
    );

    const withJacket = candidates.filter((c) => c.garmentIds.includes('jacket-1'));
    const withoutJacket = candidates.filter((c) => !c.garmentIds.includes('jacket-1'));

    expect(withJacket.length).toBeGreaterThan(0);
    expect(withoutJacket.length).toBeGreaterThan(0);
  });

  it('excludes garments that are not appropriate for the season', () => {
    const candidates = OutfitGenerator.generate(
      [summerOnlyShirt, officePants, officeShoes],
      criteria,
    );

    expect(candidates).toHaveLength(0);
  });

  it('excludes garments that are not appropriate for the occasion', () => {
    const candidates = OutfitGenerator.generate([officeShirt, officePants, gymOnlyShoes], criteria);

    expect(candidates).toHaveLength(0);
  });

  it('excludes garments outside the weather warmth range', () => {
    const candidates = OutfitGenerator.generate(
      [officeShirt, tooLightPants, officeShoes],
      criteria,
    );

    expect(candidates).toHaveLength(0);
  });

  it('does not generate an outfit missing a required slot', () => {
    const candidates = OutfitGenerator.generate([officeShirt, officePants], criteria);

    expect(candidates).toHaveLength(0);
  });
});
