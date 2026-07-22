import { Text, TextOptions } from '@/domain/value-objects/Text/Text';

import { DomainDate } from '../../value-objects/DomainDate/DomainDate';
import { Email } from '../../value-objects/Email/Email';
import { HashedPassword } from '../../value-objects/HashedPassword/HashedPassword';
import { Id } from '../../value-objects/Id/Id';

export type UserCreateProps = {
  id: string;

  name: string;
  email: string;
  hashedPassword: string;

  passwordChangedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserProps = {
  id: Id;

  name: Text;
  email: Email;
  hashedPassword: HashedPassword;

  passwordChangedAt?: DomainDate;
  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export const nameTextOptions: TextOptions = {
  maxLength: 100,
  canBeEmpty: false,
};

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserCreateProps): User {
    const entityProps: UserProps = {
      id: Id.create(props.id),

      name: Text.create(props.name, nameTextOptions),
      email: Email.create(props.email),
      hashedPassword: HashedPassword.create(props.hashedPassword),

      passwordChangedAt: props.passwordChangedAt
        ? DomainDate.create(props.passwordChangedAt)
        : undefined,

      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new User(entityProps);
  }

  changeName(newName: string): void {
    this.props.name = Text.create(newName, nameTextOptions);

    this.props.updatedAt = DomainDate.create();
  }

  updatePassword(newHashedPassword: string): void {
    this.props.hashedPassword = HashedPassword.create(newHashedPassword);

    const now = DomainDate.create();

    this.props.passwordChangedAt = now;
    this.props.updatedAt = now;
  }

  clone(): User {
    return User.create(this.toCreateProps());
  }

  toCreateProps(): UserCreateProps {
    return {
      id: this.id,

      name: this.name,
      email: this.email,
      hashedPassword: this.hashedPassword,

      passwordChangedAt: this.passwordChangedAt,

      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  get id() {
    return this.props.id.value;
  }

  get name() {
    return this.props.name.value;
  }

  get email() {
    return this.props.email.value;
  }

  get hashedPassword() {
    return this.props.hashedPassword.value;
  }

  get passwordChangedAt() {
    return this.props.passwordChangedAt?.value;
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}
