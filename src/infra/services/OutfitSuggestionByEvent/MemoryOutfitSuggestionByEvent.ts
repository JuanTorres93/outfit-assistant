import { OutfitSuggestionByEventService } from '@/application-layer/services/OutfitSuggestionByEventService';
import { Garment } from '@/domain/entities/Garment/Garment';
import { Event } from '@/domain/entities/Event/Event';

export class MemoryOutfitSuggestionByEventService implements OutfitSuggestionByEventService {
    
    async suggestOutfitForEvent(garments: Garment[], event: Event ): Promise<Garment[]> {
        

        if(event.date !== undefined)
        {
            const filteredGarments = this.filterGarmentsByDate(garments, event.date);
            garments = filteredGarments;
        }

        const categories = this.DefineCategories(event.location);

        const garmentByCategories: Garment[][] = categories.map((category) =>
            this.filterGarmentsByCategory(garments, category),
        );

        const choosenGarments: Garment[] = garmentByCategories.map((category) =>
        category[Math.floor(Math.random() * category.length)]);

        return choosenGarments;
    }

    private filterGarmentsByCategory(garments: Garment[], category: string): Garment[] {
        return garments.filter(garment => garment.category === category);
    }

    private filterGarmentsByDate(garments: Garment[], date: Date): Garment[] {
        const eventMonth = date.getMonth() + 1;
        let eventSeason: string;

        if (eventMonth >= 3 && eventMonth <= 5) {
            eventSeason = 'spring';
        } else if (eventMonth >= 6 && eventMonth <= 8) {
            eventSeason = 'summer';
        } else if (eventMonth >= 9 && eventMonth <= 11) {
            eventSeason = 'autumn';
        } else {
            eventSeason = 'winter';
        }

        return garments.filter(garment => {
            if (garment.seasons !== undefined)
            {
                const garmentSeasons = garment.seasons;
                return garmentSeasons.includes(eventSeason);
            }
        });             
    }

    private DefineCategories(location: string): string[]
    {
        const categories: string[] = []
        switch(location)
        {
            case 'beach':
                categories.push('swimsuit', 't-shirt', 'shorts', 'sandals');
                break;
            case 'office':
                categories.push('suit', 'pants', 'shoes');
                break;
            default:
                break;
        }

        return categories;
    }
}
