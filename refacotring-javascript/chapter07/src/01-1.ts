let result = '';
class Organization {
    _name;
    _country;
    constructor(data: any) {
        this._name = data.name;
        this._country = data.country;
    }

    set name(name: string) {
        this._name = name;
    }

    set country(country: string) {
        this._country = country;
    }

    get name() {
        return this._name;
    }

    get country() {
        return this._country;
    }
}
const organization = new Organization({name: '애크미 구스베리', country: 'GB'});

organization.name = '애그머니 블루베리';
result += `<h1>${organization.name}</h1>`;

console.log(result);
