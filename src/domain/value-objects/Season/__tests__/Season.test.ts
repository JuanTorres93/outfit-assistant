import { describe, expect, it } from 'vitest';
import { Season } from '../Season';
import { ValidationDomainError } from '@/domain/common/domainErrors';

describe('Season', () => {
  describe('create', () => {
    it('should create a valid season', () => {
      const season = Season.create('summer');

      expect(season.value).toBe('summer');
    });

    it('should create all valid seasons', () => {
      const seasons = ['spring', 'summer', 'autumn', 'winter'];

      seasons.forEach((season) => {
        expect(() => Season.create(season)).not.toThrow();
      });
    });

    it('should throw ValidationDomainError for an invalid season', () => {
      expect(() => Season.create('banana')).toThrow(ValidationDomainError);
    });
  });

  describe('equals', () => {
    it('should return true for equal seasons', () => {
      const summer1 = Season.create('summer');
      const summer2 = Season.create('summer');

      expect(summer1.equals(summer2)).toBe(true);
    });

    it('should return false for different seasons', () => {
      const summer = Season.create('summer');
      const winter = Season.create('winter');

      expect(summer.equals(winter)).toBe(false);
    });
  });
});