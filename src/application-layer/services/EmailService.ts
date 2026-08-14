import { User } from '@/domain/entities/User/User';

export interface EmailService {
  sendForgotPasswordEmail(user: User, resetToken: string): Promise<void>;
}
