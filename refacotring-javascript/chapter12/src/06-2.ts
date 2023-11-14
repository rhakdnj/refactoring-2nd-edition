class Employee12_6_2 {
    _name;
    _type;

    constructor(name: string, type: string) {
        this.validateType(type);
        this._name = name;
        this._type = type;
    }

    validateType(arg: string) {
        if (!['engineer', 'manager', 'salesperson'].includes(arg)) throw new Error(`${arg}라는 직원 유형은 없습니다.`);
    }

    get type() {
        return this._type;
    }

    set type(arg) {
        this._type = arg;
    }

    get capitalizedType() {
        return this._type.charAt(0).toUpperCase() + this._type.slice(1).toLowerCase();
    }

    toString() {
        return `${this._name} is a ${this.capitalizedType}`;
    }
}

console.log(new Employee12_6_2('roy', 'engineer').toString());
console.log(new Employee12_6_2('jay', 'manager').toString());
console.log(new Employee12_6_2('kay', 'salesperson').toString());
console.log(new Employee12_6_2('tei', 'nobody').toString());
