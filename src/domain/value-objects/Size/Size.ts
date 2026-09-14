import { ValidationDomainError } from '../../common/domainErrors';
import { ValueObject } from '../ValueObject';

export const VALID_SIZES = ['xs', 's', 'm', 'l', 'xl', 'xxl'];

export class Size extends ValueObject<string> {
  private constructor(props: string) {
    super(props);
  }

  public static create(value: string): Size {
    if (typeof value !== 'string') {
      throw new ValidationDomainError('Size must be a string');
    }

    const normalizedValue = value.toLowerCase();

    if (!VALID_SIZES.includes(normalizedValue)) {
      throw new ValidationDomainError('Invalid size');
    }

    return new Size(normalizedValue);
  }

  get value(): string {
    return this.props;
  }
}
