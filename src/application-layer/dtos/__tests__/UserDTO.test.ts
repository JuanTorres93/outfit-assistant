import { beforeEach, describe, expect, it } from 'vitest';

import { createTestUser } from '@/../tests/createEntitiesTest/userCreate';
import { userDTOProperties } from '@/../tests/dtoProperties/userDtoProperties';
import { User } from '@/domain/entities/User/User';

import { UserDTO, toUserDTO, toUserFromDTO } from '../UserDTO';

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

  describe('toUserFromDTO', () => {
    beforeEach(() => {
      userDTO = toUserDTO(user);
    });

    it('should convert UserDTO back to User', () => {
      const userFromDTO = toUserFromDTO(userDTO, {
        hashedPassword: user.hashedPassword,
      });

      expect(userFromDTO).toBeInstanceOf(User);

      expect(userFromDTO.id).toEqual(user.id);
      expect(userFromDTO.name).toEqual(user.name);
      expect(userFromDTO.email).toEqual(user.email);
    });

    it('should include password-related properties when converting back to User', () => {
      const passwordProps = {
        passwordChangedAt: new Date(),
        passwordResetToken: 'resetToken',
        passwordResetTokenExpiresAt: new Date(),
      };

      const userWithPasswordProps = createTestUser({
        passwordChangedAt: passwordProps.passwordChangedAt,
        passwordResetToken: passwordProps.passwordResetToken,
        passwordResetTokenExpiresAt: passwordProps.passwordResetTokenExpiresAt,
      });

      const userFromDTO = toUserFromDTO(userDTO, {
        hashedPassword: userWithPasswordProps.hashedPassword,
        ...passwordProps,
      });

      expect(userFromDTO).toBeInstanceOf(User);

      expect(userFromDTO.hashedPassword).toEqual(userWithPasswordProps.hashedPassword);
      expect(userFromDTO.passwordChangedAt).toEqual(passwordProps.passwordChangedAt);
      expect(userFromDTO.passwordResetToken).toEqual(passwordProps.passwordResetToken);
      expect(userFromDTO.passwordResetTokenExpiresAt).toEqual(
        passwordProps.passwordResetTokenExpiresAt,
      );
    });
  });
});
