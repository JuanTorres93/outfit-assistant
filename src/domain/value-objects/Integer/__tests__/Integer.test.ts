import { describe, expect, it } from 'vitest';

import { ValidationDomainError } from '@/domain/common/domainErrors';

import { Integer } from '../Integer';

describe('Integer', () => {
  it('should create a valid positive Integer by default', async () => {
    const integerValue = 123;

    const integer = Integer.create(integerValue);
    expect(integer).toBeInstanceOf(Integer);
    expect(integer.value).toBe(integerValue);
  });

  it('should create a valid negative Integer by default', async () => {
    const integerValue = -123;

    const integer = Integer.create(integerValue);
    expect(integer).toBeInstanceOf(Integer);
    expect(integer.value).toBe(integerValue);
  });

  it('should create a valid zero Integer by default', async () => {
    const integerValue = 0;

    const integer = Integer.create(integerValue);
    expect(integer).toBeInstanceOf(Integer);
    expect(integer.value).toBe(integerValue);
  });

  it('should throw validation error if integer is not a number', async () => {
    // @ts-expect-error testing invalid input
    expect(() => Integer.create('123')).toThrow(ValidationDomainError);
  });

  it('should throw error if integer has decimals', async () => {
    expect(() => Integer.create(123.45)).toThrow(ValidationDomainError);
  });

  it('it should throw error if trying to create a negative Integer when not allowed', async () => {
    const options = { onlyPositive: true };

    expect(() => {
      Integer.create(-10, options);
    }).toThrow(ValidationDomainError);
  });

  it('should allow zero when onlyPositive is true', async () => {
    const options = { onlyPositive: true };

    const integer = Integer.create(0, options);
    expect(integer).toBeInstanceOf(Integer);
    expect(integer.value).toBe(0);
  });

  it('should allow creating positive Integer when onlyPositive is true', async () => {
    const options = { onlyPositive: true };
    const integerValue = 50;

    const integer = Integer.create(integerValue, options);
    expect(integer).toBeInstanceOf(Integer);
    expect(integer.value).toBe(integerValue);
  });

  it('should allow creating negative Integer when onlyPositive is false', async () => {
    const options = { onlyPositive: false };
    const integerValue = -50;

    const integer = Integer.create(integerValue, options);
    expect(integer).toBeInstanceOf(Integer);
    expect(integer.value).toBe(integerValue);
  });

  it('should allow creating zero Integer when onlyPositive is false', async () => {
    const options = { onlyPositive: false };
    const integerValue = 0;

    const integer = Integer.create(integerValue, options);
    expect(integer).toBeInstanceOf(Integer);
    expect(integer.value).toBe(integerValue);
  });

  it('should throw error if trying to create zero when it is not allowed', async () => {
    const options = { canBeZero: false };

    expect(() => {
      Integer.create(0, options);
    }).toThrow(ValidationDomainError);
  });

  it('should throw error if min not respected', async () => {
    const options = { min: 10 };

    expect(() => {
      Integer.create(5, options);
    }).toThrow(ValidationDomainError);
  });

  it('should allow creating Integer equal to min', async () => {
    const options = { min: 10 };
    const integerValue = 10;

    const integer = Integer.create(integerValue, options);
    expect(integer).toBeInstanceOf(Integer);
    expect(integer.value).toBe(integerValue);
  });

  it('should throw error if max is not respected', async () => {
    const options = { max: 20 };

    expect(() => {
      Integer.create(25, options);
    }).toThrow(ValidationDomainError);
  });

  it('should allow creating Integer equal to max', async () => {
    const options = { max: 20 };
    const integerValue = 20;

    const integer = Integer.create(integerValue, options);
    expect(integer).toBeInstanceOf(Integer);
    expect(integer.value).toBe(integerValue);
  });
});
