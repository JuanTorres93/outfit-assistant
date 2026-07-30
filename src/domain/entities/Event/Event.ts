import { AlreadyExistsApplicationError } from "@/application-layer/common/applicationErrors";
import { Id } from "../../value-objects/Id/Id";
import { Text } from "../../value-objects/Text/Text"
import { DomainDate } from "@/domain/value-objects/DomainDate/DomainDate";
import { NotFoundDomainError } from "@/domain/common/domainErrors";

export type EventCreateProps = {
    id: string;
    name: string;
    outfitIds?: string[];
    location?: string;
    date?: Date;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type EventProps = {
    id: Id;
    name: Text;
    outfitIds: Id[];
    location: Text;
    date: DomainDate;
    userId: Id;
    createdAt: DomainDate;
    updatedAt: DomainDate;
}

export class Event {
    private constructor(private readonly props: EventProps) {}

    static create(props: EventCreateProps): Event {

        const outfitIds = ((props.outfitIds ?? []).map(outfitId => Id.create(outfitId)));

        assertNoDuplicateOutfitIds(outfitIds);


        const EventProps: EventProps = {
            id: Id.create(props.id),
            name: Text.create(props.name),
            outfitIds: outfitIds,
            location: Text.create(props.location || ""),
            date: DomainDate.create(props.date),
            userId: Id.create(props.userId || ""),
            createdAt: DomainDate.create(props.createdAt),
            updatedAt: DomainDate.create(props.updatedAt),
        };
        return new Event(EventProps);
    }

    toCreateProps(): EventCreateProps {
        return {
            id: this.id,
            name: this.name,
            outfitIds: this.outfitIds,
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

    addOutfit(outfitId: string): void {
        const id = Id.create(outfitId);

        if (this.props.outfitIds.some(existingId => existingId.equals(id)))
        {
            throw new AlreadyExistsApplicationError(`Event already contains outfit with id ${outfitId}`);
        }

        this.props.outfitIds.push(id);
        this.props.updatedAt = DomainDate.create();
    }

    removeOutfit(outfitId: string): void {
        const id = Id.create(outfitId);
        const index = this.props.outfitIds.findIndex(existingId => existingId.equals(id));

        if(index === -1)
        {
            throw new NotFoundDomainError(`Event does not contain outfit with id ${outfitId}`);
        }

        this.props.outfitIds.splice(index, 1);
        this.props.updatedAt = DomainDate.create();
    }

    hasOutfit(outfitId: string): boolean {
        const id = Id.create(outfitId);

        return this.props.outfitIds.some(existingId => existingId.equals(id));
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

    get outfitIds() {
        return this.props.outfitIds.map(outfitId => outfitId.value);
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

function assertNoDuplicateOutfitIds(outfitIds: Id[]): void 
{
    const seen = new Set<string>();

    for (const outfitId of outfitIds) {
        if(seen.has(outfitId.value)) 
        {
            throw new AlreadyExistsApplicationError(`Duplicate outfit id ${outfitId.value} in event`);
        }

        seen.add(outfitId.value);
    }
}