class HeatingPlan {
    _max;
    _min;

    constructor() {
        this._max = 0;
        this._min = 0;
    }

    targetTemperature(selectedTemperature: number) {
        if (selectedTemperature > this._max) {
            return this._max;
        } else if (selectedTemperature < this._min) {
            return this._min;
        } else {
            return selectedTemperature;
        }
    }

    compare(stat: any) {
        if (this.targetTemperature(stat.selectedTemperature)) return 1;
        if (this.targetTemperature(stat.selectedTemperature)) return -1;
        return 0;
    }
}

const thermostat = {
    selectedTemperature: 25,
    currentTemperature: 27,
};


const temperatureController = () => {
    const setToHeat = () => {
    };
    const setToCool = () => {
    };
    const setOff = () => {
    };

    const heatingPlan: any = new HeatingPlan();
    const shouldHeat = heatingPlan.compare(thermostat);
    if (shouldHeat === 1) setToHeat();
    else if (shouldHeat === -1) setToCool();
    else setOff();
};
