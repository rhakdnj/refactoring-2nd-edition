import { ChronoUnit, LocalDate, Period } from '@js-joda/core';

class CatalogItem {
    private readonly _id;
    private readonly _title;
    private _tags;

    constructor(id: string | null, title: string, tags: string[]) {
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

    hasTag(tag: string) {
        return this._tags.includes(tag);
    }
}

class Scroll {
    private readonly _id: string
    private _catalogItem: CatalogItem;
    private _lastCleaned;

    constructor(id: string, title: string, tags: string[], lastCleaned: LocalDate) {
        this._id = id;
        this._catalogItem = new CatalogItem(null, title, tags);
        this._lastCleaned = lastCleaned;
    }

    get id() {
        return this._id;
    }

    get title() {
        return this._catalogItem.title;
    }

    hasTag(tag: string) {
        return this._catalogItem.hasTag(tag);
    }

    needsCleaning(targetDate: LocalDate) {
        const threshold = this._catalogItem.hasTag('revered') ? 700 : 1500;
        return this.daysSinceLastCleaning(targetDate) > threshold;
    }

    daysSinceLastCleaning(targetDate: LocalDate) {
        return this._lastCleaned.until(targetDate, ChronoUnit.DAYS);
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
        lastCleaned: '2021-11-01',
    },
    {
        id: 'B002',
        catalogData: {
            id: 'fieball',
            title: '파이어볼',
            tags: ['magic'],
        },
        lastCleaned: '2021-09-01',
    },
    {
        id: 'C003',
        catalogData: {
            id: 'meteor',
            title: '메테오',
            tags: ['magic', 'revered'],
        },
        lastCleaned: '2021-02-01',
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
