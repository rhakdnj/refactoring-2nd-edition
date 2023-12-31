import Producer from './producer';

export default class Province {
    private readonly _name: string;
    private readonly _producers: Producer[];
    private _totalProduction: number;
    private _demand: number;
    private _price: number;

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

    public get name(): string {
        return this._name;
    }

    public get producers(): Producer[] {
        return this._producers;
    }

    public get totalProduction(): number {
        return this._totalProduction;
    }

    public set totalProduction(totalProduction: number) {
        this._totalProduction = totalProduction;
    }

    public get demand(): number {
        return this._demand;
    }

    public set demand(demand: string) {
        this._demand = parseInt(demand);
    }

    public get price(): number {
        return this._price;
    }

    public set price(price: string) {
        this._price = parseInt(price);
    }

    public get shortfall(): number {
        return this._demand - this._totalProduction;
    }

    public get profit(): number {
        return this.demandValue - this.demandCost;
    }

    public get demandValue(): number {
        return this.satisfiedDemand * this._price;
    }

    public get satisfiedDemand(): number {
        return Math.min(this._demand, this._totalProduction);
    }

    public get demandCost(): number {
        let remainingDemand = this._demand;
        let result = 0;
        this._producers
            .sort((a, b) => a.cost - b.cost)
            .forEach(p => {
                const contribution = Math.min(remainingDemand, p.production);
                remainingDemand -= contribution;
                result += contribution * p.cost;
            });
        return result;
    }
}
