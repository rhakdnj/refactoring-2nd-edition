class Book {
    private readonly _reservations: any[] = [];

    get reservation() {
        return this._reservations;
    }

    public addReservation(customer: { name: string }): void {
        this._reservations.push(customer);
    }
}

const bookCafe = new Book();
bookCafe.addReservation({name: 'joy'});
bookCafe.addReservation({name: 'jay'});
console.log(bookCafe.reservation);
