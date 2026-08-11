import { ValidationDomainError } from '@/domain/common/domainErrors';

import { ValueObject } from '../ValueObject';

type IntegerProps = {
  value: number;
};

type IntegerOptions = {
  onlyPositive?: boolean;
  canBeZero?: boolean;
  min?: number;
  max?: number;
};

export class Integer extends ValueObject<IntegerProps> {
  private readonly _value: number;

  private constructor(props: IntegerProps) {
    super(props);

    this._value = props.value;
  }

  public static create(value: number, options?: IntegerOptions) {
    if (value === null || value === undefined) {
      throw new ValidationDomainError('Integer value cannot be null or undefined');
    }

    if (typeof value !== 'number' || isNaN(value)) {
      throw new ValidationDomainError('Integer value must be a valid number');
    }

    if (!Number.isInteger(value)) {
      throw new ValidationDomainError('Integer value must be an integer');
    }

    if (options?.onlyPositive && value < 0) {
      throw new ValidationDomainError('Integer value must be positive');
    }

    if (options?.canBeZero === false && value === 0) {
      throw new ValidationDomainError('Integer value cannot be zero');
    }

    if (options?.min !== undefined && value < options.min) {
      throw new ValidationDomainError(
        `Integer value must be greater than or equal to ${options.min}`,
      );
    }

    if (options?.max !== undefined && value > options.max) {
      throw new ValidationDomainError(`Integer value must be less than or equal to ${options.max}`);
    }

    return new Integer({ value });
  }

  get value(): number {
    return this._value;
  }
}
