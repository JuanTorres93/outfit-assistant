import { describe, it } from 'vitest';

import { outfitDtoProperties } from '@/../tests/dtoProperties/outfitDtoProperties';

import OutfitMongo from '../OutfitMongo';
import { assertMongooseModelMatchesDTOProperties } from './assertMongooseSchemaMatchesProperties';

describe('OutfitMongo', () => {
  it('should have (at least) same properties as DTO', () => {
    assertMongooseModelMatchesDTOProperties(OutfitMongo, outfitDtoProperties);
  });
});
