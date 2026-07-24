import { Garment, GarmentCreateProps } from '@/../src/domain/entities/Garment/Garment';

export const testGarmentId = 'garment-id';

export const garmentTestCreateProps: GarmentCreateProps = {
  id: testGarmentId,
  name: 'Basic White T-Shirt',
  category: 'T-Shirt',
  colors: ['White'],

  brand: 'Zara',
  size: 'M',
  material: 'Cotton',
  seasons: ['Spring', 'Summer'],

  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestGarment(
  overrideProps: Partial<GarmentCreateProps> = {},
) {
  const props = {
    ...garmentTestCreateProps,
    ...overrideProps,
  };

  return Garment.create(props);
}