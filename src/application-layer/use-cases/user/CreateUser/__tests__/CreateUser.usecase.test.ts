import { beforeEach, describe, expect, it } from 'vitest';

import { userTestCreateProps } from '@/../tests/createEntitiesTest/userCreate';
import { userDTOProperties } from '@/../tests/dtoProperties/userDtoProperties';
import { UserDTO } from '@/application-layer/dtos/UserDTO';
import { IdGenerator } from '@/application-layer/services/IdGenerator.port';
import { AlreadyExistsDomainError } from '@/domain/common/domainErrors';
import { User } from '@/domain/entities/User/User';
import { MemoryUsersRepo } from '@/infra/repos/Memory/MemoryUsersRepo';
import { CryptoUUIDIdGenerator } from '@/infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator';
import { DummyPasswordHasher } from '@/infra/services/PasswordHasher/DummyPasswordEncryptorHasher/DummyPasswordEncryptorHasher';

import { CreateUserUsecase } from '../CreateUser.usecase';

describe('CreateUserUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let passwordEncryptor: DummyPasswordHasher;
  let idGenerator: IdGenerator;

  let createUserUsecase: CreateUserUsecase;
  let user: UserDTO;

  const plainPassword = 'secureP@ssword123';

  beforeEach(async () => {
    usersRepo = new MemoryUsersRepo();
    passwordEncryptor = new DummyPasswordHasher();
    idGenerator = new CryptoUUIDIdGenerator();

    createUserUsecase = new CreateUserUsecase(usersRepo, idGenerator, passwordEncryptor);

    user = await createUserUsecase.execute({
      name: userTestCreateProps.name,
      email: userTestCreateProps.email,
      plainPassword: plainPassword,
    });
  });

  describe('Execute', () => {
    it('should create user', async () => {
      expect(user.name).toBe(userTestCreateProps.name);
      expect(user.email).toBe(userTestCreateProps.email);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should return UserDTO', async () => {
      expect(user).not.toBeInstanceOf(User);

      for (const prop of userDTOProperties) {
        expect(user).toHaveProperty(prop);
      }
    });

    it('should not expose password', () => {
      // @ts-expect-error hashedPassword is not part of UserDTO
      expect(user.hashedPassword).toBeUndefined();
    });

    it('user entity should have hashedPassword', async () => {
      const userEntity = await usersRepo.getById(user.id);

      const expectedHashedPassword = await passwordEncryptor.hashPassword(plainPassword);

      expect(userEntity!.hashedPassword).toBe(expectedHashedPassword);
    });

    it('should generate unique IDs for different users', async () => {
      const user2 = await createUserUsecase.execute({
        name: 'User Two',
        email: 'usertwo@example.com',
        plainPassword,
      });

      expect(user.id).not.toBe(user2.id);
    });
  });

  describe('Side effects', () => {
    it('should persist user in the repo', async () => {
      const usersBefore = await usersRepo.getAll();
      expect(usersBefore.length).toBe(1);

      const user2 = await createUserUsecase.execute({
        name: 'User Two',
        email: 'usertwo@example.com',
        plainPassword,
      });

      const usersAfter = await usersRepo.getAll();
      expect(usersAfter.length).toBe(2);
    });
  });

  describe('Errors', () => {
    it('should throw error for same email (even with different case)', async () => {
      const requests = [
        {
          name: 'Duplicate Email User',
          email: userTestCreateProps.email,
          plainPassword,
        },
        {
          name: 'Duplicate Email User',
          email: userTestCreateProps.email.toUpperCase(),
          plainPassword,
        },
      ];

      for (const request of requests) {
        await expect(createUserUsecase.execute(request)).rejects.toThrow(AlreadyExistsDomainError);
      }
    });
  });
});
