import { max, min } from 'lodash';

class TemperatureRange {
    private readonly _high: number;
    private readonly _low: number;

    constructor(low: number, high: number) {
        this._high = high;
        this._low = low;
    }

    get high(): number {
        return this._high;
    }

    get low(): number {
        return this._low;
    }
}

class Room {
    private readonly _daysTempRange;

    constructor(min: number, max: number) {
        this._daysTempRange = new TemperatureRange(min, max);
    }

    get daysTempRange() {
        return this._daysTempRange;
    }
}

class HeatingPlan {
    _temperatureRange;

    constructor(low: number, high: number) {
        this._temperatureRange = new TemperatureRange(low, high);
    }

    withinRange(bottom: number, top: number) {
        return bottom >= this._temperatureRange.low && top <= this._temperatureRange.high;
    }
}

const client = () => {
    const plan = new HeatingPlan(21, 25);

    const room = new Room(22, 24);
    const low = room.daysTempRange.low;
    const high = room.daysTempRange.high;
    if (!plan.withinRange(low, high)) {
        console.log('방 온도가 지정 범위를 벗어났습니다.');
    } else {
        console.log('적정 온도입니다.');
    }
};

client();
