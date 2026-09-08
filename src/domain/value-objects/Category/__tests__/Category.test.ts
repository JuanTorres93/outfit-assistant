import { describe, expect, it } from 'vitest';
import { Category } from '../Category';
import { ValidationDomainError } from '@/domain/common/domainErrors';

describe('Category', () => {
  describe('create', () => {
    it('should create a valid category', () => {
      const category = Category.create('top');
      expect(category.value).toBe('top');
    });

    it('should create all valid categories', () => {
      const categories = [
        'top',
        'bottom',
        'outerwear',
        'dress',
        'footwear',
        'accessory',
      ];
      categories.forEach((category) => {
        expect(() => Category.create(category)).not.toThrow();
      });
    });

    it('should normalize casing', () => {
      const category = Category.create('Top');
      expect(category.value).toBe('top');
    });

    it('should throw ValidationDomainError for an invalid category', () => {
      expect(() => Category.create('banana')).toThrow(ValidationDomainError);
    });
  });

  describe('equals', () => {
    it('should return true for equal categories', () => {
      const top1 = Category.create('top');
      const top2 = Category.create('top');
      expect(top1.equals(top2)).toBe(true);
    });

    it('should return false for different categories', () => {
      const top = Category.create('top');
      const bottom = Category.create('bottom');
      expect(top.equals(bottom)).toBe(false);
    });
  });
});
