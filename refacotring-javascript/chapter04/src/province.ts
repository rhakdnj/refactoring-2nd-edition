import Producer from './producer';

export default class Province {
    private readonly _name: string;
    private readonly _producers: Producer[];
    private _totalProduction: number;
    private _demand;
    private _price;

    constructor(doc: any) {
        this._name = doc.name;
        this._producers = [];
        this._totalProduction = 0;
        this._demand = doc.demand;
        this._price = doc.price;
        doc.producers.forEach((data: any) => this.addProducer(new Producer(this, data)));
    }

    private addProducer(producer: Producer): void {
        this._producers.push(producer);
        this._totalProduction += producer.production;
    }

    public get name() {
        return this._name;
    }

    public get producers() {
        return this._producers;
    }

    public get totalProduction() {
        return this._totalProduction;
    }

    public set totalProduction(totalProduction: number) {
        this._totalProduction = totalProduction;
    }

    public get demand() {
        return this._demand;
    }

    public set demand(demand: string) {
        this._demand = parseInt(demand);
    }

    public get price() {
        return this._price;
    }

    public set price(price: string) {
        this._price = parseInt(price);
    }

    public get shortfall() {
        return this._demand - this._totalProduction;
    }

    public get profit() {
        return this.demandValue - this.demandCost;
    }

    public get demandValue() {
        return this.satisfiedDemand * this._price;
    }

    public get satisfiedDemand() {
        return Math.min(this._demand, this._totalProduction);
    }

    public get demandCost(): number {
        let remainingDemand = this._demand
        let result = 0;
        this._producers
            .sort((a, b) => a.cost - b.cost)
            .forEach(p => {
                const contribution = Math.min(remainingDemand, p.production);
                remainingDemand -= contribution;
                result += contribution * p.cost;
            })
        return result;
    }
}
