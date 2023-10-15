const station = {
    name: 'ZB1',
    readings: [
        {temp: 47, time: '2016-11-10 09:10'},
        {temp: 53, time: '2016-11-10 09:20'},
        {temp: 58, time: '2016-11-10 09:30'},
        {temp: 53, time: '2016-11-10 09:40'},
        {temp: 51, time: '2016-11-10 09:50'},
    ],
};
const operatingPlan = {
    temperatureFloor: 50,
    temperatureCeiling: 56,
};

class NumberRange {
    constructor(
        private readonly _min: number,
        private readonly _max: number,
    ) {
    }

    contains(number: number) {
        return (number >= this._min && number <= this._max);
    }
}

const range = new NumberRange(operatingPlan.temperatureFloor, operatingPlan.temperatureCeiling);
const readingsOutsideRange = (station: any, range: NumberRange) =>
    station.readings.filter((r: any) => !range.contains(r.temp));

console.log(readingsOutsideRange(station, range));
