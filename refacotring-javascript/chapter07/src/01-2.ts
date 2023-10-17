import { readJSON } from '../../file.controller';
import * as path from 'path';
import { cloneDeep } from 'lodash';

class CustomerData {
    _data;

    constructor(data: any) {
        this._data = data;
    }

    setUsage = (customerId: string, year: string, month: number, amount: number) => {
        getRawDataOfCustomers()[customerId].usages[year][month] = amount;
    }

    get rawData() {
        return cloneDeep(this._data);
    }
}


let customerData = new CustomerData(readJSON(path.resolve(__dirname, '01-2.json')));

const getCustomerData = () => customerData;
export const getRawDataOfCustomers = () => customerData._data;
const setRawDataOfCustomers = (data: any) => {
    customerData = new CustomerData(data);
};

export const writeData = (customerId: string, year: string, month: number, amount: number) => {
    getCustomerData().setUsage(customerId, year, month, amount);
};

export const compareUsage = (customerId: string, laterYear: number, month: number) => {
    const later = getRawDataOfCustomers()[customerId].usages[laterYear][month];
    const earlier = getRawDataOfCustomers()[customerId].usages[laterYear - 1][month];
    return {laterAmount: later, change: later - earlier};
};
