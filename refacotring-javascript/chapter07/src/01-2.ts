import { readJSON } from '../../file.controller';
import * as path from 'path';
import { cloneDeep } from 'lodash';

export class CustomerData {
    #data;

    constructor(data: any) {
        this.#data = data;
    }

    usage(customerId: string, year: number, month: number) {
        return this.#data[customerId].usages[year][month];
    }

    setUsage(customerId: string, year: number, month: number, amount: number)  {
        const newData = cloneDeep(this.#data)
        newData[customerId].usages[year][month] = amount;
        this.#data = newData;
    };

    get rawData() {
        return cloneDeep(this.#data);
    }
}

let customerData = new CustomerData(readJSON(path.resolve(__dirname, '01-2.json')));

export const writeData = (customerId: string, year: number, month: number, amount: number) => {
    customerData.setUsage(customerId, year, month, amount);
};

export const compareUsage = (customerId: string, laterYear: number, month: number) => {
    const later = customerData.usage(customerId, laterYear, month);
    const earlier = customerData.usage(customerId, laterYear - 1, month);
    return {laterAmount: later, change: later - earlier};
};

