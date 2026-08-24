import { beforeEach, describe, expect, it } from 'vitest';

import { MemoryOutfitSuggestionByEventService } from '../MemoryOutfitSuggestionByEvent';
import { Garment, GarmentCreateProps } from '@/domain/entities/Garment/Garment';
import { Event, EventCreateProps } from '@/domain/entities/Event/Event';
import { garmentTestCreateProps } from '@/../tests/createEntitiesTest/garmentCreate';
import { eventTestCreateProps } from '@/../tests/createEntitiesTest/eventCreate';

describe('MemoryOutfitSuggestionByEventService', () => {
    let service: MemoryOutfitSuggestionByEventService;
    let garment: Garment;
    let validGarmentProps: GarmentCreateProps;
    let validEventProps: EventCreateProps;

    beforeEach(() =>{
        service = new MemoryOutfitSuggestionByEventService;

        validGarmentProps = {
      ...garmentTestCreateProps,
        };
        validEventProps = {
            ...eventTestCreateProps,
        };
    

    garment = Garment.create(validGarmentProps);
    })


    describe('suggestOufitForEvent', () => {
        it('should return a bundle of garments', async () => {
            const garments: Garment[] = [];
            garments.push(garment);
            const outfit = await service.suggestOutfitForEvent(garments, validEventProps as Event);
            expect(outfit).toBeTypeOf('object');
        });
        it('should return an empty array if bundle of garments is empty', async () => {
            const garments: Garment[] = [];
            const outfit = await service.suggestOutfitForEvent(garments, validEventProps as Event);
            expect(outfit).toEqual([]);
        });
    });
});