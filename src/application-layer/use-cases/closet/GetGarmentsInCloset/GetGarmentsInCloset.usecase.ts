import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { Garment } from '@/domain/entities/Garment/Garment';
import { ClosetsRepo } from '@/domain/repos/ClosetsRepo.port';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';

export type GetGarmentsInClosetUsecaseRequest = {
  closetId: string;
};

// Resolves garment ids owned by the closet via GarmentsRepo.getById rather than
// GarmentsRepo.getAll(), per Aldo's note on PR #14: since Closet owns the
// garmentIds, hydrating them belongs on the Closet side, not the Garment repo.
export class GetGarmentsInClosetUsecase {
  constructor(
    private closetsRepo: ClosetsRepo,
    private garmentsRepo: GarmentsRepo,
  ) {}

  async execute(request: GetGarmentsInClosetUsecaseRequest): Promise<Garment[]> {
    const closet = await this.closetsRepo.getById(request.closetId);

    if (!closet) throw new NotFoundDomainError(`Closet with id ${request.closetId} not found`);

    const garments = await Promise.all(closet.garmentIds.map((garmentId) => this.garmentsRepo.getById(garmentId)));

    return garments.filter((garment): garment is Garment => garment !== null);
  }
}
