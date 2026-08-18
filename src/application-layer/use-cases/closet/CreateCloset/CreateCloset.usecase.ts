import { IdGenerator } from '@/application-layer/services/IdGenerator.port';
import { AlreadyExistsDomainError } from '@/domain/common/domainErrors';
import { Closet } from '@/domain/entities/Closet/Closet';
import { ClosetsRepo } from '@/domain/repos/ClosetsRepo.port';

export type CreateClosetUsecaseRequest = {
  userId: string;
};

export class CreateClosetUsecase {
  constructor(
    private closetsRepo: ClosetsRepo,
    private idGenerator: IdGenerator,
  ) {}

  async execute(request: CreateClosetUsecaseRequest): Promise<Closet> {
    const existingCloset = await this.closetsRepo.getByUserId(request.userId);

    if (existingCloset) {
      throw new AlreadyExistsDomainError(`User with id ${request.userId} already has a closet`);
    }

    const newCloset = Closet.create({
      id: this.idGenerator.generateId(),
      userId: request.userId,
    });

    await this.closetsRepo.save(newCloset);

    return newCloset;
  }
}
