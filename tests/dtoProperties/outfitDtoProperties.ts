import { outfitTestCreateProps } from '@/../tests/createEntitiesTest/outfitCreate';
import { getGetters } from '@/application-layer/dtos/__tests__/_getGettersUtil';
import { Outfit } from '@/domain/entities/Outfit/Outfit';

const sampleOutfit = Outfit.create({
  ...outfitTestCreateProps,
});

export const outfitDtoProperties = getGetters(sampleOutfit);
