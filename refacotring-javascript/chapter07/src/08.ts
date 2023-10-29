class Person {
    _name: string;
    _department: Department | undefined;

    constructor(name: string, department: Department) {
        this._name = name;
        this._department = department;
    }

    get name() {
        return this._name;
    }

    get manager() {
        return this._department?.manager;
    }
}

class Department {
    _manager: string;

    constructor(manager: string) {
        this._manager = manager;
    }

    get manager() {
        return this._manager;
    }
}

const person: Person = new Person('재남', new Department('로이'));
console.log(person.manager);
