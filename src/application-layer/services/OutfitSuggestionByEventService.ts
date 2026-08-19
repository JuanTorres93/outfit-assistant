import { Garment } from '@/domain/entities/Garment/Garment';
import { Outfit } from '@/domain/entities/Outfit/Outfit';
import { Event } from '@/domain/entities/Event/Event';

export interface OutfitSuggestionByEventService {
  suggestOufitForEvent(garments: Garment[], event: Event): Promise<Garment[]>;
}