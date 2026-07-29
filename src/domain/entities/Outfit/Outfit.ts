import { AlreadyExistsDomainError, NotFoundDomainError } from '../../common/domainErrors';
import { DomainDate } from '../../value-objects/DomainDate/DomainDate';
import { Id } from '../../value-objects/Id/Id';
import { Text, TextOptions } from '../../value-objects/Text/Text';

export type OutfitCreateProps = {
  id: string;

  userId: string;
  name: string;
  garmentIds?: string[];

  createdAt?: Date;
  updatedAt?: Date;
};

export type OutfitProps = {
  id: Id;

  userId: Id;
  name: Text;
  garmentIds: Id[];

  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export const nameTextOptions: TextOptions = {
  maxLength: 100,
  canBeEmpty: false,
};

export class Outfit {
  private constructor(private readonly props: OutfitProps) {}

  static create(props: OutfitCreateProps): Outfit {
    const garmentIds = (props.garmentIds ?? []).map((garmentId) => Id.create(garmentId));

    assertNoDuplicateGarmentIds(garmentIds);

    const entityProps: OutfitProps = {
      id: Id.create(props.id),

      userId: Id.create(props.userId),
      name: Text.create(props.name, nameTextOptions),
      garmentIds,

      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new Outfit(entityProps);
  }

  rename(newName: string): void {
    this.props.name = Text.create(newName, nameTextOptions);

    this.props.updatedAt = DomainDate.create();
  }

  addGarment(garmentId: string): void {
    const id = Id.create(garmentId);

    if (this.props.garmentIds.some((existingId) => existingId.equals(id))) {
      throw new AlreadyExistsDomainError(`Outfit already contains garment with id ${garmentId}`);
    }

    this.props.garmentIds.push(id);
    this.props.updatedAt = DomainDate.create();
  }

  removeGarment(garmentId: string): void {
    const id = Id.create(garmentId);
    const index = this.props.garmentIds.findIndex((existingId) => existingId.equals(id));

    if (index === -1) {
      throw new NotFoundDomainError(`Outfit does not contain garment with id ${garmentId}`);
    }

    this.props.garmentIds.splice(index, 1);
    this.props.updatedAt = DomainDate.create();
  }

  hasGarment(garmentId: string): boolean {
    const id = Id.create(garmentId);

    return this.props.garmentIds.some((existingId) => existingId.equals(id));
  }

  toCreateProps(): OutfitCreateProps {
    return {
      id: this.id,

      userId: this.userId,
      name: this.name,
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

  get name() {
    return this.props.name.value;
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
      throw new AlreadyExistsDomainError(`Duplicate garment id ${garmentId.value} in outfit`);
    }

    seen.add(garmentId.value);
  }
}
