import Province from './province';

export default class Producer {
    private readonly _province: Province;
    private readonly _cost: number;
    private readonly _name: string;
    private _production: number;

    constructor(province: Province, data: any) {
        this._province = province;
        this._cost = data.cost;
        this._name = data.name;
        this._production = data.production ?? 0;
    }

    public get cost(): number {
        return this._cost;
    }

    public get name(): string {
        return this._name;
    }

    public get production(): number {
        return this._production;
    }

    public set production(amountStr: string) {
        const amount = parseInt(amountStr);
        const newProduction = Number.isNaN(amount) ? 0 : amount;
        this._province.totalProduction += newProduction - this._production;
        this._production = newProduction;
    }
}
