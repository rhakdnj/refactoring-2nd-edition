import { readJSON } from '../../file.controller';
import * as path from 'path';
import { cloneDeep } from 'lodash';

class CustomerData {
    _data;

    constructor(data: any) {
        this._data = data;
    }

    usage(customerId: string, year: number, month: number) {
        return this._data[customerId].usages[year][month];
    }

    setUsage = (customerId: string, year: number, month: number, amount: number) => {
        getRawDataOfCustomers()[customerId].usages[year][month] = amount;
    };

    get rawData() {
        return cloneDeep(this._data);
    }
}

let customerData = new CustomerData(readJSON(path.resolve(__dirname, '01-2.json')));

const getCustomerData = () => customerData;
export const getRawDataOfCustomers = () => customerData.rawData;
const setRawDataOfCustomers = (data: any) => {
    customerData = new CustomerData(data);
};

export const writeData = (customerId: string, year: number, month: number, amount: number) => {
    getCustomerData().setUsage(customerId, year, month, amount);
};

export const compareUsage = (customerId: string, laterYear: number, month: number) => {
    const later = customerData.usage(customerId, laterYear, month);
    const earlier = customerData.usage(customerId, laterYear - 1, month);
    return {laterAmount: later, change: later - earlier};
};
