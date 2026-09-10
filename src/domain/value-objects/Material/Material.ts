import { ValidationDomainError } from '../../common/domainErrors';
import { ValueObject } from '../ValueObject';

export class Material extends ValueObject<string> {
  private constructor(props: string) {
    super(props);
  }

  public static create(value: string): Material {
    if (typeof value !== 'string') {
      throw new ValidationDomainError('Material must be a string');
    }

    const normalizedValue = value.toLowerCase();

    if (
      ![
        'cotton',
        'wool',
        'polyester',
        'silk',
        'leather',
        'denim',
        'linen',
        'cashmere',
        'nylon',
        'spandex',
        'viscose',
        'suede',
      ].includes(normalizedValue)
    ) {
      throw new ValidationDomainError('Invalid material');
    }

    return new Material(normalizedValue);
  }

  get value(): string {
    return this.props;
  }
}
