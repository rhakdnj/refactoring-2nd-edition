class Order {
    private readonly _priority = '';

    constructor(data: any) {
        this._priority = data.priority;
    }

    get priority(): string {
        return this._priority;
    }
}

const client1 = () => {
    const orders: any[] = [{priority: 'high'}, {priority: 'rush'}, {priority: 'low'}, {priority: 'normal'}].map(
        o => new Order(o),
    );
    const highPriorityCount = orders.filter(o => o.priority === 'high' || o.priority === 'rush').length;
    return highPriorityCount;
};
console.log(client1());
