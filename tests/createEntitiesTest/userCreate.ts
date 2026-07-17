import { User, UserCreateProps } from '@/../src/domain/entities/User/User';

export const testUserId = 'user-id';
export const securePassword = 'S€Cure-p4ssword';

export const userTestCreateProps = {
  id: testUserId,

  name: 'Test User',
  email: 'test.user@example.com',
  hashedPassword: 'super-secure-hashed-password',

  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestUser(overrideProps: Partial<UserCreateProps> = {}) {
  const props = { ...userTestCreateProps, ...overrideProps };

  return User.create(props);
}
