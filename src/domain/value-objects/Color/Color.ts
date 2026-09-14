import { ValidationDomainError } from '../../common/domainErrors';
import { ValueObject } from '../ValueObject';

export const VALID_COLORS = [
  'white',
  'black',
  'gray',
  'beige',
  'brown',
  'navy',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
];

export class Color extends ValueObject<string> {
  private constructor(props: string) {
    super(props);
  }

  public static create(value: string): Color {
    if (typeof value !== 'string') {
      throw new ValidationDomainError('Color must be a string');
    }

    const normalizedValue = value.toLowerCase();

    if (!VALID_COLORS.includes(normalizedValue)) {
      throw new ValidationDomainError('Invalid color');
    }

    return new Color(normalizedValue);
  }

  get value(): string {
    return this.props;
  }
}
