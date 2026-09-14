import { describe, expect, it} from 'vitest';

import { eventDTOProperties } from '@/../tests/dtoProperties/eventDTOProperties';

import ExerciseMongo from '../EventMongo';
import { assertMongooseModelMatchesDTOProperties } from './assertMongooseSchemaMatchesProperties';

describe('EventMongo', () => {
    it('should have the same properties as DTO', () => {
        assertMongooseModelMatchesDTOProperties(ExerciseMongo, eventDTOProperties);
    })
})