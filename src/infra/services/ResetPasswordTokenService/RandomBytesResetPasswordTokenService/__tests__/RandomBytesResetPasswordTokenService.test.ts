import { beforeEach, describe, expect, it } from 'vitest';

import { RandomBytesResetPasswordTokenService } from '../RandomBytesResetPasswordTokenService';

describe('RandomBytesResetPasswordTokenService', () => {
  let service: RandomBytesResetPasswordTokenService;

  beforeEach(() => {
    service = new RandomBytesResetPasswordTokenService();
  });

  describe('generateToken', () => {
    it('should generate a token', async () => {
      const token = await service.generateToken();

      expect(token).toBeDefined();
      expect(token).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should generate different tokens', async () => {
      const token1 = await service.generateToken();
      const token2 = await service.generateToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('encryptToken', () => {
    it('should encrypt a plain token', async () => {
      const token = 'test-token-123';

      const encryptedToken = await service.encryptToken(token);

      expect(encryptedToken).toBeDefined();
      expect(encryptedToken).not.toBe(token);
      expect(encryptedToken).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should produce the same encryption for the same token', async () => {
      const token = 'test-token-123';

      const encrypted1 = await service.encryptToken(token);
      const encrypted2 = await service.encryptToken(token);

      expect(encrypted1).toBe(encrypted2);
    });

    it('should encrypt different tokens differently', async () => {
      const token1 = 'token-1';
      const token2 = 'token-2';

      const encrypted1 = await service.encryptToken(token1);
      const encrypted2 = await service.encryptToken(token2);

      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should encrypt very long tokens', async () => {
      const longToken = 'a'.repeat(100);

      const encryptedToken = await service.encryptToken(longToken);

      expect(encryptedToken).toBeDefined();
      expect(encryptedToken).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should encrypt tokens with special characters', async () => {
      const specialToken = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      const encryptedToken = await service.encryptToken(specialToken);

      expect(encryptedToken).toBeDefined();
      expect(encryptedToken).toMatch(/^[0-9a-f]{64}$/);
    });
  });

  describe('validatePlainTokenIsEqualToEncryptedToken', () => {
    it('should return true for matching plain token and encrypted token', async () => {
      const token = 'my-secure-token';

      const encryptedToken = await service.encryptToken(token);

      const matches = await service.validatePlainTokenIsEqualToEncryptedToken(
        token,
        encryptedToken,
      );

      expect(matches).toBe(true);
    });

    it('should return false for non-matching plain token and encrypted token', async () => {
      const token = 'my-secure-token';
      const wrongToken = 'wrong-token';

      const encryptedToken = await service.encryptToken(token);

      const matches = await service.validatePlainTokenIsEqualToEncryptedToken(
        wrongToken,
        encryptedToken,
      );

      expect(matches).toBe(false);
    });

    it('should verify tokens with special characters', async () => {
      const specialToken = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      const encryptedToken = await service.encryptToken(specialToken);

      const matches = await service.validatePlainTokenIsEqualToEncryptedToken(
        specialToken,
        encryptedToken,
      );

      expect(matches).toBe(true);
    });

    it('should be case-sensitive', async () => {
      const token = 'MySecureToken';
      const uppercaseToken = 'MYSECURETOKEN';

      const encryptedToken = await service.encryptToken(token);

      const matches = await service.validatePlainTokenIsEqualToEncryptedToken(
        uppercaseToken,
        encryptedToken,
      );

      expect(matches).toBe(false);
    });
  });
});
