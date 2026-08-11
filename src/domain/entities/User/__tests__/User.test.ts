import { beforeEach, describe, expect, it } from 'vitest';

import { createTestUser, userTestCreateProps } from '@/../tests/createEntitiesTest/userCreate';

import { User, UserCreateProps } from '../User';

describe('User', () => {
  let user: User;
  let validUserProps: UserCreateProps;

  beforeEach(() => {
    validUserProps = {
      ...userTestCreateProps,
    };
    user = User.create(validUserProps);
  });

  describe('Creation', () => {
    it('should create a valid user', () => {
      expect(user).toBeInstanceOf(User);
    });

    it('should clone itself as a new entity', async () => {
      const clonedUser = user.clone();

      expect(clonedUser).toBeInstanceOf(User);
      expect(clonedUser).not.toBe(user);
      expect(clonedUser.toCreateProps()).toEqual(user.toCreateProps());
    });
  });

  describe('Behaviour', () => {
    it('should change the name', async () => {
      const newName = 'New Test User';
      user.changeName(newName);

      expect(user.name).toBe(newName);
    });

    it('should convert to create props', async () => {
      const createProps = user.toCreateProps();

      expect(createProps).toEqual(validUserProps);
    });

    describe('Password change', () => {
      const newHashedPassword = 'new-hashed-password-123';

      it('should update hashedPassword', async () => {
        expect(user.hashedPassword).not.toBe(newHashedPassword);

        user.changePassword(newHashedPassword);

        expect(user.hashedPassword).toBe(newHashedPassword);
      });

      it('should update passwordChangedAt when changing password', async () => {
        const initialPasswordChangedAt = user.passwordChangedAt;

        user.changePassword(newHashedPassword);

        expect(user.passwordChangedAt).not.toBe(initialPasswordChangedAt);
      });

      it('should update updatedAt when changing password', () => {
        const initialUpdatedAt = user.updatedAt;

        user.changePassword(newHashedPassword);

        expect(user.updatedAt).not.toBe(initialUpdatedAt);
      });

      it('should clear reset token', () => {
        const userWithResetToken = createTestUser({
          passwordResetToken: 'reset-token',
        });

        expect(userWithResetToken.passwordResetToken).toBe('reset-token');

        userWithResetToken.changePassword(newHashedPassword);

        expect(userWithResetToken.passwordResetToken).toBeUndefined();
      });

      it('should clear reset token expiry', () => {
        const userWithResetTokenExpiry = createTestUser({
          passwordResetTokenExpiresAt: new Date(Date.now() + 3600000),
        });

        expect(userWithResetTokenExpiry.passwordResetTokenExpiresAt).toBeDefined();

        userWithResetTokenExpiry.changePassword(newHashedPassword);

        expect(userWithResetTokenExpiry.passwordResetTokenExpiresAt).toBeUndefined();
      });
    });
  });
});
