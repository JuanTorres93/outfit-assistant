import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';
import { Garment } from '@/domain/entities/Garment/Garment';

export type GetGarmentByIdUseCaseRequest = {
    garmentId: string;
}

export class GetGarmentByIdUseCase {
    constructor (private garmentsRepo: GarmentsRepo) {}

    async execute(request: GetGarmentByIdUseCaseRequest): Promise<Garment> {
        const garment = await this.garmentsRepo.getById(request.garmentId);
        if (!garment) {
            throw new NotFoundDomainError(`Garment with Id ${request.garmentId} not found`);
        }
        return garment;
    }
}