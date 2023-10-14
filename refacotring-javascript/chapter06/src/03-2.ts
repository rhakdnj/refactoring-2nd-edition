class Order {
    private _data: any;

    constructor(record: any) {
        this._data = record;
    }

    get quantity() {
        return this._data.quantity;
    }

    get itemPrice() {
        return this._data.itemPrice;
    }

    get price() {
        return this.basePrice - this.qualityDiscount + this.shipping;
    }

    private get qualityDiscount() {
        return Math.max(0, this.quantity - 500) * this.itemPrice * 0.05;
    }

    private get basePrice() {
        return this.quantity * this.itemPrice;
    }

    private get shipping() {
        return Math.min(this.quantity * this.itemPrice * 0.1, 100);
    }
}

const order1: Order = new Order({
    itemPrice: 600,
    quantity: 3,
});
const order2: Order = new Order({
    itemPrice: 8000,
    quantity: 2,
});

console.log(order1.price);
console.log(order2.price);
