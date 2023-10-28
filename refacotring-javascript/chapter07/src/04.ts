class Order {
    _quantity: number;
    _item: { price: number };

    constructor(quantity: number, item: { price: number }) {
        this._quantity = quantity;
        this._item = item;
    }

    get price() {
        let basePrice: number = this._quantity * this._item.price;
        let discountFactor: number = 0.98;
        if (basePrice > 1000) discountFactor -= 0.03;
        return basePrice * discountFactor;
    }
}

const order = new Order(10, {price: 1000});
console.log(order.price);
