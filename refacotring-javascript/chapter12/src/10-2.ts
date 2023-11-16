class Bird10_2 {
    _name;
    _feather;
    _speciesDelegate;

    constructor(data: any) {
        this._name = data.name;
        this._feather = data.feather;
        this._speciesDelegate = this.selectSpeciesDelegate(data);
    }

    get name() {
        return this._name;
    }

    get feather() {
        return this._speciesDelegate.feather;
    }

    get airSpeedVelocity(): number | null {
        return this._speciesDelegate.airSpeedVelocity;
    }

    private selectSpeciesDelegate(data: any) {
        switch (data.type) {
            case 'european':
                return new EuropeanSwallowDelegate10_2(data, this);
            case 'african':
                return new AfricanSwallowDelegate10_2(data, this);
            case 'norwegian':
                return new NorwegianBlueParrotDelegate10_2(data, this);
            default:
                return new SpeciesDelegate10_2(data, this);
        }
    }
}

class SpeciesDelegate10_2 {
    protected readonly _bird;

    constructor(data: any, bird: any) {
        this._bird = bird;
    }

    get airSpeedVelocity(): number | null {
        return null;
    }

    get feather() {
        return this._bird._feather || '보통';
    }
}

class EuropeanSwallowDelegate10_2 extends SpeciesDelegate10_2 {
    get airSpeedVelocity() {
        return 35;
    }
}

class AfricanSwallowDelegate10_2 extends SpeciesDelegate10_2 {
    private readonly _numberOfCoconuts;

    constructor(data: any, bird: any) {
        super(data, bird);
        this._numberOfCoconuts = data.numberOfCoconuts;
    }

    get airSpeedVelocity() {
        return 40 - 2 * this._numberOfCoconuts;
    }
}

// @ts-ignore
class NorwegianBlueParrotDelegate10_2 extends SpeciesDelegate10_2 {
    private readonly _voltage;
    private readonly _isNailed;

    constructor(data: any, bird: any) {
        super(data, bird);
        this._voltage = data.voltage;
        this._isNailed = data.isNailed;
    }

    get feather() {
        if (this._voltage > 100) return '그을림';
        return this._bird._feather || '예쁨';
    }

    get airSpeedVelocity() {
        return this._isNailed ? 0 : 10 + this._voltage / 10;
    }
}

const createBird10_2 = (data: any) => new Bird10_2(data);

const birds10_2: Bird10_2[] = [
    createBird10_2({type: 'european', name: '유제'}),
    createBird10_2({type: 'african', name: '아제1', numberOfCoconuts: 2}),
    createBird10_2({type: 'african', name: '아제2', numberOfCoconuts: 4}),
    createBird10_2({type: 'norwegian', name: '파앵1', isNailed: false, voltage: 3000}),
    createBird10_2({type: 'norwegian', name: '파앵2', isNailed: true, voltage: 50}),
    new Bird10_2({name: '가짜새'}),
];
console.log(birds10_2.map((b: any) => ({name: b.name, velocity: b.airSpeedVelocity, feather: b.feather})));
