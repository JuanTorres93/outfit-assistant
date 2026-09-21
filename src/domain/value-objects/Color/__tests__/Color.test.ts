import { describe, expect, it } from 'vitest';

import { ValidationDomainError } from '@/domain/common/domainErrors';

import { Color, VALID_COLORS } from '../Color';

describe('Color', () => {
  describe('create', () => {
    it('should create a valid color', () => {
      const color = Color.create('white');
      expect(color.value).toBe('white');
    });

    it('should create all valid colors', () => {
      VALID_COLORS.forEach((color) => {
        expect(() => Color.create(color)).not.toThrow();
      });
    });

    it('should normalize casing', () => {
      const color = Color.create('White');
      expect(color.value).toBe('white');
    });

    it('should throw ValidationDomainError for an invalid color', () => {
      expect(() => Color.create('banana')).toThrow(ValidationDomainError);
    });
  });

  describe('equals', () => {
    it('should return true for equal colors', () => {
      const white1 = Color.create('white');
      const white2 = Color.create('white');
      expect(white1.equals(white2)).toBe(true);
    });

    it('should return false for different colors', () => {
      const white = Color.create('white');
      const black = Color.create('black');
      expect(white.equals(black)).toBe(false);
    });
  });
});
