import { Garment } from '@/domain/entities/Garment/Garment';
import { GarmentsRepo } from '@/domain/repos/GarmentsRepo.port';
import { IdGenerator } from '@/application-layer/services/IdGenerator.port';

export type CreateGarmentUseCaseRequest = {
    name: string;
    category: string;
    colors: string[];
    brand?: string;
    size?: string;
    material?: string;
    seasons?: string[];
};

export class CreateGarmentUseCase {
    constructor(
        private readonly garmentsRepo: GarmentsRepo,
        private readonly idGenerator: IdGenerator,
    ) {}

    async execute(request: CreateGarmentUseCaseRequest): Promise<Garment> {
        const newGarment = Garment.create({
            id: this.idGenerator.generateId(),
            name: request.name,
            category: request.category,
            colors: request.colors,
            brand: request.brand,
            size: request.size,
            material: request.material,
            seasons: request.seasons,
        });
        await this.garmentsRepo.save(newGarment);
        return newGarment;
    }
    
}   