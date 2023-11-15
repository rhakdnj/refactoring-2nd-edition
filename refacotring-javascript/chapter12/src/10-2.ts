class Bird10_2 {
    _name;
    _feather;

    constructor(data: { name: string, feather?: string }) {
        this._name = data.name;
        this._feather = data.feather;
    }

    get name() {
        return this._name;
    }

    get feather() {
        return this._feather || '보통';
    }

    get airSpeedVelocity(): number | null {
        return null;
    }
}

class EuropeanSwallow10_2 extends Bird10_2 {
    get airSpeedVelocity(): number {
        return 35;
    }
}

class AfricanSwallow10_2 extends Bird10_2 {
    #numberOfCoconuts;

    constructor(data: { name: string, feather?: string, numberOfCoconuts: number }) {
        super(data);
        this.#numberOfCoconuts = data.numberOfCoconuts;
    }

    get airSpeedVelocity() {
        return 40 - 2 * this.#numberOfCoconuts;
    }
}

class NorwegianBlueParrot10_2 extends Bird10_2 {
    #voltage;
    #isNailed;

    constructor(data: { name: string, feather?: string, voltage: number, isNailed: boolean }) {
        super(data);
        this.#voltage = data.voltage;
        this.#isNailed = data.isNailed;
    }

    get feather() {
        if (this.#voltage > 100) return '그을림';
        return this._feather || '예쁨';
    }

    get airSpeedVelocity() {
        return this.#isNailed ? 0 : 10 + this.#voltage / 10;
    }
}

const createBird10_2 = (data: any) => {
    switch (data.type) {
        case 'european':
            return new EuropeanSwallow10_2(data);
        case 'african':
            return new AfricanSwallow10_2(data);
        case 'norwegian':
            return new NorwegianBlueParrot10_2(data);
        default:
            return new Bird10_2(data);
    }
};
const birds10_2: Bird10_2[] = [
    createBird10_2({type: 'european', name: '유제'}),
    createBird10_2({type: 'african', name: '아제1', numberOfCoconuts: 2}),
    createBird10_2({type: 'african', name: '아제2', numberOfCoconuts: 4}),
    createBird10_2({type: 'norwegian', name: '파앵1', isNailed: false, voltage: 3000}),
    createBird10_2({type: 'norwegian', name: '파앵2', isNailed: true, voltage: 50}),
    new Bird10_2({name: '가짜새'}),
];
console.log(birds10_2.map((b: any) => ({name: b.name, velocity: b.airSpeedVelocity, feather: b.feather})));
