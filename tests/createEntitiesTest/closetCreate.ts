import { Closet, ClosetCreateProps } from '@/../src/domain/entities/Closet/Closet';
import { testUserId } from '@/../tests/createEntitiesTest/userCreate';

export const testClosetId = 'closet-id';

export const closetTestCreateProps = {
  id: testClosetId,
  userId: testUserId,
  garmentIds: ['garment-id-1', 'garment-id-2'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestCloset(overrideProps: Partial<ClosetCreateProps> = {}) {
  const props = { ...closetTestCreateProps, ...overrideProps };

  return Closet.create(props);
}
