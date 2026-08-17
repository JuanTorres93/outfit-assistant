import { ValidationDomainError } from '../../common/domainErrors';
import { ValueObject } from '../ValueObject';

export class Season extends ValueObject<string> {
  private constructor(props: string) {
    super(props);
  }

  public static create(value: string): Season {
    if (typeof value !== 'string') {
      throw new ValidationDomainError('Season must be a string');
    }

    const normalizedValue = value.toLowerCase();

    if (!['spring', 'summer', 'autumn', 'winter'].includes(normalizedValue)) {
      throw new ValidationDomainError('Invalid season');
    }

    return new Season(normalizedValue);
  }

  get value(): string {
    return this.props;
  }
}