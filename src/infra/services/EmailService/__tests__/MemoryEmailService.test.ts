import { beforeEach, describe, expect, it } from 'vitest';

import { createTestUser } from '@/../tests/createEntitiesTest/userCreate';
import { User } from '@/domain/entities/User/User';

import { MemoryEmailService } from '../MemoryEmailService';

describe('MemoryEmailService', () => {
  let emailService: MemoryEmailService;
  let user: User;

  beforeEach(() => {
    user = createTestUser();

    emailService = new MemoryEmailService();
  });

  it('should send a forgot password email', async () => {
    const numberOfSentEmailsBefore = emailService.getSentEmails().length;
    expect(numberOfSentEmailsBefore).toBe(0);

    const resetToken = 'test-reset-token-123';
    await emailService.sendForgotPasswordEmail(user, resetToken);

    const sentEmails = emailService.getSentEmails();
    expect(sentEmails).toHaveLength(1);

    expect(sentEmails[0].user).toBe(user);
    expect(sentEmails[0].emailContent).toContain(resetToken);
  });
});
