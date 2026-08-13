import crypto from "crypto";

import { ResetPasswordTokenService } from "@/application-layer/services/ResetPasswordTokenService.port";

export class RandomBytesResetPasswordTokenService implements ResetPasswordTokenService {
  async generateToken(): Promise<string> {
    return crypto.randomBytes(32).toString("hex");
  }

  async encryptToken(token: string): Promise<string> {
    const tokenCopy = token;

    const hashedToken = crypto
      .createHash("sha256")
      .update(tokenCopy)
      .digest("hex");

    return hashedToken;
  }

  async validatePlainTokenIsEqualToEncryptedToken(
    plainToken: string,
    encryptedToken: string,
  ): Promise<boolean> {
    const hashedPlainToken = crypto
      .createHash("sha256")
      .update(plainToken)
      .digest("hex");

    return hashedPlainToken === encryptedToken;
  }
}
