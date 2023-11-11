class Rating {
    protected readonly _voyage: any;
    protected readonly _histories: any;

    constructor(voyage: any, histories: any) {
        this._voyage = voyage;
        this._histories = histories;
    }

    get value() {
        const vpf = this.voyageProfitFactor;
        const vr = this.voyageRisk;
        const chr = this.captainHistoryRisk;
        return (vpf * 3 > vr + chr * 2) ? 'A' : 'B';
    }

    get voyageRisk() { // 항해 경로 위험요소
        let result = 1;
        if (this._voyage.length > 4) {
            result += 2;
        }
        if (this._voyage.length > 8) {
            result += this._voyage.length - 8;
        }
        if (['중국', '동인도'].includes(this._voyage.zone)) {
            result += 4;
        }
        return Math.max(result, 0);
    }

    get captainHistoryRisk() { // 선장의 항해이력 위험요소
        let result = 1;
        if (this._histories.length < 5) {
            result += 4;
        }
        result += this._histories.filter((v: any) => v.profit < 0).length;
        return Math.max(result, 0);
    };

    get voyageProfitFactor() { // 수익 요인
        let result = 2;
        if (this._voyage.zone === '중국' || this._voyage.zone === '동인도') {
            result += 1;
        }
        result += this.voyageLengthFactor;
        result += this.historyLengthFactor;
        return result;
    }

    protected get voyageLengthFactor(): number {
        return this._voyage.length > 14 ? -1 : 0;
    }

    protected get historyLengthFactor() {
        return this._histories.length > 8 ? 1 : 0;
    }
}

class ExperiencedChinaRating extends Rating {
    get captainHistoryRisk() { // 선장의 항해이력 위험요소
        const result = super.captainHistoryRisk - 2;
        return Math.max(result, 0);
    };

    get voyageProfitFactor() {
        return super.voyageProfitFactor + 3;
    }

    get voyageLengthFactor() {
        let result = 0;
        if (this._voyage.length > 12) {
            result += 1;
        }
        if (this._voyage.length > 18) {
            result -= 1;
        }
        return result;
    }

    get historyLengthFactor() {
        return this._histories.length > 10 ? 1 : 0;
    }
}

const createRating = (voyage: any, histories: any) => {
    if (voyage.zone === '중국' && histories.some((v: any) => v.zone === '중국')) {
        return new ExperiencedChinaRating(voyage, histories);
    }
    return new Rating(voyage, histories);
};

const voyage = {zone: '서인도', length: 10};
const histories = [
    {zone: '동인도', profit: 5},
    {zone: '서인도', profit: 15},
    {zone: '중국', profit: -2},
    {zone: '서아프리카', profit: 7},
];
const myRating = createRating(voyage, histories);

console.log({
    voyageRisk: myRating.voyageRisk,
    captainHistoryRisk: myRating.captainHistoryRisk,
    voyageProfitFactor: myRating.voyageProfitFactor,
    myRating: myRating.value,
});
