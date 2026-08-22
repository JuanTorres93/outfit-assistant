import { beforeEach, describe, expect, it } from 'vitest';

import { createTestUser } from '@/../tests/createEntitiesTest/userCreate';
import { userDTOProperties } from '@/../tests/dtoProperties/userDtoProperties';
import { User } from '@/domain/entities/User/User';

import { UserDTO, toUserDTO } from '../UserDTO';

describe('UserDTO', () => {
  let user: User;
  let userDTO: UserDTO;

  beforeEach(() => {
    user = createTestUser();
  });

  describe('toUserDTO', () => {
    beforeEach(() => {
      userDTO = toUserDTO(user);
    });

    it('should have a property for each user getter except for password-related ones', async () => {
      for (const getter of userDTOProperties) {
        expect(userDTO).toHaveProperty(getter);
      }

      for (const property of Object.keys(userDTO)) {
        expect(property).not.toMatch(/password/i);
      }
    });

    it('should convert User to UserDTO', () => {
      expect(userDTO).toEqual({
        id: user.id,

        name: user.name,
        email: user.email,

        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });
    });
  });
});
