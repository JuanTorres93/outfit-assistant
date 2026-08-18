import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { Closet } from '@/domain/entities/Closet/Closet';
import { ClosetsRepo } from '@/domain/repos/ClosetsRepo.port';

export type RemoveGarmentFromClosetUsecaseRequest = {
  closetId: string;
  garmentId: string;
};

export class RemoveGarmentFromClosetUsecase {
  constructor(private closetsRepo: ClosetsRepo) {}

  async execute(request: RemoveGarmentFromClosetUsecaseRequest): Promise<Closet> {
    const closet = await this.closetsRepo.getById(request.closetId);

    if (!closet) throw new NotFoundDomainError(`Closet with id ${request.closetId} not found`);

    closet.removeGarment(request.garmentId);

    await this.closetsRepo.save(closet);

    return closet;
  }
}
