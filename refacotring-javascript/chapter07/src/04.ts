class Order {
    _quantity: number;
    _item: { price: number };

    constructor(quantity: number, item: { price: number }) {
        this._quantity = quantity;
        this._item = item;
    }

    get price() {
        return this.basePrice * this.discountFactor;
    }

    private get basePrice(): number {
        return this._quantity * this._item.price;
    }

    private get discountFactor(): number {
        let discountFactor: number = 0.98;
        if (this.basePrice > 1000) {
            discountFactor -= 0.03;
        }
        return discountFactor;
    }
}

const order = new Order(10, {price: 1000});
console.log(order.price);
