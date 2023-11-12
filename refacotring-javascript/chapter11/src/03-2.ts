import { LocalDateTime } from '@js-joda/core';

class Place {
    _date: LocalDateTime;

    constructor() {
        this._date = LocalDateTime.parse('2021-07-08T10:00:00.000');
    }

    plusDays(time: number) {
        this._date = this._date.plusHours(this._date.hour() + time);
        return this;
    }

    minusDays(time: number) {
        this._date = this._date.plusHours(this._date.hour() - time);
        return this;
    }

    get date() {
        return this._date;
    }
}

class Order {
    deliveryState: string;
    placedOn: Place;

    constructor(deliveryState: string) {
        this.deliveryState = deliveryState;
        this.placedOn = new Place();
    }
}

const deliveryDate = (order: Order, isRush: boolean) => {
    let deliveryTime = getDeliveryTime(order, isRush);
    let result = order.placedOn.plusDays(2 + deliveryTime);
    if (isRush) result = result.minusDays(1);
    return result;
};

const getDeliveryTime = (order: Order, isRush: boolean) => {
    let result = 0;
    if (['MA', 'CT'].includes(order.deliveryState)) {
        result = isRush ? 1 : 2;
    } else if (['NY', 'NH'].includes(order.deliveryState)) {
        result = 2;
        if (order.deliveryState === 'NH' && isRush) {
            result = 3;
        }
    } else if (isRush) {
        result = 3;
    } else if (order.deliveryState === 'ME') {
        result = 3;
    } else result = 4;

    return result;
};

// Adapter 처럼 사용하자. 다만 Client는 어떻게 구현되는지는 궁금하지 않다.
const rushDeliveryDate = (order: Order) => deliveryDate(order, true);
const regularDeliveryDate = (order: Order) => deliveryDate(order, false);

console.log(rushDeliveryDate(new Order('MA')).date.toString());
console.log(rushDeliveryDate(new Order('NH')).date.toString());
console.log(regularDeliveryDate(new Order('CT')).date.toString());
console.log(regularDeliveryDate(new Order('ME')).date.toString());
