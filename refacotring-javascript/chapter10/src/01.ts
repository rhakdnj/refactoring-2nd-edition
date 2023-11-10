import { LocalDate } from '@js-joda/core';

const plan = {
    summerStart: LocalDate.of(2023, 7, 1),
    summerEnd: LocalDate.of(2023, 8, 31),
    summerRate: 1000,
    regularRate: 1100,
    regularServiceCharge: 100,
};

const getCharge = (quantity: number, date: LocalDate) => {
    let charge;
    if (!date.isBefore(plan.summerStart) && !date.isAfter(plan.summerEnd)) {
        charge = quantity * plan.summerRate;
    } else {
        charge = quantity * plan.regularRate + plan.regularServiceCharge;
    }
    return charge;
}

console.log(getCharge(10, LocalDate.of(2023, 6, 29)));
console.log(getCharge(10, LocalDate.of(2023, 8, 15)));
