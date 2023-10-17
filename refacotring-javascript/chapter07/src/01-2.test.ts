import { compareUsage, getCustomer, writeData } from './01-2';
import { IllegalStateException } from '@js-joda/core';

describe('customerData', () => {
    it('initial usage of 1920 at 2016/1 to be 50', () => {
        expect(getCustomer()['1920'].usages['2016']['1']).toBe(50);
    })

    it('writeData', () => {
        writeData('1920', '2016', parseInt('1'), 53)
        expect(getCustomer()['1920'].usages['2016']['1']).toBe(53)
    })

    it('compareUsage', () => {
        const {laterAmount, change} = compareUsage('1920', parseInt('2016'), parseInt('1'));
        expect(laterAmount).toBe( 53)
        expect(change).toBe( -17)
    })

    it('compareUsageException', () => {
        expect(() => compareUsage('1920', parseInt('2015'), parseInt('1')))
            .toThrowError(IllegalStateException);
    })
})
