import { beforeEach, describe, expect, it } from 'vitest';

import { createTestUser } from '@/../tests/createEntitiesTest/userCreate';
import { NotFoundDomainError, ValidationDomainError } from '@/domain/common/domainErrors';
import { User } from '@/domain/entities/User/User';
import { MemoryUsersRepo } from '@/infra/repos/Memory/MemoryUsersRepo';
import { DummyPasswordHasher } from '@/infra/services/PasswordHasher/DummyPasswordEncryptorHasher/DummyPasswordEncryptorHasher';
import { RandomBytesResetPasswordTokenService } from '@/infra/services/ResetPasswordTokenService/RandomBytesResetPasswordTokenService/RandomBytesResetPasswordTokenService';

import { ResetPasswordUsecase } from '../ResetPasswordUsecase';

const newStrongPassword = '#NewStrongPassword123!';

describe('ResetPasswordUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let tokenEncryptor: RandomBytesResetPasswordTokenService;
  let passwordHasher: DummyPasswordHasher;

  let usecase: ResetPasswordUsecase;
  let user: User;
  let resetToken: string;
  let encryptedResetToken: string;

  beforeEach(async () => {
    usersRepo = new MemoryUsersRepo();
    tokenEncryptor = new RandomBytesResetPasswordTokenService();
    passwordHasher = new DummyPasswordHasher();
    usecase = new ResetPasswordUsecase(usersRepo, tokenEncryptor, passwordHasher);
    resetToken = await tokenEncryptor.generateToken();
    encryptedResetToken = await tokenEncryptor.encryptToken(resetToken);

    user = createTestUser({
      passwordResetToken: encryptedResetToken,
      passwordResetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60), // expires in 1 hour
    });
    await usersRepo.save(user);
  });

  describe('Execution', () => {
    //it("should return UserDTO", async () => {
    //  const request = {
    //    plainResetToken: resetToken,
    //    newPlainPassword: newStrongPassword,
    //  };

    //  const updatedUser = await usecase.execute(request);

    //  expect(updatedUser).not.toBeInstanceOf(User);

    //  for (const prop of userDTOProperties) {
    //    expect(updatedUser).toHaveProperty(prop);
    //  }
    //});

    it('user should not be found by plain token but by its encrypted version', async () => {
      user.forgotPassword(encryptedResetToken);
      await usersRepo.save(user);

      const foundUser = await usersRepo.getByPasswordResetToken(encryptedResetToken);

      expect(foundUser).not.toBeNull();
      expect(foundUser!.id).toEqual(user.id);
    });
  });

  describe('Side effects', () => {
    let userWithValidResetToken: User;
    let newPlainPassword: string;

    beforeEach(async () => {
      userWithValidResetToken = createTestUser({
        passwordResetToken: encryptedResetToken,
        passwordResetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60), // expires in 1 hour
      });

      await usersRepo.save(userWithValidResetToken);

      newPlainPassword = newStrongPassword;
      const request = {
        plainResetToken: resetToken,
        newPlainPassword,
      };

      await usecase.execute(request);
    });

    it('should update password in repository', async () => {
      const updatedUser = await usersRepo.getById(userWithValidResetToken.id);
      expect(updatedUser).not.toBeNull();
      expect(updatedUser!.hashedPassword).not.toEqual(userWithValidResetToken.hashedPassword);
    });

    it('updated password should not be plain password', async () => {
      const updatedUser = await usersRepo.getById(userWithValidResetToken.id);

      expect(updatedUser).not.toBeNull();
      expect(updatedUser!.hashedPassword).not.toEqual(newPlainPassword);
    });

    it('should clear password reset token and expiration', async () => {
      const updatedUser = await usersRepo.getById(userWithValidResetToken.id);

      expect(updatedUser).not.toBeNull();
      expect(updatedUser!.passwordResetToken).toBeUndefined();
      expect(updatedUser!.passwordResetTokenExpiresAt).toBeUndefined();
    });

    it('should update passwordChangedAt timestamp', async () => {
      expect(userWithValidResetToken.passwordChangedAt).toBeUndefined();

      const updatedUser = await usersRepo.getById(userWithValidResetToken.id);

      expect(updatedUser).not.toBeNull();
      expect(updatedUser!.passwordChangedAt).toBeInstanceOf(Date);
    });
  });

  describe('Errors', () => {
    it('should throw error if user not found', async () => {
      const request = {
        plainResetToken: 'nonexistent-token',
        newPlainPassword: newStrongPassword,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundDomainError);
    });

    it('should throw error if token is expired', async () => {
      const userWithExpiredToken = createTestUser({
        passwordResetToken: 'expired-token',
        passwordResetTokenExpiresAt: new Date(Date.now() - 1000), // expired 1 second ago
      });
      await usersRepo.save(userWithExpiredToken);

      const request = {
        plainResetToken: 'expired-token',
        newPlainPassword: newStrongPassword,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundDomainError);
    });

    it('should throw error for weak password', async () => {
      const userWithValidToken = createTestUser({
        passwordResetToken: encryptedResetToken,
        passwordResetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60), // expires in 1 hour
      });
      await usersRepo.save(userWithValidToken);

      const request = {
        plainResetToken: resetToken,
        newPlainPassword: '123', // weak password
      };

      await expect(usecase.execute(request)).rejects.toThrow(ValidationDomainError);
    });
  });
});
