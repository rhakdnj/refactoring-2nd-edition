const acquireReading = () => ({
    customer: 'ivan',
    quantity: 10,
    month: 5,
    year: 2017,
});

const baseRate = (month: number, year: number) => year - 2000 + month;
const taxThreshold = (year: number) => (year - 2000) * 0.1;

class Reading {
    private readonly _customer: any;
    private readonly _quantity: number;
    private readonly _month: number;
    private readonly _year: number;

    public constructor(
        data: any
    ) {
        this._customer = data.customer;
        this._quantity = data.quantity;
        this._month = data.month;
        this._year = data.year;
    }

    public get customer(): any {
        return this._customer;
    }

    public get quantity(): number {
        return this._quantity;
    }

    public get month(): number {
        return this._month;
    }

    public get year(): number {
        return this._year;
    }

    public get baseCharge(): number {
        return baseRate(this._month, this._year) * this._quantity;
    }

    public get taxableCharge(): number {
        return Math.max(0, this.baseCharge - taxThreshold(this._year));
    }
}

const client1 = () => {
    const reading: Reading = new Reading(acquireReading());
    return reading.baseCharge;
};

const client2 = () => {
    const reading: Reading = new Reading(acquireReading());
    return reading.taxableCharge;
};

const client3 = () => {
    const reading = new Reading(acquireReading());
    return reading.baseCharge;
};

[client1, client2, client3].forEach(c => console.log(c()));

