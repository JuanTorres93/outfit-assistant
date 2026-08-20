import { beforeEach, describe, expect, it } from 'vitest';

import { createTestUser } from '@/../tests/createEntitiesTest/userCreate';
import { userDTOProperties } from '@/../tests/dtoProperties/userDtoProperties';
import { toUserDTO } from '@/application-layer/dtos/UserDTO';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { User } from '@/domain/entities/User/User';
import { MemoryUsersRepo } from '@/infra/repos/Memory/MemoryUsersRepo';

import { GetUserByIdUsecase } from '../GetUserById.usecase';

describe('GetUserByIdUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let getUserByIdUsecase: GetUserByIdUsecase;

  beforeEach(() => {
    usersRepo = new MemoryUsersRepo();
    getUserByIdUsecase = new GetUserByIdUsecase(usersRepo);
  });

  describe('Execute', () => {
    it('should return user when found', async () => {
      const user = createTestUser();

      await usersRepo.save(user);

      const result = await getUserByIdUsecase.execute({
        userId: user.id,
      });

      expect(result).toEqual(toUserDTO(user));
    });

    it('should return user DTO when found', async () => {
      const user = createTestUser();

      await usersRepo.save(user);

      const result = await getUserByIdUsecase.execute({
        userId: user.id,
      });

      for (const prop of userDTOProperties) {
        expect(result).not.toBeInstanceOf(User);
        expect(result).toHaveProperty(prop);
      }
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundDomainError when user not found', async () => {
      await expect(() =>
        getUserByIdUsecase.execute({
          userId: 'non-existent-id',
        }),
      ).rejects.toThrow(NotFoundDomainError);
    });
  });
});
