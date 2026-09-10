import { describe, expect, it } from 'vitest';
import { Size } from '../Size';
import { ValidationDomainError } from '@/domain/common/domainErrors';

describe('Size', () => {
  describe('create', () => {
    it('should create a valid size', () => {
      const size = Size.create('m');
      expect(size.value).toBe('m');
    });

    it('should create all valid sizes', () => {
      const sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl'];
      sizes.forEach((size) => {
        expect(() => Size.create(size)).not.toThrow();
      });
    });

    it('should normalize casing', () => {
      const size = Size.create('M');
      expect(size.value).toBe('m');
    });

    it('should throw ValidationDomainError for an invalid size', () => {
      expect(() => Size.create('banana')).toThrow(ValidationDomainError);
    });
  });

  describe('equals', () => {
    it('should return true for equal sizes', () => {
      const m1 = Size.create('m');
      const m2 = Size.create('m');
      expect(m1.equals(m2)).toBe(true);
    });

    it('should return false for different sizes', () => {
      const m = Size.create('m');
      const l = Size.create('l');
      expect(m.equals(l)).toBe(false);
    });
  });
});
