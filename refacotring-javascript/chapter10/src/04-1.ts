const feathers = (birds: any) => new Map(birds.map((b: any) => [b.name, feather(b)]));
const velocities = (birds: any) => new Map(birds.map((b: any) => [b.name, velocity(b)]));

class EuropeanSwallow  {
    constructor() {
    }

    get feather() {
        return '보통';
    }

    get velocity(): number {
        return 35;
    }
}

class AfricanSwallow {
    _numberOfCoconuts: number;

    constructor(bird: any) {
        this._numberOfCoconuts = bird.numberOfCoconuts;
    }

    get feather() {
        return this._numberOfCoconuts > 2 ? '지침' : '보통';
    }

    get velocity() {
        return 40 - 2 * this._numberOfCoconuts;
    }
}

class NorwegianBlueParrot {
    _isNailed: boolean;
    _voltage: number;

    constructor(bird: any) {
        this._isNailed = bird.isNailed;
        this._voltage = bird.voltage;
    }

    get feather() {
        return this._voltage > 100 ? '그을림' : '예쁨';
    }

    get velocity() {
        return this._isNailed ? 0 : 10 + this._voltage / 10;
    }
}

const createBird = (bird: any) => {
    switch (bird.type) {
        case '유럽 제비':
            return new EuropeanSwallow();
        case '아프리카 제비':
            return new AfricanSwallow(bird);
        case '노르웨이 파랑 앵무':
            return new NorwegianBlueParrot(bird);
        default:
            throw new Error('Unknown bird type');
    }
};

const feather = (bird: any) => {
    return createBird(bird).feather;
};
const velocity = (bird: any) => {
    return createBird(bird).velocity;
};

const birds = [
    {name: '유제', type: '유럽 제비'},
    {name: '아제1', type: '아프리카 제비', numberOfCoconuts: 2},
    {name: '아제2', type: '아프리카 제비', numberOfCoconuts: 4},
    {name: '파앵1', type: '노르웨이 파랑 앵무', isNailed: false, voltage: 3000},
    {name: '파앵2', type: '노르웨이 파랑 앵무', isNailed: true, voltage: 50},
];
console.log(...feathers(birds));
console.log(...velocities(birds));
