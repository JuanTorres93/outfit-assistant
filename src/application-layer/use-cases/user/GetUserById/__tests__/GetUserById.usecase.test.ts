import { beforeEach, describe, expect, it } from 'vitest';

import { createTestUser } from '@/../tests/createEntitiesTest/userCreate';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
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

      // expect(result).toEqual(toUserDTO(user));
      // TODO: uncomment when DTOs are implemented and delete below
      expect(result).toEqual(user);
    });

    // TODO: uncomment when DTOs are implemented
    //it("should return user DTO when found", async () => {
    //  const user = createTestUser();

    //  await usersRepo.save(user);

    //  const result = await getUserByIdUsecase.execute({
    //    userId: user.id,
    //  });

    //  for (const prop of userDTOProperties) {
    //    expect(result).not.toBeInstanceOf(User);
    //    expect(result).toHaveProperty(prop);
    //  }
    //});
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
