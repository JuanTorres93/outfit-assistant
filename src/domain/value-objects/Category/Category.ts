import { ValidationDomainError } from '../../common/domainErrors';
import { ValueObject } from '../ValueObject';

export class Category extends ValueObject<string> {
  private constructor(props: string) {
    super(props);
  }

  public static create(value: string): Category {
    if (typeof value !== 'string') {
      throw new ValidationDomainError('Category must be a string');
    }

    const normalizedValue = value.toLowerCase();

    if (
      !['top', 'bottom', 'outerwear', 'dress', 'footwear', 'accessory'].includes(
        normalizedValue,
      )
    ) {
      throw new ValidationDomainError('Invalid category');
    }

    return new Category(normalizedValue);
  }

  get value(): string {
    return this.props;
  }
}
