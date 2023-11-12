class TemperatureRange {
    constructor(readonly low: number, readonly high: number) {
    }
}

class Room {
    daysTempRange;

    constructor(readonly min: number, readonly max: number) {
        this.daysTempRange = new TemperatureRange(min, max);
    }
}

class HeatingPlan {
    private readonly _temperatureRange: TemperatureRange;

    constructor(low: number, high: number) {
        this._temperatureRange = new TemperatureRange(low, high);
    }

    withinRange(tempRange: TemperatureRange) {
        return tempRange.low >= this._temperatureRange.low &&
            tempRange.high <= this._temperatureRange.high;
    }
}

const client = () => {
    const plan = new HeatingPlan(21, 25);

    const room = new Room(22, 24);
    const tempRange = room.daysTempRange;
    const isWithinRange = plan.withinRange(tempRange);
    if (!isWithinRange) {
        console.log('방 온도가 지정 범위를 벗어났습니다.');
    } else {
        console.log('적정 온도입니다.');
    }
};

client();
