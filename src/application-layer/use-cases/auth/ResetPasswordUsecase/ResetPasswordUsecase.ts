import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { PasswordHasher } from '@/application-layer/services/PasswordHasher.port';
import { ResetPasswordTokenService } from '@/application-layer/services/ResetPasswordTokenService.port';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { Password } from '@/domain/value-objects/Password/Password';

export type ResetPasswordUsecaseRequest = {
  plainResetToken: string;
  newPlainPassword: string;
};

export class ResetPasswordUsecase {
  constructor(
    private usersRepo: UsersRepo,
    private tokenEncryptor: ResetPasswordTokenService,
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(request: ResetPasswordUsecaseRequest): Promise<UserDTO> {
    const hashedResetToken = await this.tokenEncryptor.encryptToken(request.plainResetToken);

    const user = await this.usersRepo.getByPasswordResetToken(hashedResetToken);

    if (!user) {
      throw new NotFoundDomainError('User not found');
    }

    const resetTokenExpiresAt = user.passwordResetTokenExpiresAt;

    const resetTokenIsExpired = !resetTokenExpiresAt || resetTokenExpiresAt < new Date();

    if (resetTokenIsExpired) {
      throw new NotFoundDomainError('User not found');
    }

    // Validate strong password requirements
    Password.create(request.newPlainPassword);

    const newEncryptedPassword = await this.passwordHasher.hashPassword(request.newPlainPassword);
    user.changePassword(newEncryptedPassword);

    await this.usersRepo.save(user);

    return toUserDTO(user);
  }
}
