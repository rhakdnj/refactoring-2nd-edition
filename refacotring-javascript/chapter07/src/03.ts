class Order {
    #priority: Priority;

    constructor(data: any) {
        this.#priority = data.priority;
    }

    get priorityString(): string {
        return this.#priority.toString();
    }

    get priority(): Priority {
        return this.#priority;
    }

    set priority(value: string) {
        this.#priority = new Priority(value);
    }
}

type PriorityType = 'low' | 'normal' | 'high' | 'rush';

class Priority {
    static legalValues(): PriorityType[] {
        return ['low', 'normal', 'high', 'rush'];
    }

    #value: string;

    constructor(value: string) {
        this.#value = value;
    }

    toString(): string {
        return this.#value;
    }

    public get index() {
        return Priority.legalValues().findIndex((s: PriorityType) => s === this.#value);
    }

    public equals(other: Priority): boolean {
        return this.index === other.index;
    }

    public higherThan(other: Priority): boolean {
        return this.index > other.index;
    }

    public lowerThan(other: Priority) {
        return this.index < other.index;
    }
}

const client1 = () => {
    const orders: any[] = [{priority: 'high'}, {priority: 'rush'}, {priority: 'low'}, {priority: 'normal'}].map(
        o => new Order(o),
    );
    const highPriorityCount = orders.filter(o => o.priorityString === 'high' || o.priorityString === 'rush').length;
    return highPriorityCount;
};
console.log(client1());
