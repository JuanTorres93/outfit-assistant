import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { Closet } from '@/domain/entities/Closet/Closet';
import { ClosetsRepo } from '@/domain/repos/ClosetsRepo.port';

export type GetClosetByUserIdUsecaseRequest = {
  userId: string;
};

export class GetClosetByUserIdUsecase {
  constructor(private closetsRepo: ClosetsRepo) {}

  async execute(request: GetClosetByUserIdUsecaseRequest): Promise<Closet> {
    const closet = await this.closetsRepo.getByUserId(request.userId);

    if (!closet) throw new NotFoundDomainError(`Closet for user with id ${request.userId} not found`);

    return closet;
  }
}
