import { garmentTestCreateProps } from '@/../tests/createEntitiesTest/garmentCreate';
import { getGetters } from '@/application-layer/dtos/__tests__/_getGettersUtil';
import { Garment } from '@/domain/entities/Garment/Garment';

const sampleGarment = Garment.create({
  ...garmentTestCreateProps,
});

export const garmentDtoProperties = getGetters(sampleGarment);
