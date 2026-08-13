export interface ResetPasswordTokenService {
  generateToken(): Promise<string>;
  encryptToken(token: string): Promise<string>;

  validatePlainTokenIsEqualToEncryptedToken(
    plainToken: string,
    encryptedToken: string,
  ): Promise<boolean>;
}
