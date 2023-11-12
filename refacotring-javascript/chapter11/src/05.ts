class Order {
    quantity: number = 0;
    itemPrice: number = 0;

    constructor() {
    }

    get finalPrice(): number {
        const basePrice = this.quantity * this.itemPrice;
        switch (this.discountLevel) {
            case 1:
                return basePrice * 0.95;
            case 2:
                return basePrice * 0.9;
            default:
                return basePrice;
        }
    }

    private get discountLevel() {
        return this.quantity > 100 ? 2 : 1;
    }
}
