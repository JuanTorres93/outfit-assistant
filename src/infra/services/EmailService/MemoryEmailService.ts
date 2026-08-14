import { EmailService } from '@/application-layer/services/EmailService';
import { User } from '@/domain/entities/User/User';

export class MemoryEmailService implements EmailService {
  private sentEmails: { emailContent: string; user: User }[] = [];

  async sendForgotPasswordEmail(user: User, resetToken: string): Promise<void> {
    const emailContent = `${resetToken}`;

    this.sendEmail(emailContent, user);
  }

  getSentEmails(): { emailContent: string; user: User }[] {
    return [...this.sentEmails];
  }

  private sendEmail(emailContent: string, user: User): void {
    console.log(`Sending email to ${user.email}: ${emailContent}`);

    this.sentEmails.push({ emailContent, user });
  }
}
