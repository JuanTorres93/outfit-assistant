import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetUserByIdUsecaseRequest = {
  userId: string;
};

export class GetUserByIdUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: GetUserByIdUsecaseRequest): Promise<UserDTO> {
    const user = await this.usersRepo.getById(request.userId);

    if (!user) throw new NotFoundDomainError(`User with id ${request.userId} not found`);

    return toUserDTO(user);
  }
}
