import { Outfit } from '@/domain/entities/Outfit/Outfit';
import { OutfitsRepo } from '@/domain/repos/OutfitsRepo.port';

export class MemoryOutfitsRepo implements OutfitsRepo {
  private outfits: Outfit[] = [];

  async getAll(): Promise<Outfit[]> {
    return this.outfits.map((outfit) => outfit.clone());
  }

  async getById(id: string): Promise<Outfit | null> {
    const outfit = this.outfits.find((outfit) => outfit.id === id);

    return outfit?.clone() || null;
  }

  async getAllByUserId(userId: string): Promise<Outfit[]> {
    return this.outfits.filter((outfit) => outfit.userId === userId).map((outfit) => outfit.clone());
  }

  async getMultipleByIds(ids: string[]): Promise<(Outfit | null)[]> {
    const selectedOutfits = ids.map(id => this.outfits.find(outfit => outfit.id === id))
  
    return selectedOutfits.map(outfit => outfit !== undefined ? outfit.clone() : null);
  }

  async save(outfit: Outfit): Promise<void> {
    const existingOutfitIndex = this.outfits.findIndex((outfitInRepo) => outfitInRepo.id === outfit.id);

    if (existingOutfitIndex !== -1) {
      // Update existing outfit
      this.outfits[existingOutfitIndex] = outfit;
    } else {
      // Add new outfit
      this.outfits.push(outfit);
    }
  }

  async deleteById(id: string): Promise<void> {
    this.outfits = this.outfits.filter((outfit) => outfit.id !== id);
  }

  clearAllForTesting(): void {
    this.outfits = [];
  }
}
