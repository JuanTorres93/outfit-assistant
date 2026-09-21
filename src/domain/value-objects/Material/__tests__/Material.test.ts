import { describe, expect, it } from 'vitest';

import { ValidationDomainError } from '@/domain/common/domainErrors';

import { Material, VALID_MATERIALS } from '../Material';

describe('Material', () => {
  describe('create', () => {
    it('should create a valid material', () => {
      const material = Material.create('cotton');
      expect(material.value).toBe('cotton');
    });

    it('should create all valid materials', () => {
      VALID_MATERIALS.forEach((material) => {
        expect(() => Material.create(material)).not.toThrow();
      });
    });

    it('should normalize casing', () => {
      const material = Material.create('Cotton');
      expect(material.value).toBe('cotton');
    });

    it('should throw ValidationDomainError for an invalid material', () => {
      expect(() => Material.create('banana')).toThrow(ValidationDomainError);
    });
  });

  describe('equals', () => {
    it('should return true for equal materials', () => {
      const cotton1 = Material.create('cotton');
      const cotton2 = Material.create('cotton');
      expect(cotton1.equals(cotton2)).toBe(true);
    });

    it('should return false for different materials', () => {
      const cotton = Material.create('cotton');
      const wool = Material.create('wool');
      expect(cotton.equals(wool)).toBe(false);
    });
  });
});
