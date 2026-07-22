import { beforeEach, describe, expect, it } from 'vitest';

import { userTestCreateProps } from '@/../tests/createEntitiesTest/userCreate';

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

  it('should create a valid user', () => {
    expect(user).toBeInstanceOf(User);
  });

  describe('Creation', () => {
    it('should have a name', async () => {
      expect(user.name).toBeDefined();
      expect(user.name).toBe(validUserProps.name);
    });

    it('should create user with current date if createdAt is not provided', async () => {
      const propsWithoutCreatedAt = {
        ...validUserProps,
        createdAt: undefined,
      };

      const userWithoutCreatedAt = User.create(propsWithoutCreatedAt);

      expect(userWithoutCreatedAt).toBeInstanceOf(User);
      expect(userWithoutCreatedAt.createdAt).toBeInstanceOf(Date);
      expect(userWithoutCreatedAt.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should create user with current date if updatedAt is not provided', async () => {
      const propsWithoutUpdatedAt = {
        ...validUserProps,
        updatedAt: undefined,
      };

      const userWithoutUpdatedAt = User.create(propsWithoutUpdatedAt);

      expect(userWithoutUpdatedAt).toBeInstanceOf(User);
      expect(userWithoutUpdatedAt.updatedAt).toBeInstanceOf(Date);
      expect(userWithoutUpdatedAt.updatedAt.getTime()).toBeLessThanOrEqual(Date.now());
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

    it('should update password', async () => {
      const newPassword = 'newSecureAndHashedPassword';
      user.updatePassword(newPassword);

      expect(user.hashedPassword).toBe(newPassword);

      expect(user.updatedAt.getTime()).toBeLessThanOrEqual(Date.now());

      expect(user.passwordChangedAt?.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should convert to create props', async () => {
      const createProps = user.toCreateProps();

      expect(createProps).toEqual(validUserProps);
    });
  });
});
