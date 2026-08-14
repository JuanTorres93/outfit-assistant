import { EmailService } from '@/application-layer/services/EmailService';
import { ResetPasswordTokenService } from '@/application-layer/services/ResetPasswordTokenService.port';
import { InfrastructureDomainError, NotFoundDomainError } from '@/domain/common/domainErrors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type ForgotPasswordUsecaseRequest = {
  email: string;
};

export class ForgotPasswordUsecase {
  constructor(
    private usersRepo: UsersRepo,
    private tokenEncryptor: ResetPasswordTokenService,
    private emailService: EmailService,
  ) {}

  async execute(request: ForgotPasswordUsecaseRequest): Promise<void> {
    const user = await this.usersRepo.getByEmail(request.email);

    if (!user) {
      throw new NotFoundDomainError(`User with not found`);
    }

    const resetToken = await this.tokenEncryptor.generateToken();
    const encryptedResetToken = await this.tokenEncryptor.encryptToken(resetToken);

    user.forgotPassword(encryptedResetToken);

    try {
      await this.emailService.sendForgotPasswordEmail(user, resetToken);
    } catch {
      throw new InfrastructureDomainError('Failed to send forgot password email');
    }

    await this.usersRepo.save(user);
  }
}
