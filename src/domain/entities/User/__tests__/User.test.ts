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

  describe('Creation', () => {
    it('should create a valid user', () => {
      expect(user).toBeInstanceOf(User);
    });
  });

  describe('Behaviour', () => {
    it('should convert to create props', async () => {
      const createProps = user.toCreateProps();

      expect(createProps).toEqual(validUserProps);
    });
  });

  describe('Getters', () => {
    it('should return the correct id', () => {
      expect(user.id).toBe(validUserProps.id);
    });

    it('should return the correct email', () => {
      expect(user.email).toBe(validUserProps.email);
    });

    it('should return the correct createdAt', () => {
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should return the correct updatedAt', () => {
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should return the correct hashedPassword', () => {
      expect(user.hashedPassword).toBe(validUserProps.hashedPassword);
    });
  });
});
