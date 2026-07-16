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
    userID?: string;
};

export type EventProps = {
    id: Id;
    name: Text;
    //outfits: Outfits[];
    location: string;
    date: DomainDate;
    userID: Id;
}

export class Event {
    private constructor(private readonly props: EventProps) {}

    static create(props: EventCreateProps): Event {
        const EventProps: EventProps = {
            id: Id.create(props.id),
            name: Text.create(props.name),
            //outfits: props.outfits.map(outfit => Outfits.create(outfit)),
            location: props.location,
            date: DomainDate.create(props.date),
            userID: Id.create(props.userID),
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
            userID: this.userID,
        };
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
        return this.props.location;
    }

    get date() {
        return this.props.date.value;
    }

    get userID() {
        return this.props.userID.value;
    }
}