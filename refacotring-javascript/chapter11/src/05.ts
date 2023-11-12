class Order {
    quantity: number = 0;
    itemPrice: number = 0;

    constructor() {
    }

    get finalPrice(): number {
        const basePrice = this.quantity * this.itemPrice;
        let discountLevel;
        if (this.quantity > 100) {
            discountLevel = 2;
        } else {
            discountLevel = 1;
        }
        return this.discountedPrice(basePrice, discountLevel);
    }

    discountedPrice(basePrice: number, discountLevel: number): number {
        switch (discountLevel) {
            case 1:
                return basePrice * 0.95;
            case 2:
                return basePrice * 0.9;
            default:
                return basePrice;
        }
    }
}
