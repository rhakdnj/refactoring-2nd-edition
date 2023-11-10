class Organization {
    _title;
    _country;

    constructor(data: { title: string, country: string }) {
        this._title = data.title;
        this._country = data.country;
    }

    get title() {
        return this._title;
    }

    set title(aString) {
        this._title = aString;
    }

    get country() {
        return this._country;
    }

    set country(aCountry) {
        this._country = aCountry;
    }
}

const organization: Organization = new Organization({title: '애크미 구스베리', country: 'GB'});
