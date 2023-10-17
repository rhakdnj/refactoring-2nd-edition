let result = '';
class Organization {
    _data;
    constructor(data: any) {
        this._data = data;
    }
}
const organization = new Organization({name: '애크미 구스베리', country: 'GB'});

const getRawDataOfOrganization = () => {
    return organization._data;
}
const getOrganization = () => {
    return organization;
}

getRawDataOfOrganization().name = '애그머니 블루베리';
result += `<h1>${getRawDataOfOrganization().name}</h1>`;

console.log(result);
