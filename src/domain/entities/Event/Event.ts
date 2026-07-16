import { Id } from "../../value-objects/Id/Id";
import { Text } from "../../value-objects/Text/Text"
//import { Outfits } from "../../value-objects/Outfits/Outfits";
import { DomainDate } from "@/domain/value-objects/DomainDate/DomainDate";

export type EventCreateProps = {
    id: string;
    name: string;
    //outfits: Outfits[];
    location?: string;
    date?: Date;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type EventProps = {
    id: Id;
    name: Text;
    //outfits: Outfits[];
    location: Text;
    date: DomainDate;
    userId: Id;
    createdAt: DomainDate;
    updatedAt: DomainDate;
}

export class Event {
    private constructor(private readonly props: EventProps) {}

    static create(props: EventCreateProps): Event {
        const EventProps: EventProps = {
            id: Id.create(props.id),
            name: Text.create(props.name),
            //outfits: props.outfits.map(outfit => Outfits.create(outfit)),
            location: Text.create(props.location),
            date: DomainDate.create(props.date),
            userId: Id.create(props.userId),
            createdAt: DomainDate.create(props.createdAt),
            updatedAt: DomainDate.create(props.updatedAt),
        };
        return new Event(EventProps);
    }

    toCreateProps(): EventCreateProps {
        return {
            id: this.id,
            name: this.name,
            //outfits: this.outfits,
            location: this.location,
            date: this.date,
            userId: this.userId,
            createdAt: this.props.createdAt.value,
            updatedAt: this.props.updatedAt.value,
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

    get id() {
        return this.props.id.value;
    }

    get name() {
        return this.props.name.value;
    }

    /*get outfits() {
        return this.props.outfits.map(outfit => outfit.toCreateProps());
    }*/

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