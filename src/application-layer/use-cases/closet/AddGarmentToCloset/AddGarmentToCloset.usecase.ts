import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { Closet } from '@/domain/entities/Closet/Closet';
import { ClosetsRepo } from '@/domain/repos/ClosetsRepo.port';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';

export type AddGarmentToClosetUsecaseRequest = {
  closetId: string;
  garmentId: string;
};

export class AddGarmentToClosetUsecase {
  constructor(
    private closetsRepo: ClosetsRepo,
    private garmentsRepo: GarmentsRepo,
  ) {}

  async execute(request: AddGarmentToClosetUsecaseRequest): Promise<Closet> {
    const closet = await this.closetsRepo.getById(request.closetId);

    if (!closet) throw new NotFoundDomainError(`Closet with id ${request.closetId} not found`);

    const garment = await this.garmentsRepo.getById(request.garmentId);

    if (!garment) throw new NotFoundDomainError(`Garment with id ${request.garmentId} not found`);

    closet.addGarment(request.garmentId);

    await this.closetsRepo.save(closet);

    return closet;
  }
}
