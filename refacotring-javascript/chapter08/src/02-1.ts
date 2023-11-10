import { LocalDate, LocalDateTime } from '@js-joda/core';

class Customer {
    private readonly _name;
    private _discountRate;
    private readonly _contract;

    constructor(name: string, discountRate: number) {
        this._name = name;
        this._discountRate = discountRate;
        this._contract = new CustomerContract(LocalDateTime.now());
    }

    get discountRate() {
        return this._discountRate;
    }

    becomePreferred() {
        this._discountRate += 0.03;
        // do other stuff
    }

    applyDiscount(amount: any) {
        return amount.subtract(amount.multiply(this._discountRate));
    }
}

class CustomerContract {
    _startDate: LocalDateTime;

    constructor(startDate: LocalDateTime) {
        this._startDate = startDate;
    }
}

const customer1 = new Customer('customer', 0.1);
customer1.becomePreferred();
console.log(customer1.discountRate);
