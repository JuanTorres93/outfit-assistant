import { describe, it } from 'vitest';

import { closetDtoProperties } from '@/../tests/dtoProperties/closetDtoProperties';

import ClosetMongo from '../ClosetMongo';
import { assertMongooseModelMatchesDTOProperties } from './assertMongooseSchemaMatchesProperties';

describe('ClosetMongo', () => {
  it('should have (at least) same properties as DTO', () => {
    assertMongooseModelMatchesDTOProperties(ClosetMongo, closetDtoProperties);
  });
});
