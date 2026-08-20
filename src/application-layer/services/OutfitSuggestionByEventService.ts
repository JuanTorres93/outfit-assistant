import { Garment } from '@/domain/entities/Garment/Garment';
import { Event } from '@/domain/entities/Event/Event';

export interface OutfitSuggestionByEventService {
  suggestOutfitForEvent(garments: Garment[], event: Event): Promise<Garment[]>;
}