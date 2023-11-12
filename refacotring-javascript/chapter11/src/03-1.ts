import { LocalDate, LocalDateTime } from '@js-joda/core';

class Place {
    plusDays(time: number) {
        const dateTime = LocalDateTime.parse('2021-07-08T10:00:00.000');
        return dateTime.plusHours(dateTime.hour() + time);
    }
}

type DeliveryState = 'MA' | 'NH' | 'CT' | 'ME';

class Order {
    private readonly _deliveryState: DeliveryState;
    private readonly _placedOn: Place;

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

const rushDeliveryDate = (order: Order) => {
    let deliveryTime;
    if (['MA', 'CT'].includes(order.deliveryState)) deliveryTime = 1;
    else if (['NY', 'NH'].includes(order.deliveryState)) deliveryTime = 2;
    else deliveryTime = 3;
    return order.placedOn.plusDays(1 + deliveryTime);
}

const regularDeliveryDate = (order: Order) => {
    let deliveryTime;
    if (['MA', 'CT', 'NY'].includes(order.deliveryState)) deliveryTime = 2;
    else if (['ME', 'NH'].includes(order.deliveryState)) deliveryTime = 3;
    else deliveryTime = 4;
    return order.placedOn.plusDays(2 + deliveryTime);
}

console.log(rushDeliveryDate(new Order('MA')).toString());
console.log(rushDeliveryDate(new Order('NH')).toString());
console.log(regularDeliveryDate(new Order('CT')).toString());
console.log(regularDeliveryDate(new Order('ME')).toString());
