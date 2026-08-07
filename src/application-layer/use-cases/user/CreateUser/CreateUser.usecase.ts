import { IdGenerator } from '@/application-layer/services/IdGenerator.port';
import { PasswordHasher } from '@/application-layer/services/PasswordHasher.port';
import { AlreadyExistsDomainError } from '@/domain/common/domainErrors';
import { User } from '@/domain/entities/User/User';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { Email } from '@/domain/value-objects/Email/Email';
import { Password } from '@/domain/value-objects/Password/Password';

export type CreateUserUsecaseRequest = {
  name: string;
  email: string;
  plainPassword: string;
};

export class CreateUserUsecase {
  constructor(
    private usersRepo: UsersRepo,
    private idGenerator: IdGenerator,
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(request: CreateUserUsecaseRequest): Promise<User> {
    const validatedEmail = Email.create(request.email).value;

    const validatedPassword = Password.create(request.plainPassword).value;

    const existingUser = await this.usersRepo.getByEmail(validatedEmail);

    if (existingUser) {
      throw new AlreadyExistsDomainError('User with this email already exists');
    }

    const hashedPassword = await this.passwordHasher.hashPassword(validatedPassword);

    const newUser = User.create({
      id: this.idGenerator.generateId(),
      name: request.name,
      email: validatedEmail,
      hashedPassword,
    });

    await this.usersRepo.save(newUser);

    // IMPORTANT NOTE: I forgot to tell you about DTOs in the meeting, for now we will return the entity directly, but we will change it
    return newUser;
  }
}
