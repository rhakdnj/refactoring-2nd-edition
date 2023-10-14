import assert from 'assert';

class Book {
    private readonly _reservations: any[] = [];

    get reservation() {
        return this._reservations;
    }
    public addReservation(customer: any, isPriority: boolean): void {
        assert(typeof isPriority === 'boolean'); // ts guaranteed
        this._reservations.push(customer);
    }
}

const bookCafe = new Book();
bookCafe.addReservation({name: 'joy'}, true);
bookCafe.addReservation({name: 'jay'}, false);
console.log(bookCafe.reservation);
