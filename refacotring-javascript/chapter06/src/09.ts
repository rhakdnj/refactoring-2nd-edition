const acquireReading = () => ({
    customer: 'ivan',
    quantity: 10,
    month: 5,
    year: 2017,
});

const baseRate = (month: number, year: number) => year - 2000 + month;

const client1 = () => {
    const reading = acquireReading();
    const baseCharge: number = baseRate(reading.month, reading.year) * reading.quantity;
    return baseCharge;
};

const client2 = () => {
    const taxThreshold = (year: number) => (year - 2000) * 0.1;
    const reading: any = acquireReading();
    const base: number = baseRate(reading.month, reading.year) * reading.quantity;
    const taxableCharge: number = Math.max(0, base - taxThreshold(reading.year));
    return taxableCharge;
};

const client3 = () => {
    const reading = acquireReading();
    const calculateBaseCharge = (reading: any) => baseRate(reading.month, reading.year) * reading.quantity;
    const basicChargeAmount = calculateBaseCharge(reading);
    return basicChargeAmount;
};

[client1, client2, client3].forEach(c => console.log(c()));
