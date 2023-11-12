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
