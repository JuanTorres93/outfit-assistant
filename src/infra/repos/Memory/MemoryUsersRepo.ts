import { User } from '@/domain/entities/User/User';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export class MemoryUsersRepo implements UsersRepo {
  private users: User[] = [];

  async getAll(): Promise<User[]> {
    return this.users.map((user) => user.clone());
  }

  async getById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);

    return user?.clone() || null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    return user?.clone() || null;
  }

  async save(user: User): Promise<void> {
    const existingUserIndex = this.users.findIndex((userInRepo) => userInRepo.id === user.id);

    if (existingUserIndex !== -1) {
      // Update existing user
      this.users[existingUserIndex] = user;
    } else {
      // Add new user
      this.users.push(user);
    }
  }

  async deleteById(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }

  clearAllForTesting(): void {
    this.users = [];
  }
}
