import { LocalDate } from '@js-joda/core';


class Booking10_1 {
    private readonly _show;
    private readonly _date;

    constructor(show: any, date: LocalDate) {
        this._show = show;
        this._date = date;
    }

    get date() {
        return this._date;
    }

    get show() {
        return this._show;
    }

    get hasTalkback() {
        return this.show.hasOwnProperty('talkback') && !this.isPeakDay;
    }

    get basePrice() {
        let result = this.show.price;
        if (this.isPeakDay) result += Math.round(result * 0.15);
        return result;
    }

    get isPeakDay() {
        return this.date.isAfter(LocalDate.parse('2023-07-15')) &&
            this.date.isBefore(LocalDate.parse('2021-07-31'));
    }
}

class PremiumBooking10_1 extends Booking10_1 {
    _extras;

    constructor(show: any, date: LocalDate, extras: any) {
        super(show, date);
        this._extras = extras;
    }

    get hasTalkback() {
        return this.show.hasOwnProperty('talkback');
    }

    get basePrice() {
        return Math.round(super.basePrice + this._extras.premiumFee);
    }

    get hasDinner() {
        return this._extras.hasOwnProperty('dinner') && !this.isPeakDay;
    }
}

const booking: any = new Booking10_1({price: 100, talkback: true}, LocalDate.parse('2023-07-11'));
const premiumBooking1 = new PremiumBooking10_1(
    {price: 100, talkback: true},
    LocalDate.parse('2023-07-13'),
    {dinner: true, premiumFee: 10,}
);
const premiumBooking2 = new PremiumBooking10_1({price: 100}, LocalDate.parse('2021-07-17'), {
    dinner: true,
    premiumFee: 10,
});

console.log({
    price: booking.basePrice,
    dinner: booking.hasDinner,
    talkback: booking.hasTalkback,
    peakDay: booking.isPeakDay,
});
console.log({
    price: premiumBooking1.basePrice,
    dinner: premiumBooking1.hasDinner,
    talkback: premiumBooking1.hasTalkback,
    peakDay: premiumBooking1.isPeakDay,
});
console.log({
    price: premiumBooking2.basePrice,
    dinner: premiumBooking2.hasDinner,
    talkback: premiumBooking2.hasTalkback,
    peakDay: premiumBooking2.isPeakDay,
});
