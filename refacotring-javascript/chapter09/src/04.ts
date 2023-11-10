class TelephoneNumber {
    _areaCode;
    _number;

    constructor(areaCode: string, number: string) {
        this._areaCode = areaCode;
        this._number = number;
    }

    get areaCode() {
        return this._areaCode;
    }

    set areaCode(arg) {
        this._areaCode = arg;
    }

    get number() {
        return this._number;
    }

    set number(arg) {
        this._number = arg;
    }
}

class Person {
    _telephoneNumber;

    constructor(telephoneNumber: TelephoneNumber) {
        this._telephoneNumber = telephoneNumber;
    }

    get officeAreaCode() {
        return this._telephoneNumber.areaCode;
    }

    set officeAreaCode(arg) {
        this._telephoneNumber.areaCode = arg;
    }

    get officeNumber() {
        return this._telephoneNumber.number;
    }

    set officeNumber(arg) {
        this._telephoneNumber.number = arg;
    }
}

const telephoneNumber = new TelephoneNumber('312', '555-0142');
const person = new Person(telephoneNumber);
person.officeAreaCode = '312';
person.officeNumber = '555-0142';
console.log(person.officeAreaCode, person.officeNumber);
