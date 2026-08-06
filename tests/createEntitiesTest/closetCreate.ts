import { Closet, ClosetCreateProps } from '@/../src/domain/entities/Closet/Closet';

export const testClosetId = 'closet-id';

export const closetTestCreateProps = {
  id: testClosetId,
  userId: 'user-id',
  garmentIds: ['garment-id-1', 'garment-id-2'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestCloset(overrideProps: Partial<ClosetCreateProps> = {}) {
  const props = { ...closetTestCreateProps, ...overrideProps };

  return Closet.create(props);
}
