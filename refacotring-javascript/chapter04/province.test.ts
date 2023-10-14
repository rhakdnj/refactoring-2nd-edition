import Province from './province';
import * as assert from 'assert';

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

describe('Province', () => {
    it('[성공] shortfall should be 5', () => {
        const asia = new Province(sampleProvinceData());
        expect(asia.shortfall).toBe(5);
    });

    it('[성공] profit should be 230', () => {
        const asia = new Province(sampleProvinceData());
        expect(asia.profit).toBe(230);
    });
});

