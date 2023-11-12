import { LocalDate, LocalDateTime } from '@js-joda/core';

class Place {
    plusDays(time: number) {
        const dateTime = LocalDateTime.parse('2021-07-08T10:00:00.000');
        dateTime.plusHours(dateTime.hour() + time);
        return dateTime;
    }
}

type DeliveryState = 'MA' | 'NH' | 'CT' | 'ME';

class Order {
    private _deliveryState: DeliveryState;
    private _placedOn;

    constructor(deliveryState: DeliveryState) {
        this._deliveryState = deliveryState;
        this._placedOn = new Place();
    }

    get deliveryState(): DeliveryState {
        return this._deliveryState;
    }

    get placedOn() {
        return this._placedOn;
    }
}

const deliveryDate = (order: Order, isRush: boolean) => {
    if (isRush) {
        let deliveryTime;
        if (['MA', 'CT'].includes(order.deliveryState)) deliveryTime = 1;
        else if (['NY', 'NH'].includes(order.deliveryState)) deliveryTime = 2;
        else deliveryTime = 3;
        return order.placedOn.plusDays(1 + deliveryTime);
    } else {
        let deliveryTime;
        if (['MA', 'CT', 'NY'].includes(order.deliveryState)) deliveryTime = 2;
        else if (['ME', 'NH'].includes(order.deliveryState)) deliveryTime = 3;
        else deliveryTime = 4;
        return order.placedOn.plusDays(2 + deliveryTime);
    }
};

console.log(deliveryDate(new Order('MA'), true));
console.log(deliveryDate(new Order('NH'), true));
console.log(deliveryDate(new Order('CT'), false));
console.log(deliveryDate(new Order('ME'), false));
