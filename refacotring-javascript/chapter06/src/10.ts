import _ from 'lodash';

const acquireReading = (): any => ({
    customer: 'ivan',
    quantity: 10,
    month: 5,
    year: 2017,
});
const baseRate = (month: number, year: number) => year - 2000 + month;
const taxThreshold = (year: number) => (year - 2000) * 0.1;

export const enrichReading = (original: any) => {
    const result: any = _.cloneDeep(original);
    result.baseCharge = calculateBaseCharge(result);
    result.taxableCharge = Math.max(0, result.baseCharge - taxThreshold(result.year));
    return result;
};

const calculateBaseCharge = (result: any) => {
    return baseRate(result.month, result.year) * result.quantity;
};

const client1 = () => {
    const reading: any = enrichReading(acquireReading());
    return reading.baseCharge;
};

const client2 = () => {
    const reading = enrichReading(acquireReading());
    return reading.taxableCharge;
};

const client3 = () => {
    const reading = enrichReading(acquireReading());
    return reading.baseCharge;
};

[client1, client2, client3].forEach(c => console.log(c()));
