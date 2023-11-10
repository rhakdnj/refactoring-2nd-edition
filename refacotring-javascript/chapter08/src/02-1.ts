import { LocalDate, LocalDateTime } from '@js-joda/core';

class Customer {
    private readonly _name;
    private readonly _contract;

    constructor(name: string, discountRate: number) {
        this._name = name;
        this._contract = new CustomerContract(LocalDateTime.now(), discountRate);
    }

    get discountRate() {
        return this._contract.discountRate;
    }

    becomePreferred() {
        this._contract.discountRate += 0.03;
        // do other stuff
    }
}

class CustomerContract {
    _startDate: LocalDateTime;
    private _discountRate: number;

    constructor(startDate: LocalDateTime, discountRate: number) {
        this._startDate = startDate;
        this._discountRate = discountRate;
    }

    get discountRate(): number {
        return this._discountRate;
    }

    set discountRate(discountRate: number) {
        this._discountRate = discountRate;
    }
}

const customer1 = new Customer('customer', 0.1);
customer1.becomePreferred();
console.log(customer1.discountRate);
