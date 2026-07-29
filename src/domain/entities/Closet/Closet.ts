import { AlreadyExistsDomainError, NotFoundDomainError } from '../../common/domainErrors';
import { DomainDate } from '../../value-objects/DomainDate/DomainDate';
import { Id } from '../../value-objects/Id/Id';

export type ClosetCreateProps = {
  id: string;

  userId: string;
  garmentIds?: string[];

  createdAt?: Date;
  updatedAt?: Date;
};

export type ClosetProps = {
  id: Id;

  userId: Id;
  garmentIds: Id[];

  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export class Closet {
  private constructor(private readonly props: ClosetProps) {}

  static create(props: ClosetCreateProps): Closet {
    const garmentIds = (props.garmentIds ?? []).map((garmentId) => Id.create(garmentId));

    assertNoDuplicateGarmentIds(garmentIds);

    const entityProps: ClosetProps = {
      id: Id.create(props.id),

      userId: Id.create(props.userId),
      garmentIds,

      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new Closet(entityProps);
  }

  addGarment(garmentId: string): void {
    const id = Id.create(garmentId);

    if (this.props.garmentIds.some((existingId) => existingId.equals(id))) {
      throw new AlreadyExistsDomainError(`Closet already contains garment with id ${garmentId}`);
    }

    this.props.garmentIds.push(id);
    this.props.updatedAt = DomainDate.create();
  }

  removeGarment(garmentId: string): void {
    const id = Id.create(garmentId);
    const index = this.props.garmentIds.findIndex((existingId) => existingId.equals(id));

    if (index === -1) {
      throw new NotFoundDomainError(`Closet does not contain garment with id ${garmentId}`);
    }

    this.props.garmentIds.splice(index, 1);
    this.props.updatedAt = DomainDate.create();
  }

  hasGarment(garmentId: string): boolean {
    const id = Id.create(garmentId);

    return this.props.garmentIds.some((existingId) => existingId.equals(id));
  }

  toCreateProps(): ClosetCreateProps {
    return {
      id: this.id,

      userId: this.userId,
      garmentIds: this.garmentIds,

      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  get id() {
    return this.props.id.value;
  }

  get userId() {
    return this.props.userId.value;
  }

  get garmentIds() {
    return this.props.garmentIds.map((garmentId) => garmentId.value);
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}

function assertNoDuplicateGarmentIds(garmentIds: Id[]): void {
  const seen = new Set<string>();

  for (const garmentId of garmentIds) {
    if (seen.has(garmentId.value)) {
      throw new AlreadyExistsDomainError(`Duplicate garment id ${garmentId.value} in closet`);
    }

    seen.add(garmentId.value);
  }
}
