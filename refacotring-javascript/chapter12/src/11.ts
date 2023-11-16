import { LocalDate, Period } from '@js-joda/core';

class CatalogItem {
    _id;
    _title;
    _tags;

    constructor(id: string, title: string, tags: string[]) {
        this._id = id;
        this._title = title;
        this._tags = tags;
    }

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    hasTag(arg: string) {
        return this._tags.includes(arg);
    }
}

class Scroll extends CatalogItem {
    #lastCleaned;

    constructor(id: string, title: string, tags: string[], dataLastCleaned: LocalDate) {
        super(id, title, tags);
        this.#lastCleaned = dataLastCleaned;
    }

    needsCleaning(targetDate: LocalDate) {
        const threshold = this.hasTag('revered') ? 700 : 1500;
        return this.daysSinceLastCleaning(targetDate) > threshold;
    }

    daysSinceLastCleaning(targetDate: LocalDate) {
        // TODO: 올바른 계산이 안됨
        let diff = Period.between(this.#lastCleaned, targetDate);
        const diffDays = diff.years() * 365 + diff.months() * 30 + diff.days();
        return diffDays > 0 ? diffDays : Period.between(targetDate, this.#lastCleaned).days();
    }
}

const data = [
    {
        id: 'A001',
        catalogData: {
            id: 'icespear',
            title: '아이스스피어',
            tags: ['magic', 'revered'],
        },
        lastCleaned: '2018-11-01',
    },
    {
        id: 'B002',
        catalogData: {
            id: 'fieball',
            title: '파이어볼',
            tags: ['magic'],
        },
        lastCleaned: '2018-09-01',
    },
    {
        id: 'C003',
        catalogData: {
            id: 'meteor',
            title: '메테오',
            tags: ['magic', 'revered'],
        },
        lastCleaned: '2020-02-01',
    },
];
const scrolls = data.map(
    record => new Scroll(record.id, record.catalogData.title, record.catalogData.tags, LocalDate.parse(record.lastCleaned)),
);
scrolls.forEach(scroll => {
    console.log({
        title: scroll.title,
        needsCleaning: scroll.needsCleaning(LocalDate.now()),
        daysSinceLastCleaning: scroll.daysSinceLastCleaning(LocalDate.now()),
        hasRevered: scroll.hasTag('revered'),
    });
});
