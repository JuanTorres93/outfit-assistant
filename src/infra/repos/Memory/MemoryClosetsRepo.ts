import { Closet } from '@/domain/entities/Closet/Closet';
import { ClosetsRepo } from '@/domain/repos/ClosetsRepo.port';

export class MemoryClosetsRepo implements ClosetsRepo {
  private closets: Closet[] = [];

  async getAll(): Promise<Closet[]> {
    return this.closets.map((closet) => closet.clone());
  }

  async getById(id: string): Promise<Closet | null> {
    const closet = this.closets.find((closet) => closet.id === id);

    return closet?.clone() || null;
  }

  async getByUserId(userId: string): Promise<Closet | null> {
    const closet = this.closets.find((closet) => closet.userId === userId);

    return closet?.clone() || null;
  }

  async save(closet: Closet): Promise<void> {
    const existingClosetIndex = this.closets.findIndex((closetInRepo) => closetInRepo.id === closet.id);

    if (existingClosetIndex !== -1) {
      // Update existing closet
      this.closets[existingClosetIndex] = closet;
    } else {
      // Add new closet
      this.closets.push(closet);
    }
  }

  async deleteById(id: string): Promise<void> {
    this.closets = this.closets.filter((closet) => closet.id !== id);
  }

  clearAllForTesting(): void {
    this.closets = [];
  }
}
