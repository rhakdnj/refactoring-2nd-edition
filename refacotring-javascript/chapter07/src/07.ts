class Person {
    _name: string;
    _department: Department | undefined;

    constructor(name: string) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set department(arg: Department) {
        this._department = arg;
    }

    get manager() {
        return this._department?.manager;
    }
}

class Department {
    _chargeCode: string;
    _manager: string;

    constructor(chargeCode: string, manager: string) {
        this._chargeCode = chargeCode;
        this._manager = manager;
    }

    get chargeCode() {
        return this._chargeCode;
    }

    set chargeCode(arg) {
        this._chargeCode = arg;
    }

    get manager() {
        return this._manager;
    }

    set manager(arg) {
        this._manager = arg;
    }
}

const feDev = new Department('BACKEND', '로이');
const jn = new Person('rhakdnj');
jn.department = feDev;

console.log(jn.manager);
