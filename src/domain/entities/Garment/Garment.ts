import { DomainDate } from '../../value-objects/DomainDate/DomainDate';
import { Id } from '../../value-objects/Id/Id';
import { Text } from '../../value-objects/Text/Text';

export type GarmentCreateProps = {
  id: string;

  name: string;
  category: string;
  colors: string[];

  brand?: string;
  size?: string;
  material?: string;
  seasons?: string[];

  createdAt?: Date;
  updatedAt?: Date;
};

export type GarmentProps = {
  id: Id;

  name: Text;
  category: Text;
  colors: Text[];

  brand?: Text;
  size?: Text;
  material?: Text;
  seasons?: Text[];

  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export class Garment {
  private constructor(private readonly props: GarmentProps) {}

  static create(props: GarmentCreateProps): Garment {
    const entityProps: GarmentProps = {
      id: Id.create(props.id),

      name: Text.create(props.name),
      category: Text.create(props.category),
      colors: props.colors.map((color) => Text.create(color)),

      brand: props.brand ? Text.create(props.brand) : undefined,
      size: props.size ? Text.create(props.size) : undefined,
      material: props.material ? Text.create(props.material) : undefined,
      seasons: props.seasons?.map((season) => Text.create(season)),

      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new Garment(entityProps);
  }

  toCreateProps(): GarmentCreateProps {
    return {
      id: this.id,

      name: this.name,
      category: this.category,
      colors: this.colors,

      brand: this.brand,
      size: this.size,
      material: this.material,
      seasons: this.seasons,

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

  get category() {
    return this.props.category.value;
  }

  get colors() {
    return this.props.colors.map((color) => color.value);
  }

  get brand() {
    return this.props.brand?.value;
  }

  get size() {
    return this.props.size?.value;
  }

  get material() {
    return this.props.material?.value;
  }

  get seasons() {
    return this.props.seasons?.map((season) => season.value);
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}