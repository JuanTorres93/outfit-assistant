import { OutfitSuggestionByEventService } from '@/application-layer/services/OutfitSuggestionByEventService';
import { Garment } from '@/domain/entities/Garment/Garment';
import { Event } from '@/domain/entities/Event/Event';

export class MemoryOutfitSuggestionByEventService implements OutfitSuggestionByEventService {
    
    async suggestOufitForEvent(garments: Garment[], event: Event ): Promise<Garment[]> {
        

        if(event.date !== undefined)
        {
            const filteredGarments = this.filterGarmentsByDate(garments, event.date);
        }

        const categories = this.DefineCategories(event.location);

        const garmentByCategories: Garment[] = [];
        const shirts = this.filterGarmentsByCategory(garments, 'shirt');
        const pants = this.filterGarmentsByCategory(garments, 'pants');
        const shoes = this.filterGarmentsByCategory(garments, 'shoes');

        const choosenShirt = shirts[Math.floor(Math.random() * shirts.length)];
        const choosenPants = pants[Math.floor(Math.random() * pants.length)];
        const choosenShoes = shoes[Math.floor(Math.random() * shoes.length)];

        const newOutfit: Garment[] = [];
        if (choosenShirt) newOutfit.push(choosenShirt);
        if (choosenPants) newOutfit.push(choosenPants);
        if (choosenShoes) newOutfit.push(choosenShoes);
        return newOutfit;
    }

    private filterGarmentsByCategory(garments: Garment[], category: string): Garment[] {
        return garments.filter(garment => garment.category === category);
    }

    private filterGarmentsByDate(garments: Garment[], date: Date): Garment[] {
        const seasonTypes = ['spring', 'summer', 'autumn', 'winter'];

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
