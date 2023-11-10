import { LocalDate } from '@js-joda/core';

const plan = {
    summerStart: LocalDate.of(2023, 7, 1),
    summerEnd: LocalDate.of(2023, 8, 31),
    summerRate: 1000,
    regularRate: 1100,
    regularServiceCharge: 100,
};

const isSummer = (date: LocalDate) => !date.isBefore(plan.summerStart) && !date.isAfter(plan.summerEnd);

const summerCharge = (quantity: number) => quantity * plan.summerRate;
const regularCharge = (quantity: number) => quantity * plan.regularRate + plan.regularServiceCharge;

const getCharge = (quantity: number, date: LocalDate) =>
    isSummer(date) ? summerCharge(quantity) : regularCharge(quantity);


console.log(getCharge(10, LocalDate.of(2023, 6, 29)));
console.log(getCharge(10, LocalDate.of(2023, 8, 15)));
