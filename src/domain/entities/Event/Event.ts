import { AlreadyExistsDomainError, NotFoundDomainError } from '@/domain/common/domainErrors';
import { DomainDate } from '@/domain/value-objects/DomainDate/DomainDate';

import { Id } from '../../value-objects/Id/Id';
import { Text } from '../../value-objects/Text/Text';

export type EventCreateProps = {
  id: string;
  name: string;
  location?: string;
  date?: Date;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type EventProps = {
  id: Id;
  name: Text;
  location: Text;
  date: DomainDate;
  userId: Id;
  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export class Event {
  private constructor(private readonly props: EventProps) {}

  static create(props: EventCreateProps): Event {
    const EventProps: EventProps = {
      id: Id.create(props.id),
      name: Text.create(props.name),
      location: Text.create(props.location || ''),
      date: DomainDate.create(props.date),
      userId: Id.create(props.userId || ''),
      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };
    return new Event(EventProps);
  }

  toCreateProps(): EventCreateProps {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      date: this.date,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  changeName(newName: string): void {
    this.props.name = Text.create(newName);
    this.props.updatedAt = DomainDate.create(new Date());
  }

  updateLocation(newLocation: string): void {
    this.props.location = Text.create(newLocation);
    this.props.updatedAt = DomainDate.create(new Date());
  }

  updateDate(newDate: Date): void {
    this.props.date = DomainDate.create(newDate);
    this.props.updatedAt = DomainDate.create(new Date());
  }

  clone(): Event {
    return Event.create(this.toCreateProps());
  }

  get id() {
    return this.props.id.value;
  }

  get name() {
    return this.props.name.value;
  }

  get location() {
    return this.props.location.value;
  }

  get date() {
    return this.props.date.value;
  }

  get userId() {
    return this.props.userId.value;
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}

