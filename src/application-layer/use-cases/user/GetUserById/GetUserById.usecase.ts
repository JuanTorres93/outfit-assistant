import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { User } from '@/domain/entities/User/User';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetUserByIdUsecaseRequest = {
  userId: string;
};

export class GetUserByIdUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: GetUserByIdUsecaseRequest): Promise<User> {
    const user = await this.usersRepo.getById(request.userId);

    if (!user) throw new NotFoundDomainError(`User with id ${request.userId} not found`);

    // IMPORTANT NOTE: I forgot to tell you about DTOs in the meeting, for now we will return the entity directly, but we will change it
    return user;
  }
}
