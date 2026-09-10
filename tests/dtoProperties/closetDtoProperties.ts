import { closetTestCreateProps } from '@/../tests/createEntitiesTest/closetCreate';
import { getGetters } from '@/application-layer/dtos/__tests__/_getGettersUtil';
import { Closet } from '@/domain/entities/Closet/Closet';

const sampleCloset = Closet.create({
  ...closetTestCreateProps,
});

export const closetDtoProperties = getGetters(sampleCloset);