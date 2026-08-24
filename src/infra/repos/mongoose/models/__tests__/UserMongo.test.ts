import { describe, expect, it } from 'vitest';

import { userDTOProperties } from '@/../tests/dtoProperties/userDtoProperties';

import ExerciseMongo from '../UserMongo';
import { assertMongooseModelMatchesDTOProperties } from './assertMongooseSchemaMatchesProperties';

describe('UserMongo', () => {
  it('should have (at least) same properties as DTO', () => {
    assertMongooseModelMatchesDTOProperties(ExerciseMongo, userDTOProperties);
  });

  describe('Password-related properties', () => {
    it.each([
      'hashedPassword',
      'passwordChangedAt',
      'passwordResetToken',
      'passwordResetTokenExpiresAt',
    ])('should have property %s', (property) => {
      expect(ExerciseMongo.schema.path(property)).toBeDefined();
    });
  });
});
