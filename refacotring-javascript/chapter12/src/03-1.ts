export class Party {
    protected _name: string;

    constructor(name: string) {
        this._name = name;
    }

    get name() {
        return this._name;
    }
}

export class Employee extends Party {
    #id;
    #monthlyCost;

    constructor(name: string, id: string, monthlyCost: number) {
        super(name);
        this.#id = id;
        this.#monthlyCost = monthlyCost;
    }

    get monthlyCost() {
        return this.#monthlyCost;
    }
}

export class Department extends Party {
    #staff;

    constructor(name: string, staff: Employee[]) {
        super(name);
        this.#staff = staff;
    }

    get staff() {
        return this.#staff;
    }
}
