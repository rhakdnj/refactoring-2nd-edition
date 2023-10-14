const moreThanFiveLateDeliveries = (driver: any): boolean => driver.numberOfLateDeliveries > 5;
const rating = (driver: any): number => (moreThanFiveLateDeliveries(driver) ? 2 : 1);

const driverA = {name: 'A', numberOfLateDeliveries: 10};
const driverB = {name: 'B', numberOfLateDeliveries: 4};

console.log(driverA.name, rating(driverA));
console.log(driverB.name, rating(driverB));
