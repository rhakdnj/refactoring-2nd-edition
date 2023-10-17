import { readJSON } from '../../file.controller';
import * as path from 'path';
import { IllegalStateException } from '@js-joda/core';

const customerData = readJSON(path.resolve(__dirname, '01-2.json'));

export const writeData = (customerId: string, year: string, month: number, amount: number) => {
    customerData[customerId].usages[year][month] = amount;
};

export const compareUsage = (customerId: string, laterYear: number, month: number) => {
    try {
        const later = customerData[customerId].usages[laterYear][month];
        const earlier = customerData[customerId].usages[laterYear - 1][month];
        return {laterAmount: later, change: later - earlier};
    } catch (error) {
        throw new IllegalStateException();
    }
}
export const getCustomer = () => customerData;
