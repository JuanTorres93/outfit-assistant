import { describe, it } from 'vitest';

import { garmentDtoProperties } from '@/../tests/dtoProperties/garmentDtoProperties';

import GarmentMongo from '../GarmentMongo';
import { assertMongooseModelMatchesDTOProperties } from './assertMongooseSchemaMatchesProperties';

describe('GarmentMongo', () => {
  it('should have (at least) same properties as DTO', () => {
    assertMongooseModelMatchesDTOProperties(GarmentMongo, garmentDtoProperties);
  });
});
