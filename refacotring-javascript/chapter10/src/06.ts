import assert from 'assert';

class Customer {
    _discountRate: number;

    constructor(discountRate: number) {
        this._discountRate = discountRate;
    }

    applyDiscount(number: number) {
        if (!this._discountRate) return number;
        assert(this._discountRate >= 0);
        return number - this._discountRate * number;
    }

    set discountRate(number: number) {
        assert(number === null || number >= 0);
        this._discountRate = number;
    }
}

const c = new Customer(10);
c.discountRate = -10; // Assertion Error
