class Employee12_6 {
    #name;

    constructor(name: string) {
        this.#name = name;
    }

    get type() {
        return '';
    }

    toString() {
        return `${this.#name} is a ${this.type}`;
    }
}

class Engineer12_6 extends Employee12_6 {
    get type() {
        return 'engineer';
    }
}

class Manager12_6 extends Employee12_6 {
    get type() {
        return 'manager';
    }
}

class Salesperson12_6 extends Employee12_6 {
    get type() {
        return 'salesperson';
    }
}

const createEmployee = (name: string, type: string) => {
    switch (type) {
        case 'engineer':
            return new Engineer12_6(name);
        case 'manager':
            return new Manager12_6(name);
        case 'salesperson':
            return new Salesperson12_6(name);
        default:
            throw new Error(`${type}라는 직원 유형은 없습니다.`);
    }
};

const roy = createEmployee('roy', 'engineer');
const jay = createEmployee('jay', 'manager');
const kay = createEmployee('kay', 'salesperson');
// const tei = createEmployee('tei', 'nobody');

console.log(roy.toString(), jay.toString(), kay.toString());
