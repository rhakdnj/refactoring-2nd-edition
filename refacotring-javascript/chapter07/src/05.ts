class Person {
    private _name: string;
    private readonly _telephoneNumber: TelephoneNumber;

    constructor(name: string, telephoneNumber: TelephoneNumber) {
        this._name = name;
        this._telephoneNumber = telephoneNumber;
    }

    get name() {
        return this._name;
    }

    set name(arg) {
        this._name = arg;
    }

    get officeAreaCode() {
        return this._telephoneNumber.areaCode;
    }

    set officeAreaCode(arg: string) {
        this._telephoneNumber.areaCode = arg;
    }

    get officeNumber() {
        return this._telephoneNumber.number;
    }

    set officeNumber(arg: string) {
        this._telephoneNumber.number = arg;
    }

    get telephoneNumber() {
        return this._telephoneNumber.toString();
    }
}

class TelephoneNumber {
    private _areaCode: string;
    private _number: string;

    constructor(areaCode: string, number: string) {
        this._areaCode = areaCode;
        this._number = number;
    }

    toString() {
        return `(${this.areaCode}) ${this.number}`;
    }

    get areaCode(): string {
        return this._areaCode;
    }

    set areaCode(arg) {
        this._areaCode = arg;
    }

    get number(): string {
        return this._number;
    }

    set number(arg) {
        this._number = arg;
    }
}
