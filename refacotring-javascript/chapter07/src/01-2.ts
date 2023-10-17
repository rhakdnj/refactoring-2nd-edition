import { readJSON } from '../../file.controller';
import * as path from 'path';

let customerData = readJSON(path.resolve(__dirname, '01-2.json'));

const getRawDataOfCustomers = () => customerData;

export const writeData = (customerId: string, year: string, month: number, amount: number) => {
    getRawDataOfCustomers()[customerId].usages[year][month] = amount;
};

export const compareUsage = (customerId: string, laterYear: number, month: number) => {
    const later = customerData[customerId].usages[laterYear][month];
    const earlier = customerData[customerId].usages[laterYear - 1][month];
    return {laterAmount: later, change: later - earlier};
};

export const getCustomer = () => customerData;
