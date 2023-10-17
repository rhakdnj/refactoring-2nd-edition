let result = '';
class Organization {
    _data;
    constructor(data: any) {
        this._data = data;
    }

    set name(name: string) {
        this._data.name = name;
    }

    get name() {
        return this._data.name;
    }
}
const organization = new Organization({name: '애크미 구스베리', country: 'GB'});

const getOrganization = () => {
    return organization;
}

getOrganization().name = '애그머니 블루베리';
result += `<h1>${getOrganization().name}</h1>`;

console.log(result);
