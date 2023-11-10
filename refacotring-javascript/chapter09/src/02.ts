class Organization {
    _name;
    _country;

    constructor(data: { name: string, country: string }) {
        this._name = data.name;
        this._country = data.country;
    }

    get name() {
        return this._name;
    }

    set name(aString) {
        this._name = aString;
    }

    get country() {
        return this._country;
    }

    set country(aCountry) {
        this._country = aCountry;
    }
}

const organization: Organization = new Organization({name: '애크미 구스베리', country: 'GB'});
