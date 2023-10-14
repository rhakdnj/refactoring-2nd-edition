import Province from '../src/province';

const sampleProvinceData = () => ({
    name: 'Asia',
    producers: [
        {name: 'Byzzantium', cost: 10, production: 9},
        {name: 'Attalia', cost: 12, production: 10},
        {name: 'Sinope', cost: 10, production: 6},
    ],
    demand: 30,
    price: 20,
});

const sampleProvinceDataWithNoProducers = () => ({
    name: 'Asia',
    producers: [],
    demand: 30,
    price: 20,
});

describe('Province', () => {
    let asia: Province;
    beforeEach(() => {
        asia = new Province(sampleProvinceData());
    });

    it('[성공] shortfall should be 5', () => {
        expect(asia.shortfall).toBe(5);
    });

    it('[성공] profit should be 230', () => {
        expect(asia.profit).toBe(230);
    });

    it('[Edge Case] given: nothing, when: zero demand, then: shortfall should not be negative', () => {
        asia.demand = '0';
        expect(asia.shortfall).toBe(-25);
        expect(asia.profit).toBe(0);
    });

    it('[Edge Case] given: nothing, when: 수요가 0, then: shortfall should not be negative', () => {
        asia.demand = '0';
        expect(asia.shortfall).toBe(-25);
        expect(asia.profit).toBe(0);
    });

    it('[Edge Case] given: nothing, when: 수요가 빈 문자열, then: shortfall should not be negative', () => {
        asia.demand = '';
        expect(asia.shortfall).toBe(NaN);
        expect(asia.profit).toBe(NaN);
    });
});

describe('when: no producers', () => {
    let noProducers: Province;
    beforeEach(() =>
        noProducers = new Province({name: 'Asia', producers: [], demand: 30, price: 20,})
    );

    it('[Edge Case] given: nothing, when: no producers, then: shortfall should be 30', () => {
        expect(noProducers.shortfall).toBe(30);
    });

    it('[Edge Case] given: nothing, when: no producers, then: shortfall should be 0', () => {
        expect(noProducers.profit).toBe(0);
    });
});

describe('when: producers is string not array', () => {
    let notArrayProducers: Province;
    beforeEach(() =>
        notArrayProducers = new Province({name: 'Asia', producers: "", demand: 30, price: 20,})
    );

    it('[Edge Case] given: nothing, when: no producers, then: shortfall should be 30', () => {
        expect(notArrayProducers.shortfall).toBe(0);
    });
});
