import { NotFoundDomainError } from '@/domain/common/domainErrors';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';

export type DeleteGarmentByIdUseCaseRequest = {
    garmentId: string;
}

export class DeleteGarmentByIdUseCase {
    constructor(private garmentsRepo: GarmentsRepo) {}

    async execute(request: DeleteGarmentByIdUseCaseRequest): Promise<void> {
        const garment = await this.garmentsRepo.getById(request.garmentId);

        if (!garment) {
            throw new NotFoundDomainError(
                `Garment with Id ${request.garmentId} not found`,
            );
        }

        await this.garmentsRepo.deleteById(request.garmentId);
        return;
    }
}