import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestUser } from '@/../tests/createEntitiesTest/userCreate';
import { InfrastructureDomainError, NotFoundDomainError } from '@/domain/common/domainErrors';
import { User } from '@/domain/entities/User/User';
import { MemoryUsersRepo } from '@/infra/repos/Memory/MemoryUsersRepo';
import { MemoryEmailService } from '@/infra/services/EmailService/MemoryEmailService';
import { RandomBytesResetPasswordTokenService } from '@/infra/services/ResetPasswordTokenService/RandomBytesResetPasswordTokenService/RandomBytesResetPasswordTokenService';

import { ForgotPasswordUsecase } from '../ForgotPasswordUsecase';

describe('ForgotPasswordUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let tokenEncryptor: RandomBytesResetPasswordTokenService;
  let emailService: MemoryEmailService;

  let usecase: ForgotPasswordUsecase;

  let user: User;

  beforeEach(async () => {
    usersRepo = new MemoryUsersRepo();
    tokenEncryptor = new RandomBytesResetPasswordTokenService();
    emailService = new MemoryEmailService();

    usecase = new ForgotPasswordUsecase(usersRepo, tokenEncryptor, emailService);

    user = createTestUser();
    await usersRepo.save(user);
  });

  describe('Execution', () => {
    it('should send plain token to user', async () => {
      await usecase.execute({
        email: user.email,
      });

      const sentEmails = emailService.getSentEmails();
      expect(sentEmails.length).toBe(1);
      expect(sentEmails[0].user.id).toBe(user.id);
      expect(sentEmails[0].emailContent).toBeDefined();
    });

    it('should not update user in repository if email is not sent', async () => {
      // Override the sendForgotPasswordEmail method to simulate a failure
      emailService.sendForgotPasswordEmail = vi.fn().mockImplementation(() => {
        throw new Error('Email service failed');
      });

      await expect(
        usecase.execute({
          email: user.email,
        }),
      ).rejects.toThrow(InfrastructureDomainError);

      const updatedUser = await usersRepo.getById(user.id);
      expect(updatedUser?.passwordResetToken).toBeUndefined();
      expect(updatedUser?.passwordResetTokenExpiresAt).toBeUndefined();
    });
  });

  describe('Side effects', () => {
    it('should persists hashed token and token expiry in database', async () => {
      const userBefore = await usersRepo.getById(user.id);
      expect(userBefore?.passwordResetToken).toBeUndefined();
      expect(userBefore?.passwordResetTokenExpiresAt).toBeUndefined();

      await usecase.execute({
        email: user.email,
      });

      const updatedUser = await usersRepo.getById(user.id);

      expect(updatedUser).toBeDefined();
      expect(updatedUser!.passwordResetToken).toBeDefined();
      expect(updatedUser!.passwordResetTokenExpiresAt).toBeDefined();
    });

    it('should not persist same token as sent', async () => {
      await usecase.execute({
        email: user.email,
      });

      const sentEmails = emailService.getSentEmails();
      const sentToken = sentEmails[0].emailContent;

      const updatedUser = await usersRepo.getById(user.id);

      expect(updatedUser).not.toBeUndefined();
      expect(updatedUser!.passwordResetToken).not.toBeUndefined();
      expect(updatedUser!.passwordResetToken).not.toBe(sentToken);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError if user with given email does not exist', async () => {
      await expect(
        usecase.execute({
          email: 'nonexistent@example.com',
        }),
      ).rejects.toThrow(NotFoundDomainError);
    });
  });
});
