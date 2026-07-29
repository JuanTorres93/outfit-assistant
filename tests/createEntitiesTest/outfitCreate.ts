import { Outfit, OutfitCreateProps } from '@/../src/domain/entities/Outfit/Outfit';

export const testOutfitId = 'outfit-id';

export const outfitTestCreateProps = {
  id: testOutfitId,
  userId: 'user-id',
  name: 'Office look',
  garmentIds: ['garment-id-1', 'garment-id-2'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestOutfit(overrideProps: Partial<OutfitCreateProps> = {}) {
  const props = { ...outfitTestCreateProps, ...overrideProps };

  return Outfit.create(props);
}
