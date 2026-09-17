import { ColorMatchService } from '@/application-layer/services/ColorMatchService.port';
import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { Garment } from '@/domain/entities/Garment/Garment';
import { ClosetsRepo } from '@/domain/repos/ClosetsRepo.port';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';

export type GetColorMatchingGarmentsByCategoryInClosetUsecaseRequest = {
  closetId: string;
  garmentId: string;
};

export class GetColorMatchingGarmentsByCategoryInClosetUsecase {
  constructor(
    private closetsRepo: ClosetsRepo,
    private garmentsRepo: GarmentsRepo,
    private colorMatchService: ColorMatchService,
  ) {}

  async execute(
    request: GetColorMatchingGarmentsByCategoryInClosetUsecaseRequest,
  ): Promise<Record<string, Garment[]>> {
    const closet = await this.closetsRepo.getById(request.closetId);

    if (!closet) throw new NotFoundDomainError(`Closet with id ${request.closetId} not found`);

    const targetGarment = await this.garmentsRepo.getById(request.garmentId);

    if (!targetGarment) {
      throw new NotFoundDomainError(`Garment with id ${request.garmentId} not found`);
    }

    const closetGarments = await Promise.all(
      closet.garmentIds.map((garmentId) => this.garmentsRepo.getById(garmentId)),
    );

    const hydratedGarments = closetGarments.filter((garment): garment is Garment => garment !== null);

    return this.colorMatchService.getMatchingGarmentsByCategory(targetGarment, hydratedGarments);
  }
}
