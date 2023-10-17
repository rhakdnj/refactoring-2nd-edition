import { compareUsage } from './01-2';
import { readJSON } from '../../file.controller';
import path from 'path';
import { CustomerData } from './01-2';

describe('customerData', () => {
    let customerData: CustomerData;

    beforeEach(() =>
        customerData = new CustomerData(readJSON(path.resolve(__dirname, '01-2.json')))
    );

    it('initial usage of 1920 at 2016/1 to be 50', () => {
        expect(customerData.usage('1920', 2016, 1)).toBe(50);
    })

    it('writeData', () => {
        customerData.setUsage('1920', 2016, 1, 53)
        expect(customerData.rawData['1920'].usages['2016']['1']).toBe(53)
    })

    it('compareUsage', () => {
        const {laterAmount, change} = compareUsage('1920', parseInt('2016'), parseInt('1'));
        expect(laterAmount).toBe( 50)
        expect(change).toBe( -20)
    })
})
