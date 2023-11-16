import { LocalDate } from '@js-joda/core';
import { result } from 'lodash';


class Booking10_1 {
    private readonly _show;
    private readonly _date;
    private _premiumBockingDelegate: PremiumBockingDelegate10_1 | undefined;

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
        return this._premiumBockingDelegate
            ? this._premiumBockingDelegate.hasTalkback
            : this.show.hasOwnProperty('talkback') && !this.isPeakDay;
    }

    get basePrice(): number {
        let result = this.show.price;
        if (this.isPeakDay) result += Math.round(result * 0.15);
        return this._premiumBockingDelegate
            ? this._premiumBockingDelegate.extendBasePrice(result)
            : result;
    }

    get isPeakDay() {
        return this.date.isAfter(LocalDate.parse('2023-07-15')) &&
            this.date.isBefore(LocalDate.parse('2023-07-31'));
    }

    bePremium(extras: any) {
        this._premiumBockingDelegate = new PremiumBockingDelegate10_1(this, extras);
    }

    get hasDinner() {
        return this._premiumBockingDelegate
            ? this._premiumBockingDelegate.hasDinner
            : undefined
    }
}

class PremiumBockingDelegate10_1 {
    private _host: Booking10_1;
    private _extras: any;

    constructor(host: Booking10_1, extras: any) {
        this._host = host;
        this._extras = extras;
    }

    get hasTalkback() {
        return this._host.show.hasOwnProperty('talkback');
    }

    extendBasePrice(basePrice: number) {
        return Math.round(basePrice + this._extras.premiumFee);
    }

    get hasDinner() {
        return this._extras.hasOwnProperty('dinner') && !this._host.isPeakDay;
    }
}

const createBooking10_1 = (show: any, date: LocalDate) => new Booking10_1(show, date);
const createPremiumBooking10_1 = (show: any, date: LocalDate, extras: any) => {
    const result = new Booking10_1(show, date);
    result.bePremium(extras);
    return result;
};

const booking: Booking10_1 = createBooking10_1(
    {price: 100, talkback: true},
    LocalDate.parse('2023-07-11'));

const premiumBooking1: Booking10_1 = createPremiumBooking10_1(
    {price: 100, talkback: true},
    LocalDate.parse('2023-07-13'),
    {dinner: true, premiumFee: 10});

const premiumBooking2: Booking10_1 = createPremiumBooking10_1(
    {price: 100},
    LocalDate.parse('2023-07-17'),
    {dinner: true, premiumFee: 10});

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
