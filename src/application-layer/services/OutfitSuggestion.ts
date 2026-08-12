import { Outfit } from '@/domain/entities/Outfit/Outfit';

export interface OutfitSuggestionService {
  suggestOutfit(date: Date, season: string): Promise<Outfit>;
}