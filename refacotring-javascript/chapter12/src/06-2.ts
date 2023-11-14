class Employee12_6_2 {
    _name;
    _type: EmployeeType;

    constructor(name: string, type: string) {
        this.validateType(type);
        this._name = name;
        this._type = Employee12_6_2.createEmployeeType(type); // Setter call
    }

    validateType(arg: string) {
        if (!['engineer', 'manager', 'salesperson'].includes(arg)) throw new Error(`${arg}라는 직원 유형은 없습니다.`);
    }

    static createEmployeeType(arg: string): EmployeeType {
        switch (arg) {
            case 'engineer':
                return new Engineer12_6_2();
            case 'manager':
                return new Manager12_6_2();
            case 'salesperson':
                return new Salesperson12_6_2();
            default:
                throw new Error(`${arg}라는 직원 유형은 없습니다.`);
        }
    }

    get typeString() {
        return this._type.toString();
    }

    get type(): EmployeeType {
        return this._type;
    }

    set type(arg: string) {
        this._type = Employee12_6_2.createEmployeeType(arg);
    }

    toString() {
        return `${this._name} is a ${this.type.capitalizedType}`;
    }
}

class EmployeeType {
    get capitalizedType() {
        return this.toString().charAt(0).toUpperCase() + this.toString().slice(1).toLowerCase();
    }
}

class Engineer12_6_2 extends EmployeeType {
    toString() {
        return 'engineer';
    }
}

class Manager12_6_2 extends EmployeeType {
    toString() {
        return 'manager';
    }
}

class Salesperson12_6_2 extends EmployeeType {
    toString() {
        return 'salesperson';
    }
}

console.log(new Employee12_6_2('roy', 'engineer').toString());
console.log(new Employee12_6_2('jay', 'manager').toString());
console.log(new Employee12_6_2('kay', 'salesperson').toString());
// console.log(new Employee12_6_2('tei', 'nobody').toString());
